/// 沙箱配置，用于限制代码执行的资源和权限
pub struct Sandbox {
    pub max_memory_mb: u64,
    pub max_cpu_percent: u64,
    pub max_time_ms: u64,
}

impl Default for Sandbox {
    fn default() -> Self {
        Self {
            max_memory_mb: 256,
            max_cpu_percent: 50,
            max_time_ms: 5000,
        }
    }
}

impl Sandbox {
    pub fn new() -> Self {
        Self::default()
    }

    /// 创建隔离的临时目录
    pub fn create_temp_dir(&self) -> std::io::Result<std::path::PathBuf> {
        let dir = std::env::temp_dir().join("codestep_sandbox");
        std::fs::create_dir_all(&dir)?;
        Ok(dir)
    }
}
