use crate::db::AppState;
use serde::{Deserialize, Serialize};

const DEFAULT_USER_ID: &str = "local_user";

// =========== Request / Response types ===========

#[derive(Debug, Deserialize)]
pub struct TypingAttemptPayload {
    #[serde(rename = "courseId")]
    pub course_id: String,
    #[serde(rename = "stepIndex")]
    pub step_index: u32,
    #[serde(rename = "patternId")]
    pub pattern_id: String,
    pub wpm: f64,
    #[serde(rename = "rawWpm")]
    pub raw_wpm: f64,
    pub accuracy: f64,
    pub errors: u32,
    pub backspaces: u32,
    #[serde(rename = "maxCombo")]
    pub max_combo: u32,
    #[serde(rename = "flowScore")]
    pub flow_score: f64,
    #[serde(rename = "durationMs")]
    pub duration_ms: u32,
    pub perfect: bool,
    #[serde(rename = "weakTokens")]
    pub weak_tokens: Vec<String>,
    #[serde(rename = "localDay")]
    pub local_day: String,
}

#[derive(Debug, Serialize)]
pub struct GrowthSummary {
    #[serde(rename = "totalAttempts")]
    pub total_attempts: u32,
    #[serde(rename = "avgWpm")]
    pub avg_wpm: f64,
    #[serde(rename = "avgAccuracy")]
    pub avg_accuracy: f64,
    #[serde(rename = "bestCombo")]
    pub best_combo: u32,
    #[serde(rename = "totalTimeMin")]
    pub total_time_min: u32,
    #[serde(rename = "completedCourses")]
    pub completed_courses: u32,
    #[serde(rename = "todayImproved")]
    pub today_improved: bool,
    #[serde(rename = "todayDelta")]
    pub today_delta: i32,
    #[serde(rename = "recentWpm")]
    pub recent_wpm: f64,
    #[serde(rename = "recentAccuracy")]
    pub recent_accuracy: f64,
    #[serde(rename = "hasActivity")]
    pub has_activity: bool,
}

#[derive(Debug, Serialize)]
pub struct TrainingPackGrowth {
    #[serde(rename = "packId")]
    pub pack_id: String,
    #[serde(rename = "masteryPercent")]
    pub mastery_percent: f64,
    #[serde(rename = "bestWpm")]
    pub best_wpm: f64,
    #[serde(rename = "bestFlowScore")]
    pub best_flow_score: f64,
    #[serde(rename = "bestCombo")]
    pub best_combo: u32,
    #[serde(rename = "todayDelta")]
    pub today_delta: i32,
    #[serde(rename = "recentTrend")]
    pub recent_trend: f64,
    #[serde(rename = "lastPracticedAt")]
    pub last_practiced_at: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct WeakTokenStat {
    pub token: String,
    pub count: u32,
    #[serde(rename = "packId")]
    pub pack_id: String,
    #[serde(rename = "patternId")]
    pub pattern_id: String,
}

// =========== Mastery helpers ===========

fn compute_attempt_score(wpm: f64, accuracy: f64, max_combo: u32, errors: u32, perfect: bool) -> f64 {
    let wpm_score = (wpm / 60.0).min(1.0) * 30.0;
    let accuracy_score = (accuracy / 100.0) * 30.0;
    let combo_score = ((max_combo as f64) / 20.0).min(1.0) * 20.0;
    let error_penalty = ((errors as f64) * 2.0).min(20.0);
    let perfect_bonus = if perfect { 10.0 } else { 0.0 };
    (wpm_score + accuracy_score + combo_score - error_penalty + perfect_bonus).clamp(0.0, 100.0)
}

// =========== Tauri commands ===========

#[tauri::command]
pub async fn record_typing_attempt(
    state: tauri::State<'_, AppState>,
    payload: TypingAttemptPayload,
) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let perfect_int: u32 = if payload.perfect { 1 } else { 0 };
    let weak_tokens_json = serde_json::to_string(&payload.weak_tokens).unwrap_or_else(|_| "[]".to_string());

    // 1. Insert typing_attempts
    db.execute(
        "INSERT INTO typing_attempts (user_id, course_id, step_index, pattern_id, wpm, accuracy, errors, backspaces, max_combo, flow_score, duration_ms, perfect, weak_tokens, local_day)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)",
        rusqlite::params![
            DEFAULT_USER_ID,
            payload.course_id,
            payload.step_index,
            payload.pattern_id,
            payload.wpm,
            payload.accuracy,
            payload.errors,
            payload.backspaces,
            payload.max_combo,
            payload.flow_score,
            payload.duration_ms,
            perfect_int,
            weak_tokens_json,
            payload.local_day,
        ],
    )
    .map_err(|e| e.to_string())?;

