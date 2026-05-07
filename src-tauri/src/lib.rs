pub mod commands;
pub mod db;
pub mod executor;
pub mod models;
pub mod utils;

use commands::{course, executor as exec_cmd, ime, progress, settings};

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            course::get_courses,
            course::get_course,
            course::get_step,
            progress::save_progress,
            progress::get_user_progress,
            exec_cmd::execute_code,
            settings::get_settings,
            settings::save_settings,
            ime::switch_to_english_ime,
        ])
        .setup(|app| {
            // 初始化数据库
            db::init_database(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
