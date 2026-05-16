use crate::db::AppState;
use serde::{Deserialize, Serialize};

const DEFAULT_USER_ID: &str = "local_user";

// =========== Request / Response types ===========

#[derive(Debug, Deserialize)]
pub struct ChallengeRunPayload {
    #[serde(rename = "packId")]
    pub pack_id: String,
    #[serde(rename = "challengeMode")]
    pub challenge_mode: String,
    #[serde(rename = "durationMs")]
    pub duration_ms: u32,
    #[serde(rename = "charsTyped")]
    pub chars_typed: u32,
    #[serde(rename = "correctChars")]
    pub correct_chars: u32,
    #[serde(rename = "completedSegments")]
    pub completed_segments: u32,
    pub wpm: f64,
    #[serde(rename = "rawWpm")]
    pub raw_wpm: f64,
    pub accuracy: f64,
    pub errors: u32,
    pub backspaces: u32,
    #[serde(rename = "maxCombo")]
    pub max_combo: u32,
    #[serde(rename = "perfectSegments")]
    pub perfect_segments: u32,
    #[serde(rename = "perfectFailed")]
    pub perfect_failed: bool,
    #[serde(rename = "flowScore")]
    pub flow_score: f64,
    #[serde(rename = "rankScore")]
    pub rank_score: f64,
    #[serde(rename = "weakTokens")]
    pub weak_tokens: Vec<String>,
}

#[derive(Debug, Serialize)]
pub struct ChallengeRunResult {
    pub id: i64,
    #[serde(rename = "packId")]
    pub pack_id: String,
    #[serde(rename = "challengeMode")]
    pub challenge_mode: String,
    #[serde(rename = "durationMs")]
    pub duration_ms: u32,
    #[serde(rename = "charsTyped")]
    pub chars_typed: u32,
    #[serde(rename = "correctChars")]
    pub correct_chars: u32,
    #[serde(rename = "completedSegments")]
    pub completed_segments: u32,
    pub wpm: f64,
    #[serde(rename = "rawWpm")]
    pub raw_wpm: f64,
    pub accuracy: f64,
    pub errors: u32,
    pub backspaces: u32,
    #[serde(rename = "maxCombo")]
    pub max_combo: u32,
    #[serde(rename = "perfectSegments")]
    pub perfect_segments: u32,
    #[serde(rename = "perfectFailed")]
    pub perfect_failed: bool,
    #[serde(rename = "flowScore")]
    pub flow_score: f64,
    #[serde(rename = "rankScore")]
    pub rank_score: f64,
    #[serde(rename = "weakTokens")]
    pub weak_tokens: Vec<String>,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    pub rank: Option<u32>,
    #[serde(rename = "isNewBest")]
    pub is_new_best: bool,
    #[serde(rename = "isTopTen")]
    pub is_top_ten: bool,
}

// =========== Tauri commands ===========