    let pack_id = &payload.course_id;

    // 2. Read existing pack stats
    let existing: Option<(f64, f64, u32, i32)> = db
        .query_row(
            "SELECT best_wpm, best_flow_score, best_combo, today_delta FROM training_pack_stats WHERE user_id = ?1 AND pack_id = ?2",
            rusqlite::params![DEFAULT_USER_ID, pack_id],
            |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?)),
        )
        .ok();

    let (old_best_wpm, old_best_flow, old_best_combo, old_today_delta) =
        existing.unwrap_or((0.0, 0.0, 0, 0));

    let today_delta = if old_best_flow > 0.0 && payload.flow_score > old_best_flow {
        (((payload.flow_score - old_best_flow) / old_best_flow) * 100.0).round() as i32
    } else {
        old_today_delta
    };
    let new_best_wpm = old_best_wpm.max(payload.wpm);
    let new_best_flow = old_best_flow.max(payload.flow_score);
    let new_best_combo = old_best_combo.max(payload.max_combo);

    // 3. Upsert training_pack_stats
    db.execute(
        "INSERT INTO training_pack_stats (user_id, pack_id, mastery_percent, best_wpm, best_flow_score, best_combo, today_delta, recent_trend, last_practiced_at)
         VALUES (?1, ?2, 0, ?3, ?4, ?5, ?6, ?7, datetime('now'))
         ON CONFLICT(user_id, pack_id) DO UPDATE SET
             best_wpm = MAX(training_pack_stats.best_wpm, ?3),
             best_flow_score = MAX(training_pack_stats.best_flow_score, ?4),
             best_combo = MAX(training_pack_stats.best_combo, ?5),
             today_delta = MAX(training_pack_stats.today_delta, ?6),
             recent_trend = ?7,
             last_practiced_at = datetime('now')",
        rusqlite::params![
            DEFAULT_USER_ID,
            pack_id,
            new_best_wpm,
            new_best_flow,
            new_best_combo,
            today_delta,
            payload.flow_score,
        ],
    )
    .map_err(|e| e.to_string())?;

    // 4. Update pattern_mastery
    let attempt_score = compute_attempt_score(
        payload.wpm,
        payload.accuracy,
        payload.max_combo,
        payload.errors,
        payload.perfect,
    );

    let existing_pattern: Option<(u32, f64, f64, f64)> = db
        .query_row(
            "SELECT attempts, mastery_percent, best_wpm, best_flow_score FROM pattern_mastery WHERE user_id = ?1 AND pack_id = ?2 AND pattern_id = ?3",
            rusqlite::params![DEFAULT_USER_ID, pack_id, payload.pattern_id],
            |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?)),
        )
        .ok();

    let (old_attempts, old_mastery, old_pattern_best_wpm, old_pattern_best_flow) =
        existing_pattern.unwrap_or((0, 0.0, 0.0, 0.0));

    let new_attempts = old_attempts + 1;
    let weight = 1.0 / (new_attempts.min(5) as f64);
    let new_mastery = if old_attempts == 0 {
        attempt_score
    } else {
        old_mastery * (1.0 - weight) + attempt_score * weight
    };

    let _new_pattern_best_wpm = old_pattern_best_wpm.max(payload.wpm);
    let _new_pattern_best_flow = old_pattern_best_flow.max(payload.flow_score);

    db.execute(
        "INSERT INTO pattern_mastery (user_id, pack_id, pattern_id, attempts, mastery_percent, best_wpm, best_flow_score, recent_trend, weak_tokens)
         VALUES (?1, ?2, ?3, 1, ?4, ?5, ?6, ?7, ?8)
         ON CONFLICT(user_id, pack_id, pattern_id) DO UPDATE SET
             attempts = attempts + 1,
             mastery_percent = ?4,
             best_wpm = MAX(pattern_mastery.best_wpm, ?5),
             best_flow_score = MAX(pattern_mastery.best_flow_score, ?6),
             recent_trend = ?7,
             weak_tokens = ?8",
        rusqlite::params![
            DEFAULT_USER_ID,
            pack_id,
            payload.pattern_id,
            new_mastery,
            payload.wpm,
            payload.flow_score,
            attempt_score,
            weak_tokens_json,
        ],
    )
    .map_err(|e| e.to_string())?;

    // 5. Update pack mastery as average of pattern mastery values
    let avg_mastery: f64 = db
        .query_row(
            "SELECT COALESCE(AVG(mastery_percent), 0) FROM pattern_mastery WHERE user_id = ?1 AND pack_id = ?2",
            rusqlite::params![DEFAULT_USER_ID, pack_id],
            |row| row.get(0),
        )
        .unwrap_or(0.0);

    db.execute(
        "UPDATE training_pack_stats SET mastery_percent = ?1 WHERE user_id = ?2 AND pack_id = ?3",
        rusqlite::params![avg_mastery, DEFAULT_USER_ID, pack_id],
    )
    .map_err(|e| e.to_string())?;

    // 6. Update weak_token_stats
    for token in &payload.weak_tokens {
        let _ = db.execute(
            "INSERT INTO weak_token_stats (user_id, pack_id, pattern_id, token, count, last_seen_at)
             VALUES (?1, ?2, ?3, ?4, 1, datetime('now'))
             ON CONFLICT(user_id, pack_id, pattern_id, token) DO UPDATE SET
                 count = count + 1,
                 last_seen_at = datetime('now')",
            rusqlite::params![DEFAULT_USER_ID, pack_id, payload.pattern_id, token],
        );
    }

    Ok(())
}

