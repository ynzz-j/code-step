use crate::db::AppState;

const DEFAULT_USER_ID: &str = "local_user";

/// 单课程进度响应
#[derive(Debug, serde::Serialize)]
pub struct CourseProgressResponse {
    pub course_id: String,
    pub current_step: u32,
    pub completed_steps: Vec<u32>,
    pub time_spent: u32,
}

#[tauri::command]
pub async fn save_progress(
    state: tauri::State<'_, AppState>,
    course_id: String,
    current_step: u32,
    completed_steps: Vec<u32>,
    time_spent: u32,
) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let completed_json = serde_json::to_string(&completed_steps).unwrap_or_else(|_| "[]".to_string());
    
    eprintln!("[Progress] save_progress called: course_id={}, current_step={}, completed={:?}, time_spent={}", 
        course_id, current_step, completed_steps, time_spent);

    // 使用 UPSERT 语法保存或更新进度
    db.execute(
        r#"
        INSERT INTO course_progress (user_id, course_id, current_step, completed_steps, started_at, time_spent)
        VALUES (?1, ?2, ?3, ?4, datetime('now'), ?5)
        ON CONFLICT(user_id, course_id) DO UPDATE SET
            current_step = ?3,
            completed_steps = ?4,
            time_spent = ?5
        "#,
        rusqlite::params![DEFAULT_USER_ID, course_id, current_step, completed_json, time_spent],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn get_user_progress(
    state: tauri::State<'_, AppState>,
    course_id: String,
) -> Result<Option<CourseProgressResponse>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let mut stmt = db
        .prepare(
            "SELECT current_step, completed_steps, time_spent FROM course_progress
             WHERE user_id = ?1 AND course_id = ?2",
        )
        .map_err(|e| e.to_string())?;

    let result = stmt
        .query_row(rusqlite::params![DEFAULT_USER_ID, course_id], |row| {
            let current_step: u32 = row.get(0)?;
            let completed_json: String = row.get(1)?;
            let time_spent: u32 = row.get(2)?;
            Ok((current_step, completed_json, time_spent))
        })
        .ok();

    match result {
        Some((current_step, completed_json, time_spent)) => {
            let completed_steps: Vec<u32> =
                serde_json::from_str(&completed_json).unwrap_or_default();
            Ok(Some(CourseProgressResponse {
                course_id,
                current_step,
                completed_steps,
                time_spent,
            }))
        }
        None => Ok(None),
    }
}
