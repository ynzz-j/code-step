use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::process::Command;

/// 环境检测结果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EnvCheckResult {
    pub language: String,
    pub available: bool,
    pub version: Option<String>,
    pub runtime_path: Option<String>,
    pub error_message: Option<String>,
    pub checked_at: DateTime<Utc>,
}

// ---------------------------------------------------------------------------
// Windows 检测实现
// ---------------------------------------------------------------------------

#[cfg(target_os = "windows")]
fn detect_java() -> EnvCheckResult {
    use std::env;
    use std::path::Path;
    use which::which;

    let now = Utc::now();

    // 1. 先尝试 which("java") - PATH 中的 java
    let java_result = which("java");

    // 2. 如果 PATH 中没有，尝试 JAVA_HOME 环境变量
    let java_path = java_result.ok().or_else(|| {
        if let Ok(java_home) = env::var("JAVA_HOME") {
            let java_bin = Path::new(&java_home).join("bin").join("java.exe");
            if java_bin.exists() {
                return Some(java_bin);
            }
        }
        None
    });

    // 3. 如果还是没有，检查常见安装路径
    let java_path = java_path.or_else(|| {
        let common_paths = [
            r"C:\Program Files\Java",
            r"C:\Program Files (x86)\Java",
            r"C:\Program Files\Eclipse Adoptium",
            r"C:\Program Files\Eclipse Foundation",
            r"C:\Program Files\Amazon Corretto",
            r"C:\Program Files\Microsoft",
            r"C:\Users",
        ];
        for base in common_paths {
            if let Ok(entries) = std::fs::read_dir(base) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if path.is_dir() {
                        let bin_java = path.join("bin").join("java.exe");
                        if bin_java.exists() {
                            // 检查是否是 Java JDK/JRE
                            let jre_or_jdk = path.file_name()
                                .and_then(|n| n.to_str())
                                .map(|n| n.to_lowercase())
                                .unwrap_or_default();
                            if jre_or_jdk.contains("java") || 
                               jre_or_jdk.contains("jdk") || 
                               jre_or_jdk.contains("jre") ||
                               jre_or_jdk.contains("corretto") ||
                               jre_or_jdk.contains("adoptium") ||
                               jre_or_jdk.contains("temurin") {
                                return Some(bin_java);
                            }
                        }
                    }
                }
            }
        }
        None
    });

    if java_path.is_none() {
        return EnvCheckResult {
            language: "java".to_string(),
            available: false,
            version: None,
            runtime_path: None,
            error_message: Some("java not found in PATH or common locations. Please install JDK or JRE.".to_string()),
            checked_at: now,
        };
    }

    let java_path = java_path.unwrap();

    // 获取 java 版本
    let version = Command::new("java")
        .arg("--version")
        .output()
        .ok()
        .filter(|o| o.status.success())
        .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string())
        .or_else(|| {
            Command::new("java")
                .arg("-version")
                .output()
                .ok()
                .filter(|o| o.status.success())
                .map(|o| {
                    // java -version 输出到 stderr
                    String::from_utf8_lossy(&o.stderr).trim().to_string()
                })
        });

    // 尝试获取 javac 路径（可选）
    let javac_path = which("javac").ok();

    EnvCheckResult {
        language: "java".to_string(),
        available: true,
        version,
        runtime_path: Some(java_path.display().to_string()),
        error_message: None,
        checked_at: now,
    }
}

#[cfg(target_os = "windows")]
fn detect_python() -> EnvCheckResult {
    use which::which;

    let now = Utc::now();

    match which("python") {
        Ok(path) => {
            let version = Command::new("python")
                .arg("--version")
                .output()
                .ok()
                .filter(|o| o.status.success())
                .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string())
                .or_else(|| {
                    Command::new("python")
                        .arg("-V")
                        .output()
                        .ok()
                        .filter(|o| o.status.success())
                        .map(|o| String::from_utf8_lossy(&o.stderr).trim().to_string())
                });

            EnvCheckResult {
                language: "python".to_string(),
                available: true,
                version,
                runtime_path: Some(path.display().to_string()),
                error_message: None,
                checked_at: now,
            }
        }
        Err(_) => EnvCheckResult {
            language: "python".to_string(),
            available: false,
            version: None,
            runtime_path: None,
            error_message: Some("python not found in PATH".to_string()),
            checked_at: now,
        },
    }
}

#[cfg(target_os = "windows")]
fn detect_nodejs() -> EnvCheckResult {
    use which::which;

    let now = Utc::now();

    match which("node") {
        Ok(path) => {
            let version = Command::new("node")
                .arg("--version")
                .output()
                .ok()
                .filter(|o| o.status.success())
                .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string());

            EnvCheckResult {
                language: "javascript".to_string(),
                available: true,
                version,
                runtime_path: Some(path.display().to_string()),
                error_message: None,
                checked_at: now,
            }
        }
        Err(_) => EnvCheckResult {
            language: "javascript".to_string(),
            available: false,
            version: None,
            runtime_path: None,
            error_message: Some("node not found in PATH".to_string()),
            checked_at: now,
        },
    }
}