#[tauri::command]
pub async fn record_challenge_run(
    state: tauri::State<'_, AppState>,
    payload: ChallengeRunPayload,
) -> Result<ChallengeRunResult, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let perfect_failed_int: u32 = if payload.perfect_failed { 1 } else { 0 };
    let weak_tokens_json = serde_json::to_string(&payload.weak_tokens).unwrap_or_else(|_| "[]".to_string());

    // 1. Insert challenge_runs
    db.execute(
        "INSERT INTO challenge_runs (user_id, pack_id, challenge_mode, duration_ms, chars_typed, correct_chars, completed_segments, wpm, raw_wpm, accuracy, errors, backspaces, max_combo, perfect_segments, perfect_failed, flow_score, rank_score, weak_tokens)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18)",
        rusqlite::params![
            DEFAULT_USER_ID,
            payload.pack_id,
            payload.challenge_mode,
            payload.duration_ms,
            payload.chars_typed,
            payload.correct_chars,
            payload.completed_segments,
            payload.wpm,
            payload.raw_wpm,
            payload.accuracy,
            payload.errors,
            payload.backspaces,
            payload.max_combo,
            payload.perfect_segments,
            perfect_failed_int,
            payload.flow_score,
            payload.rank_score,
            weak_tokens_json,
        ],
    )
    .map_err(|e| e.to_string())?;

    let run_id = db.last_insert_rowid();

    // 2. Determine rank and whether it's new best
    let rank: Option<u32> = db
        .query_row(
            "SELECT COUNT(*) + 1 FROM challenge_runs
             WHERE user_id = ?1 AND pack_id = ?2 AND challenge_mode = ?3
             AND rank_score > ?4",
            rusqlite::params![DEFAULT_USER_ID, payload.pack_id, payload.challenge_mode, payload.rank_score],
            |row| row.get(0),
        )
        .ok();

    let is_top_ten = rank.map(|r| r <= 10).unwrap_or(false);

    // 3. Read existing best from leaderboard cache
    let old_best: Option<(i64, f64)> = db
        .query_row(
            "SELECT best_run_id, best_rank_score FROM challenge_leaderboard_cache
             WHERE user_id = ?1 AND pack_id = ?2 AND challenge_mode = ?3",
            rusqlite::params![DEFAULT_USER_ID, payload.pack_id, payload.challenge_mode],
            |row| Ok((row.get(0)?, row.get(1)?)),
        )
        .ok();

    let is_new_best = old_best.map_or(true, |(_old_id, old_score)| payload.rank_score > old_score);

    // 4. Upsert leaderboard cache
    if is_new_best {
        db.execute(
            "INSERT INTO challenge_leaderboard_cache (user_id, pack_id, challenge_mode, best_run_id, best_rank_score, best_wpm, best_accuracy, best_combo, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, datetime('now'))
             ON CONFLICT(user_id, pack_id, challenge_mode) DO UPDATE SET
                 best_run_id = ?4,
                 best_rank_score = MAX(challenge_leaderboard_cache.best_rank_score, ?5),
                 best_wpm = MAX(challenge_leaderboard_cache.best_wpm, ?6),
                 best_accuracy = MAX(challenge_leaderboard_cache.best_accuracy, ?7),
                 best_combo = MAX(challenge_leaderboard_cache.best_combo, ?8),
                 updated_at = datetime('now')",
            rusqlite::params![
                DEFAULT_USER_ID,
                payload.pack_id,
                payload.challenge_mode,
                run_id,
                payload.rank_score,
                payload.wpm,
                payload.accuracy,
                payload.max_combo,
            ],
        )
        .map_err(|e| e.to_string())?;
    } else {
        // Still update non-best fields to keep cache fresh
        let _ = db.execute(
            "INSERT INTO challenge_leaderboard_cache (user_id, pack_id, challenge_mode, best_run_id, best_rank_score, best_wpm, best_accuracy, best_combo, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, datetime('now'))
             ON CONFLICT(user_id, pack_id, challenge_mode) DO UPDATE SET
                 updated_at = datetime('now')",
            rusqlite::params![
                DEFAULT_USER_ID,
                payload.pack_id,
                payload.challenge_mode,
                run_id,
                payload.rank_score,
                payload.wpm,
                payload.accuracy,
                payload.max_combo,
            ],
        );
    }

    // 5. Determine created_at
    let created_at: String = db
        .query_row(
            "SELECT created_at FROM challenge_runs WHERE id = ?1",
            rusqlite::params![run_id],
            |row| row.get(0),
        )
        .unwrap_or_default();

    Ok(ChallengeRunResult {
        id: run_id,
        pack_id: payload.pack_id,
        challenge_mode: payload.challenge_mode,
        duration_ms: payload.duration_ms,
        chars_typed: payload.chars_typed,
        correct_chars: payload.correct_chars,
        completed_segments: payload.completed_segments,
        wpm: payload.wpm,
        raw_wpm: payload.raw_wpm,
        accuracy: payload.accuracy,
        errors: payload.errors,
        backspaces: payload.backspaces,
        max_combo: payload.max_combo,
        perfect_segments: payload.perfect_segments,
        perfect_failed: payload.perfect_failed,
        flow_score: payload.flow_score,
        rank_score: payload.rank_score,
        weak_tokens: payload.weak_tokens,
        created_at,
        rank,
        is_new_best,
        is_top_ten,
    })
}

