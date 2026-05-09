pub mod sandbox;

use crate::models::executor::{ExecutionErrorType, ExecutionResult};
use std::process::Stdio;
use std::time::Instant;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ExecutionError {
    #[error("Compilation error: {0}")]
    CompileError(String),
    #[error("Runtime error: {0}")]
    RuntimeError(String),
    #[error("Timeout: execution exceeded {0}ms")]
    Timeout(u64),
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
    #[error("Unsupported language: {0}")]
    UnsupportedLanguage(String),
}

const RUN_TIMEOUT_SECS: u64 = 5;
const COMPILE_TIMEOUT_SECS: u64 = 10;

pub struct Executor;

impl Executor {
    pub fn new() -> Self {
        Self
    }

    pub async fn execute(
        &self,
        language: &str,
        code: &str,
        stdin: Option<&str>,
    ) -> Result<ExecutionResult, ExecutionError> {
        let id = uuid::Uuid::new_v4().to_string();
        let temp_dir = std::env::temp_dir().join(format!("codestep_exec_{}", id));
        std::fs::create_dir_all(&temp_dir)?;

        let result = match language {
            "java" => self.execute_java_with_timeout(&temp_dir, code, stdin).await,
            "python" => self.execute_python_with_timeout(&temp_dir, code, stdin).await,
            "javascript" => self.execute_javascript_with_timeout(&temp_dir, code, stdin).await,
            _ => Err(ExecutionError::UnsupportedLanguage(language.to_string())),
        };

        // 无论成功失败都清理临时目录
        let _ = std::fs::remove_dir_all(&temp_dir);
        result
    }

    // ============ Java ============

    async fn execute_java_with_timeout(
        &self,
        temp_dir: &std::path::Path,
        code: &str,
        stdin: Option<&str>,
    ) -> Result<ExecutionResult, ExecutionError> {
        let file_path = temp_dir.join("Main.java");
        std::fs::write(&file_path, code)?;

        let start = Instant::now();

        // 编译（有独立超时）
        let compile_result = tokio::time::timeout(
            std::time::Duration::from_secs(COMPILE_TIMEOUT_SECS),
            self.compile_java(&file_path),
        )
        .await;

        let compile_output = match compile_result {
            Ok(Ok(output)) => output,
            Ok(Err(e)) => {
                return Ok(ExecutionResult {
                    success: false,
                    output: String::new(),
                    error: Some(e.to_string()),
                    execution_time_ms: start.elapsed().as_millis() as u64,
                    error_type: ExecutionErrorType::CompileError,
                });
            }
            Err(_) => {
                return Ok(ExecutionResult {
                    success: false,
                    output: String::new(),
                    error: Some(format!("编译超时 ({}s)", COMPILE_TIMEOUT_SECS)),
                    execution_time_ms: start.elapsed().as_millis() as u64,
                    error_type: ExecutionErrorType::Timeout,
                });
            }
        };

        if !compile_output.status.success() {
            let stderr = String::from_utf8_lossy(&compile_output.stderr).to_string();
            return Ok(ExecutionResult {
                success: false,
                output: String::new(),
                error: Some(stderr),
                execution_time_ms: start.elapsed().as_millis() as u64,
                error_type: ExecutionErrorType::CompileError,
            });
        }

        // 运行（有独立超时）
        let run_start = Instant::now();
        let run_result = tokio::time::timeout(
            std::time::Duration::from_secs(RUN_TIMEOUT_SECS),
            self.run_java(temp_dir, stdin),
        )
        .await;

        let run_elapsed = run_start.elapsed().as_millis() as u64;

        match run_result {
            Ok(Ok(output)) => Ok(ExecutionResult {
                success: output.status.success(),
                output: String::from_utf8_lossy(&output.stdout).to_string(),
                error: if output.status.success() {
                    None
                } else {
                    Some(String::from_utf8_lossy(&output.stderr).to_string())
                },
                execution_time_ms: run_elapsed,
                error_type: if output.status.success() {
                    ExecutionErrorType::None
                } else {
                    ExecutionErrorType::RuntimeError
                },
            }),
            Ok(Err(e)) => Ok(ExecutionResult {
                success: false,
                output: String::new(),
                error: Some(e.to_string()),
                execution_time_ms: run_elapsed,
                error_type: ExecutionErrorType::RuntimeError,
            }),
            Err(_) => Ok(ExecutionResult {
                success: false,
                output: String::new(),
                error: Some(format!("执行超时 ({}s)", RUN_TIMEOUT_SECS)),
                execution_time_ms: run_elapsed,
                error_type: ExecutionErrorType::Timeout,
            }),
        }
    }

    async fn compile_java(
        &self,
        file_path: &std::path::Path,
    ) -> Result<std::process::Output, std::io::Error> {
        tokio::process::Command::new("javac")
            .arg(file_path)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .output()
            .await
    }

