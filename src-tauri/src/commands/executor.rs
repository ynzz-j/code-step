use crate::models::executor::ExecutionResult;

#[tauri::command]
pub async fn execute_code(language: String, code: String, stdin: Option<String>) -> Result<ExecutionResult, String> {
    let executor = crate::executor::Executor::new();
    executor
        .execute(&language, &code, stdin.as_deref())
        .await
        .map_err(|e| e.to_string())
}
