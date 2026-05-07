use crate::models::executor::ExecutionResult;

#[tauri::command]
pub async fn execute_code(language: String, code: String) -> Result<ExecutionResult, String> {
    let executor = crate::executor::Executor::new();
    executor
        .execute(&language, &code)
        .await
        .map_err(|e| e.to_string())
}
