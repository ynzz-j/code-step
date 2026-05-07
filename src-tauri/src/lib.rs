pub mod commands;
pub mod db;
pub mod executor;
pub mod models;
pub mod utils;

use commands::{course, env_checker, executor as exec_cmd, ime, progress, settings, user_center};
use db::init_database;
use tauri::Manager;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let state = init_database(app)?;
            app.manage(state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            course::get_courses,
            course::get_course,
            course::get_step,
            course::debug_courses,
            progress::save_progress,
            progress::get_user_progress,
            exec_cmd::execute_code,
            settings::get_settings,
            settings::save_settings,
            ime::switch_to_english_ime,
            env_checker::check_env,
            user_center::get_user_learning_summary,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