#[cfg(target_os = "windows")]
fn detect_cpp() -> EnvCheckResult {
    use which::which;

    let now = Utc::now();

    // 先尝试 g++
    match which("g++") {
        Ok(path) => {
            let version = Command::new("g++")
                .arg("--version")
                .output()
                .ok()
                .filter(|o| o.status.success())
                .map(|o| String::from_utf8_lossy(&o.stdout).lines().next().unwrap_or("").to_string());

            EnvCheckResult {
                language: "cpp".to_string(),
                available: true,
                version,
                runtime_path: Some(path.display().to_string()),
                error_message: None,
                checked_at: now,
            }
        }
        Err(_) => {
            // 尝试 clang++
            match which("clang++") {
                Ok(path) => {
                    let version = Command::new("clang++")
                        .arg("--version")
                        .output()
                        .ok()
                        .filter(|o| o.status.success())
                        .map(|o| String::from_utf8_lossy(&o.stdout).lines().next().unwrap_or("").to_string());

                    EnvCheckResult {
                        language: "cpp".to_string(),
                        available: true,
                        version,
                        runtime_path: Some(path.display().to_string()),
                        error_message: None,
                        checked_at: now,
                    }
                }
                Err(_) => EnvCheckResult {
                    language: "cpp".to_string(),
                    available: false,
                    version: None,
                    runtime_path: None,
                    error_message: Some("g++ or clang++ not found in PATH".to_string()),
                    checked_at: now,
                },
            }
        }
    }
}

// ---------------------------------------------------------------------------
// macOS / Linux 检测实现（预留，后续开发）
// ---------------------------------------------------------------------------

#[cfg(not(target_os = "windows"))]
fn detect_java() -> EnvCheckResult {
    EnvCheckResult {
        language: "java".to_string(),
        available: false,
        version: None,
        runtime_path: None,
        error_message: Some("macOS/Linux 环境检测尚未实现".to_string()),
        checked_at: Utc::now(),
    }
}

#[cfg(not(target_os = "windows"))]
fn detect_python() -> EnvCheckResult {
    use which::which;

    let now = Utc::now();

    match which("python3").or_else(|_| which("python")) {
        Ok(path) => {
            let version = Command::new("python3")
                .arg("--version")
                .output()
                .ok()
                .filter(|o| o.status.success())
                .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string())
                .or_else(|| {
                    Command::new("python")
                        .arg("--version")
                        .output()
                        .ok()
                        .filter(|o| o.status.success())
                        .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string())
                });

            EnvCheckResult {
                language: "python".to_string(),
                available: true,
                version,
                runtime_path: Some(path.display().to_string()),
                error_message: None,
                checked_at: now,
            }
        }
        Err(_) => EnvCheckResult {
            language: "python".to_string(),
            available: false,
            version: None,
            runtime_path: None,
            error_message: Some("python3 not found in PATH".to_string()),
            checked_at: now,
        },
    }
}

#[cfg(not(target_os = "windows"))]
fn detect_nodejs() -> EnvCheckResult {
    use which::which;

    let now = Utc::now();

    match which("node") {
        Ok(path) => {
            let version = Command::new("node")
                .arg("--version")
                .output()
                .ok()
                .filter(|o| o.status.success())
                .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string());

            EnvCheckResult {
                language: "javascript".to_string(),
                available: true,
                version,
                runtime_path: Some(path.display().to_string()),
                error_message: None,
                checked_at: now,
            }
        }
        Err(_) => EnvCheckResult {
            language: "javascript".to_string(),
            available: false,
            version: None,
            runtime_path: None,
            error_message: Some("node not found in PATH".to_string()),
            checked_at: now,
        },
    }
}

#[cfg(not(target_os = "windows"))]
fn detect_cpp() -> EnvCheckResult {
    use which::which;

    let now = Utc::now();

    // 优先 g++，fallback 到 clang++
    let (path, version) = if let Ok(p) = which("g++") {
        let v = Command::new("g++")
            .arg("--version")
            .output()
            .ok()
            .filter(|o| o.status.success())
            .map(|o| String::from_utf8_lossy(&o.stdout).lines().next().unwrap_or("").to_string());
        (Some(p), v)
    } else if let Ok(p) = which("clang++") {
        let v = Command::new("clang++")
            .arg("--version")
            .output()
            .ok()
            .filter(|o| o.status.success())
            .map(|o| String::from_utf8_lossy(&o.stdout).lines().next().unwrap_or("").to_string());
        (Some(p), v)
    } else {
        (None, None)
    };

    match path {
        Some(p) => EnvCheckResult {
            language: "cpp".to_string(),
            available: true,
            version,
            runtime_path: Some(p.display().to_string()),
            error_message: None,
            checked_at: now,
        },
        None => EnvCheckResult {
            language: "cpp".to_string(),
            available: false,
            version: None,
            runtime_path: None,
            error_message: Some("g++ or clang++ not found in PATH".to_string()),
            checked_at: now,
        },
    }
}

// ---------------------------------------------------------------------------
// Tauri 命令入口
// ---------------------------------------------------------------------------

#[tauri::command]
pub async fn check_env(language: String) -> Result<EnvCheckResult, String> {
    let lang = language.to_lowercase();
    let result = match lang.as_str() {
        "java" => detect_java(),
        "python" => detect_python(),
        "javascript" | "node" | "js" => detect_nodejs(),
        "cpp" | "c++" | "c" => detect_cpp(),
        _ => {
            return Err(format!(
                "Unsupported language: {}. Supported: java, python, javascript, cpp",
                language
            ))
        }
    };

    println!(
        "[EnvCheck] {} -> available={}, version={:?}",
        lang,
        result.available,
        result.version
    );

    Ok(result)
}
