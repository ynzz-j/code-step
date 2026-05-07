pub mod schema;

use tauri::App;

pub fn init_database(_app: &App) -> Result<(), Box<dyn std::error::Error>> {
    // TODO: 初始化 SQLite 数据库连接
    // let app_dir = app.path().app_data_dir()?;
    // std::fs::create_dir_all(&app_dir)?;
    // let db_path = app_dir.join("codestep.db");
    // let conn = rusqlite::Connection::open(db_path)?;
    // schema::run_migrations(&conn)?;
    Ok(())
}