#[tauri::command]
pub async fn get_growth_summary(
    state: tauri::State<'_, AppState>,
) -> Result<GrowthSummary, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let total_attempts: u32 = db
        .query_row(
            "SELECT COUNT(*) FROM typing_attempts WHERE user_id = ?1",
            rusqlite::params![DEFAULT_USER_ID],
            |row| row.get(0),
        )
        .unwrap_or(0);

    if total_attempts == 0 {
        return Ok(GrowthSummary {
            total_attempts: 0,
            avg_wpm: 0.0,
            avg_accuracy: 0.0,
            best_combo: 0,
            total_time_min: 0,
            completed_courses: 0,
            today_improved: false,
            today_delta: 0,
            recent_wpm: 0.0,
            recent_accuracy: 0.0,
            has_activity: false,
        });
    }

    let recent_avg: (f64, f64) = db
        .query_row(
            "SELECT COALESCE(AVG(wpm), 0), COALESCE(AVG(accuracy), 0) FROM (
                SELECT wpm, accuracy FROM typing_attempts WHERE user_id = ?1 ORDER BY id DESC LIMIT 10
            )",
            rusqlite::params![DEFAULT_USER_ID],
            |row| Ok((row.get(0)?, row.get(1)?)),
        )
        .unwrap_or((0.0, 0.0));

    let avg_wpm: f64 = db
        .query_row(
            "SELECT COALESCE(AVG(wpm), 0) FROM typing_attempts WHERE user_id = ?1",
            rusqlite::params![DEFAULT_USER_ID],
            |row| row.get(0),
        )
        .unwrap_or(0.0);

    let avg_accuracy: f64 = db
        .query_row(
            "SELECT COALESCE(AVG(accuracy), 0) FROM typing_attempts WHERE user_id = ?1",
            rusqlite::params![DEFAULT_USER_ID],
            |row| row.get(0),
        )
        .unwrap_or(0.0);

    let best_combo: u32 = db
        .query_row(
            "SELECT COALESCE(MAX(max_combo), 0) FROM typing_attempts WHERE user_id = ?1",
            rusqlite::params![DEFAULT_USER_ID],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let total_duration_ms: u32 = db
        .query_row(
            "SELECT COALESCE(SUM(duration_ms), 0) FROM typing_attempts WHERE user_id = ?1",
            rusqlite::params![DEFAULT_USER_ID],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let completed_courses: u32 = db
        .query_row(
            "SELECT COUNT(*) FROM course_progress WHERE user_id = ?1 AND completed_at IS NOT NULL",
            rusqlite::params![DEFAULT_USER_ID],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let today_improved: bool = db
        .query_row(
            "SELECT EXISTS(SELECT 1 FROM training_pack_stats WHERE user_id = ?1 AND today_delta > 0)",
            rusqlite::params![DEFAULT_USER_ID],
            |row| row.get(0),
        )
        .unwrap_or(false);

    let today_delta: i32 = db
        .query_row(
            "SELECT COALESCE(MAX(today_delta), 0) FROM training_pack_stats WHERE user_id = ?1",
            rusqlite::params![DEFAULT_USER_ID],
            |row| row.get(0),
        )
        .unwrap_or(0);

    Ok(GrowthSummary {
        total_attempts,
        avg_wpm: (avg_wpm * 10.0).round() / 10.0,
        avg_accuracy: (avg_accuracy * 10.0).round() / 10.0,
        best_combo,
        total_time_min: total_duration_ms / 60000,
        completed_courses,
        today_improved,
        today_delta,
        recent_wpm: (recent_avg.0 * 10.0).round() / 10.0,
        recent_accuracy: (recent_avg.1 * 10.0).round() / 10.0,
        has_activity: true,
    })
}

#[tauri::command]
pub async fn get_training_pack_growth(
    state: tauri::State<'_, AppState>,
    pack_id: String,
) -> Result<Option<TrainingPackGrowth>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let result = db
        .query_row(
            "SELECT mastery_percent, best_wpm, best_flow_score, best_combo, today_delta, recent_trend, last_practiced_at
             FROM training_pack_stats WHERE user_id = ?1 AND pack_id = ?2",
            rusqlite::params![DEFAULT_USER_ID, pack_id],
            |row| {
                Ok(TrainingPackGrowth {
                    pack_id: pack_id.clone(),
                    mastery_percent: row.get(0)?,
                    best_wpm: row.get(1)?,
                    best_flow_score: row.get(2)?,
                    best_combo: row.get(3)?,
                    today_delta: row.get(4)?,
                    recent_trend: row.get(5)?,
                    last_practiced_at: row.get(6)?,
                })
            },
        )
        .ok();

    Ok(result)
}

#[tauri::command]
pub async fn get_weak_token_stats(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<WeakTokenStat>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let mut stmt = db
        .prepare(
            "SELECT token, SUM(count) as total_count, pack_id, pattern_id
             FROM weak_token_stats
             WHERE user_id = ?1
             GROUP BY token
             ORDER BY total_count DESC
             LIMIT 8",
        )
        .map_err(|e| e.to_string())?;

    let results = stmt
        .query_map(rusqlite::params![DEFAULT_USER_ID], |row| {
            Ok(WeakTokenStat {
                token: row.get(0)?,
                count: row.get(1)?,
                pack_id: row.get(2)?,
                pattern_id: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(results)
}

#[tauri::command]
pub async fn import_legacy_growth_data(
    state: tauri::State<'_, AppState>,
    pack_stats_json: String,
    user_stats_json: String,
) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    #[derive(Deserialize)]
    struct LegacyPackStats {
        #[serde(default, rename = "todayDelta")]
        today_delta: i32,
        #[serde(default, rename = "masteryPercent")]
        mastery_percent: f64,
        #[serde(default, rename = "bestWpm")]
        best_wpm: f64,
        #[serde(default, rename = "bestCombo")]
        best_combo: u32,
        #[serde(default, rename = "lastPracticedAt")]
        last_practiced_at: Option<String>,
    }

    let pack_stats: std::collections::HashMap<String, LegacyPackStats> =
        serde_json::from_str(&pack_stats_json).unwrap_or_default();

    for (pack_id, stats) in &pack_stats {
        let _ = db.execute(
            "INSERT INTO training_pack_stats (user_id, pack_id, mastery_percent, best_wpm, best_flow_score, best_combo, today_delta, recent_trend, last_practiced_at)
             VALUES (?1, ?2, ?3, ?4, 0, ?5, ?6, 0, ?7)
             ON CONFLICT(user_id, pack_id) DO UPDATE SET
                 mastery_percent = MAX(training_pack_stats.mastery_percent, ?3),
                 best_wpm = MAX(training_pack_stats.best_wpm, ?4),
                 best_combo = MAX(training_pack_stats.best_combo, ?5),
                 today_delta = MAX(training_pack_stats.today_delta, ?6),
                 last_practiced_at = COALESCE(training_pack_stats.last_practiced_at, ?7)",
            rusqlite::params![
                DEFAULT_USER_ID,
                pack_id,
                stats.mastery_percent,
                stats.best_wpm,
                stats.best_combo,
                stats.today_delta,
                stats.last_practiced_at,
            ],
        );
    }

    #[derive(Deserialize)]
    struct LegacyStepStat {
        #[serde(default, rename = "weakTokens")]
        weak_tokens: Vec<String>,
        #[serde(default, rename = "courseId")]
        course_id: String,
    }

    #[derive(Deserialize, Default)]
    struct LegacyUserState {
        #[serde(default, rename = "stepStats")]
        step_stats: Vec<LegacyStepStat>,
    }

    #[derive(Deserialize, Default)]
    struct LegacyUser {
        #[serde(default)]
        state: LegacyUserState,
    }

    let user: LegacyUser = serde_json::from_str(&user_stats_json).unwrap_or_default();

    for stat in &user.state.step_stats {
        let pack_id = &stat.course_id;
        for token in &stat.weak_tokens {
            let _ = db.execute(
                "INSERT INTO weak_token_stats (user_id, pack_id, pattern_id, token, count, last_seen_at)
                 VALUES (?1, ?2, '', ?3, 1, datetime('now'))
                 ON CONFLICT(user_id, pack_id, pattern_id, token) DO UPDATE SET
                     count = count + 1,
                     last_seen_at = datetime('now')",
                rusqlite::params![DEFAULT_USER_ID, pack_id, token],
            );
        }
    }

    Ok(())
}
