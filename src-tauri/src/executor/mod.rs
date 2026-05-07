pub mod sandbox;

use crate::models::executor::ExecutionResult;
use std::process::Command;
use std::time::{Duration, Instant};
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

pub struct Executor {
    timeout: Duration,
}

impl Executor {
    pub fn new() -> Self {
        Self {
            timeout: Duration::from_secs(5),
        }
    }

    pub async fn execute(
        &self,
        language: &str,
        code: &str,
    ) -> Result<ExecutionResult, ExecutionError> {
        match language {
            "java" => self.execute_java(code).await,
            "python" => self.execute_python(code).await,
            "javascript" => self.execute_javascript(code).await,
            _ => Err(ExecutionError::UnsupportedLanguage(language.to_string())),
        }
    }

    async fn execute_java(&self, code: &str) -> Result<ExecutionResult, ExecutionError> {
        let temp_dir = std::env::temp_dir().join("codestep_exec");
        std::fs::create_dir_all(&temp_dir)?;

        let file_path = temp_dir.join("Main.java");
        std::fs::write(&file_path, code)?;

        // 编译
        let compile_output = Command::new("javac")
            .arg(&file_path)
            .output()?;

        if !compile_output.status.success() {
            return Ok(ExecutionResult {
                success: false,
                output: String::new(),
                error: Some(String::from_utf8_lossy(&compile_output.stderr).to_string()),
                execution_time_ms: 0,
            });
        }

        // 运行
        let start = Instant::now();
        let run_output = Command::new("java")
            .current_dir(&temp_dir)
            .arg("Main")
            .output()?;

        let elapsed = start.elapsed().as_millis() as u64;

        // 清理
        let _ = std::fs::remove_dir_all(&temp_dir);

        Ok(ExecutionResult {
            success: run_output.status.success(),
            output: String::from_utf8_lossy(&run_output.stdout).to_string(),
            error: if run_output.status.success() {
                None
            } else {
                Some(String::from_utf8_lossy(&run_output.stderr).to_string())
            },
            execution_time_ms: elapsed,
        })
    }

    async fn execute_python(&self, code: &str) -> Result<ExecutionResult, ExecutionError> {
        let temp_dir = std::env::temp_dir().join("codestep_exec");
        std::fs::create_dir_all(&temp_dir)?;

        let file_path = temp_dir.join("main.py");
        std::fs::write(&file_path, code)?;

        let start = Instant::now();
        let output = Command::new("python")
            .arg(&file_path)
            .output()?;

        let elapsed = start.elapsed().as_millis() as u64;
        let _ = std::fs::remove_dir_all(&temp_dir);

        Ok(ExecutionResult {
            success: output.status.success(),
            output: String::from_utf8_lossy(&output.stdout).to_string(),
            error: if output.status.success() {
                None
            } else {
                Some(String::from_utf8_lossy(&output.stderr).to_string())
            },
            execution_time_ms: elapsed,
        })
    }

    async fn execute_javascript(&self, code: &str) -> Result<ExecutionResult, ExecutionError> {
        let temp_dir = std::env::temp_dir().join("codestep_exec");
        std::fs::create_dir_all(&temp_dir)?;

        let file_path = temp_dir.join("main.js");
        std::fs::write(&file_path, code)?;

        let start = Instant::now();
        let output = Command::new("node")
            .arg(&file_path)
            .output()?;

        let elapsed = start.elapsed().as_millis() as u64;
        let _ = std::fs::remove_dir_all(&temp_dir);

        Ok(ExecutionResult {
            success: output.status.success(),
            output: String::from_utf8_lossy(&output.stdout).to_string(),
            error: if output.status.success() {
                None
            } else {
                Some(String::from_utf8_lossy(&output.stderr).to_string())
            },
            execution_time_ms: elapsed,
        })
    }
}
