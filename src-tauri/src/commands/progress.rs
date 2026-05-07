use crate::models::user_progress::UserProgress;

#[tauri::command]
pub async fn save_progress(
    course_id: String,
    step_index: u32,
    completed: bool,
) -> Result<(), String> {
    // TODO: 保存进度到 SQLite
    Ok(())
}

#[tauri::command]
pub async fn get_user_progress() -> Result<UserProgress, String> {
    // TODO: 从 SQLite 读取用户进度
    Ok(UserProgress::default())
}