#[tauri::command]
pub async fn get_challenge_leaderboard(
    state: tauri::State<'_, AppState>,
    pack_id: String,
    challenge_mode: String,
    limit: Option<u32>,
) -> Result<Vec<ChallengeRunResult>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(10);

    let mut stmt = db
        .prepare(
            "SELECT id, pack_id, challenge_mode, duration_ms, chars_typed, correct_chars, completed_segments,
                    wpm, raw_wpm, accuracy, errors, backspaces, max_combo, perfect_segments, perfect_failed,
                    flow_score, rank_score, weak_tokens, created_at
             FROM challenge_runs
             WHERE user_id = ?1 AND pack_id = ?2 AND challenge_mode = ?3
             ORDER BY rank_score DESC, accuracy DESC, wpm DESC, created_at DESC
             LIMIT ?4",
        )
        .map_err(|e| e.to_string())?;

    let results: Vec<ChallengeRunResult> = stmt
        .query_map(
            rusqlite::params![DEFAULT_USER_ID, pack_id, challenge_mode, limit],
            |row| {
                let weak_tokens_json: String = row.get(17)?;
                let weak_tokens: Vec<String> =
                    serde_json::from_str(&weak_tokens_json).unwrap_or_default();
                let perfect_failed_int: u32 = row.get(14)?;
                Ok(ChallengeRunResult {
                    id: row.get(0)?,
                    pack_id: row.get(1)?,
                    challenge_mode: row.get(2)?,
                    duration_ms: row.get(3)?,
                    chars_typed: row.get(4)?,
                    correct_chars: row.get(5)?,
                    completed_segments: row.get(6)?,
                    wpm: row.get(7)?,
                    raw_wpm: row.get(8)?,
                    accuracy: row.get(9)?,
                    errors: row.get(10)?,
                    backspaces: row.get(11)?,
                    max_combo: row.get(12)?,
                    perfect_segments: row.get(13)?,
                    perfect_failed: perfect_failed_int != 0,
                    flow_score: row.get(15)?,
                    rank_score: row.get(16)?,
                    weak_tokens,
                    created_at: row.get(18)?,
                    rank: None,   // filled below
                    is_new_best: false,
                    is_top_ten: false,
                })
            },
        )
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    // Assign ranks
    let results: Vec<ChallengeRunResult> = results
        .into_iter()
        .enumerate()
        .map(|(i, mut r)| {
            r.rank = Some((i + 1) as u32);
            r.is_top_ten = (i + 1) <= 10;
            r
        })
        .collect();

    Ok(results)
}

#[tauri::command]
pub async fn get_challenge_run(
    state: tauri::State<'_, AppState>,
    run_id: i64,
) -> Result<Option<ChallengeRunResult>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let result = db
        .query_row(
            "SELECT id, pack_id, challenge_mode, duration_ms, chars_typed, correct_chars, completed_segments,
                    wpm, raw_wpm, accuracy, errors, backspaces, max_combo, perfect_segments, perfect_failed,
                    flow_score, rank_score, weak_tokens, created_at
             FROM challenge_runs
             WHERE user_id = ?1 AND id = ?2",
            rusqlite::params![DEFAULT_USER_ID, run_id],
            |row| {
                let weak_tokens_json: String = row.get(17)?;
                let weak_tokens: Vec<String> =
                    serde_json::from_str(&weak_tokens_json).unwrap_or_default();
                let perfect_failed_int: u32 = row.get(14)?;
                Ok(ChallengeRunResult {
                    id: row.get(0)?,
                    pack_id: row.get(1)?,
                    challenge_mode: row.get(2)?,
                    duration_ms: row.get(3)?,
                    chars_typed: row.get(4)?,
                    correct_chars: row.get(5)?,
                    completed_segments: row.get(6)?,
                    wpm: row.get(7)?,
                    raw_wpm: row.get(8)?,
                    accuracy: row.get(9)?,
                    errors: row.get(10)?,
                    backspaces: row.get(11)?,
                    max_combo: row.get(12)?,
                    perfect_segments: row.get(13)?,
                    perfect_failed: perfect_failed_int != 0,
                    flow_score: row.get(15)?,
                    rank_score: row.get(16)?,
                    weak_tokens,
                    created_at: row.get(18)?,
                    rank: None,
                    is_new_best: false,
                    is_top_ten: false,
                })
            },
        )
        .ok();

    let Some(mut run) = result else {
        return Ok(None);
    };

    let rank: Option<u32> = db
        .query_row(
            "SELECT COUNT(*) + 1 FROM challenge_runs
             WHERE user_id = ?1 AND pack_id = ?2 AND challenge_mode = ?3
             AND rank_score > ?4",
            rusqlite::params![DEFAULT_USER_ID, &run.pack_id, &run.challenge_mode, run.rank_score],
            |row| row.get(0),
        )
        .ok();

    let best_run_id: Option<i64> = db
        .query_row(
            "SELECT id FROM challenge_runs
             WHERE user_id = ?1 AND pack_id = ?2 AND challenge_mode = ?3
             ORDER BY rank_score DESC, accuracy DESC, wpm DESC, created_at DESC
             LIMIT 1",
            rusqlite::params![DEFAULT_USER_ID, &run.pack_id, &run.challenge_mode],
            |row| row.get(0),
        )
        .ok();

    run.rank = rank;
    run.is_top_ten = rank.map(|value| value <= 10).unwrap_or(false);
    run.is_new_best = best_run_id == Some(run.id);

    Ok(Some(run))
}

