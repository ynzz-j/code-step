use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Settings {
    pub theme: String,
    pub font_size: u32,
    pub tab_size: u32,
    pub auto_validate: bool,
    pub auto_validate_delay: u32,
    pub focus_mode_shortcut: String,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            theme: "dark".to_string(),
            font_size: 14,
            tab_size: 4,
            auto_validate: true,
            auto_validate_delay: 500,
            focus_mode_shortcut: "f".to_string(),
        }
    }
}

#[tauri::command]
pub async fn get_settings() -> Result<Settings, String> {
    // TODO: 从数据库读取设置
    Ok(Settings::default())
}

#[tauri::command]
pub async fn save_settings(settings: Settings) -> Result<(), String> {
    // TODO: 保存设置到数据库
    Ok(())
}
