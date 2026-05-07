pub mod schema;

use rusqlite::Connection;
use std::sync::Mutex;
use tauri::{App, Manager};

const DEFAULT_USER_ID: &str = "local_user";

pub struct AppState {
    pub db: Mutex<Connection>,
}

pub fn init_database(app: &App) -> Result<AppState, Box<dyn std::error::Error>> {
    let app_dir = app.path().app_data_dir()?;
    std::fs::create_dir_all(&app_dir)?;
    let db_path = app_dir.join("codestep.db");
    let conn = Connection::open(&db_path)?;
    schema::run_migrations(&conn)?;
    
    // 确保默认用户存在（避免 FOREIGN KEY 约束失败）
    ensure_default_user(&conn)?;
    
    println!("[DB] SQLite initialized at {:?}", db_path);
    Ok(AppState { db: Mutex::new(conn) })
}

/// 确保默认用户存在
fn ensure_default_user(conn: &Connection) -> Result<(), rusqlite::Error> {
    conn.execute(
        "INSERT OR IGNORE INTO users (id, display_name) VALUES (?1, ?2)",
        rusqlite::params![DEFAULT_USER_ID, "Local User"],
    )?;
    Ok(())
}