#[tauri::command]
pub async fn get_challenge_best(
    state: tauri::State<'_, AppState>,
    pack_id: String,
    challenge_mode: String,
) -> Result<Option<ChallengeRunResult>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let result = db
        .query_row(
            "SELECT id, pack_id, challenge_mode, duration_ms, chars_typed, correct_chars, completed_segments,
                    wpm, raw_wpm, accuracy, errors, backspaces, max_combo, perfect_segments, perfect_failed,
                    flow_score, rank_score, weak_tokens, created_at
             FROM challenge_runs
             WHERE user_id = ?1 AND pack_id = ?2 AND challenge_mode = ?3
             ORDER BY rank_score DESC, accuracy DESC, wpm DESC, created_at DESC
             LIMIT 1",
            rusqlite::params![DEFAULT_USER_ID, pack_id, challenge_mode],
            |row| {
                let weak_tokens_json: String = row.get(17)?;
                let weak_tokens: Vec<String> =
                    serde_json::from_str(&weak_tokens_json).unwrap_or_default();
                let perfect_failed_int: u32 = row.get(14)?;
                Ok(ChallengeRunResult {
                    id: row.get(0)?,
                    pack_id: row.get(1)?,
                    challenge_mode: row.get(2)?,
                    duration_ms: row.get(3)?,
                    chars_typed: row.get(4)?,
                    correct_chars: row.get(5)?,
                    completed_segments: row.get(6)?,
                    wpm: row.get(7)?,
                    raw_wpm: row.get(8)?,
                    accuracy: row.get(9)?,
                    errors: row.get(10)?,
                    backspaces: row.get(11)?,
                    max_combo: row.get(12)?,
                    perfect_segments: row.get(13)?,
                    perfect_failed: perfect_failed_int != 0,
                    flow_score: row.get(15)?,
                    rank_score: row.get(16)?,
                    weak_tokens,
                    created_at: row.get(18)?,
                    rank: Some(1),
                    is_new_best: false,
                    is_top_ten: true,
                })
            },
        )
        .ok();

    Ok(result)
}

#[tauri::command]
pub async fn get_recent_challenge_runs(
    state: tauri::State<'_, AppState>,
    limit: Option<u32>,
) -> Result<Vec<ChallengeRunResult>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(10);

    let mut stmt = db
        .prepare(
            "SELECT id, pack_id, challenge_mode, duration_ms, chars_typed, correct_chars, completed_segments,
                    wpm, raw_wpm, accuracy, errors, backspaces, max_combo, perfect_segments, perfect_failed,
                    flow_score, rank_score, weak_tokens, created_at
             FROM challenge_runs
             WHERE user_id = ?1
             ORDER BY created_at DESC
             LIMIT ?2",
        )
        .map_err(|e| e.to_string())?;

    let results: Vec<ChallengeRunResult> = stmt
        .query_map(rusqlite::params![DEFAULT_USER_ID, limit], |row| {
            let weak_tokens_json: String = row.get(17)?;
            let weak_tokens: Vec<String> =
                serde_json::from_str(&weak_tokens_json).unwrap_or_default();
            let perfect_failed_int: u32 = row.get(14)?;
            Ok(ChallengeRunResult {
                id: row.get(0)?,
                pack_id: row.get(1)?,
                challenge_mode: row.get(2)?,
                duration_ms: row.get(3)?,
                chars_typed: row.get(4)?,
                correct_chars: row.get(5)?,
                completed_segments: row.get(6)?,
                wpm: row.get(7)?,
                raw_wpm: row.get(8)?,
                accuracy: row.get(9)?,
                errors: row.get(10)?,
                backspaces: row.get(11)?,
                max_combo: row.get(12)?,
                perfect_segments: row.get(13)?,
                perfect_failed: perfect_failed_int != 0,
                flow_score: row.get(15)?,
                rank_score: row.get(16)?,
                weak_tokens,
                created_at: row.get(18)?,
                rank: None,
                is_new_best: false,
                is_top_ten: false,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(results)
}