    async fn run_java(
        &self,
        temp_dir: &std::path::Path,
        stdin: Option<&str>,
    ) -> Result<std::process::Output, std::io::Error> {
        let mut cmd = tokio::process::Command::new("java");
        cmd.current_dir(temp_dir)
            .arg("Main")
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());
        if stdin.is_some() {
            cmd.stdin(Stdio::piped());
        }
        run_command(cmd, stdin).await
    }

    // ============ Python ============

    async fn execute_python_with_timeout(
        &self,
        temp_dir: &std::path::Path,
        code: &str,
        stdin: Option<&str>,
    ) -> Result<ExecutionResult, ExecutionError> {
        let file_path = temp_dir.join("main.py");
        std::fs::write(&file_path, code)?;

        let start = Instant::now();
        let run_result = tokio::time::timeout(
            std::time::Duration::from_secs(RUN_TIMEOUT_SECS),
            run_with_stdin("python", &file_path, stdin),
        )
        .await;

        let elapsed = start.elapsed().as_millis() as u64;

        match run_result {
            Ok(Ok(output)) => Ok(ExecutionResult {
                success: output.status.success(),
                output: String::from_utf8_lossy(&output.stdout).to_string(),
                error: if output.status.success() {
                    None
                } else {
                    Some(String::from_utf8_lossy(&output.stderr).to_string())
                },
                execution_time_ms: elapsed,
                error_type: if output.status.success() {
                    ExecutionErrorType::None
                } else {
                    ExecutionErrorType::RuntimeError
                },
            }),
            Ok(Err(e)) => Ok(ExecutionResult {
                success: false,
                output: String::new(),
                error: Some(e.to_string()),
                execution_time_ms: elapsed,
                error_type: ExecutionErrorType::RuntimeError,
            }),
            Err(_) => Ok(ExecutionResult {
                success: false,
                output: String::new(),
                error: Some(format!("执行超时 ({}s)", RUN_TIMEOUT_SECS)),
                execution_time_ms: elapsed,
                error_type: ExecutionErrorType::Timeout,
            }),
        }
    }

    // ============ JavaScript ============

    async fn execute_javascript_with_timeout(
        &self,
        temp_dir: &std::path::Path,
        code: &str,
        stdin: Option<&str>,
    ) -> Result<ExecutionResult, ExecutionError> {
        let file_path = temp_dir.join("main.js");
        std::fs::write(&file_path, code)?;

        let start = Instant::now();
        let run_result = tokio::time::timeout(
            std::time::Duration::from_secs(RUN_TIMEOUT_SECS),
            run_with_stdin("node", &file_path, stdin),
        )
        .await;

        let elapsed = start.elapsed().as_millis() as u64;

        match run_result {
            Ok(Ok(output)) => Ok(ExecutionResult {
                success: output.status.success(),
                output: String::from_utf8_lossy(&output.stdout).to_string(),
                error: if output.status.success() {
                    None
                } else {
                    Some(String::from_utf8_lossy(&output.stderr).to_string())
                },
                execution_time_ms: elapsed,
                error_type: if output.status.success() {
                    ExecutionErrorType::None
                } else {
                    ExecutionErrorType::RuntimeError
                },
            }),
            Ok(Err(e)) => Ok(ExecutionResult {
                success: false,
                output: String::new(),
                error: Some(e.to_string()),
                execution_time_ms: elapsed,
                error_type: ExecutionErrorType::RuntimeError,
            }),
            Err(_) => Ok(ExecutionResult {
                success: false,
                output: String::new(),
                error: Some(format!("执行超时 ({}s)", RUN_TIMEOUT_SECS)),
                execution_time_ms: elapsed,
                error_type: ExecutionErrorType::Timeout,
            }),
        }
    }
}

/// 执行命令，可选写入 stdin 后等待输出
async fn run_with_stdin(
    program: &str,
    file_path: &std::path::Path,
    stdin: Option<&str>,
) -> Result<std::process::Output, std::io::Error> {
    let mut cmd = tokio::process::Command::new(program);
    cmd.arg(file_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    if stdin.is_some() {
        cmd.stdin(Stdio::piped());
    }
    run_command(cmd, stdin).await
}

async fn run_command(
    mut cmd: tokio::process::Command,
    stdin: Option<&str>,
) -> Result<std::process::Output, std::io::Error> {
    if let Some(input) = stdin {
        let mut child = cmd.spawn()?;
        use tokio::io::AsyncWriteExt;
        if let Some(mut child_stdin) = child.stdin.take() {
            child_stdin.write_all(input.as_bytes()).await?;
        }
        child.wait_with_output().await
    } else {
        cmd.output().await
    }
}
