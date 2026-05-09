use rusqlite::{params, Connection};

pub fn run_migrations(conn: &Connection) -> Result<(), rusqlite::Error> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            display_name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_active DATETIME
        );

        CREATE TABLE IF NOT EXISTS courses (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            language TEXT NOT NULL,
            category TEXT DEFAULT 'fundamentals',
            difficulty TEXT DEFAULT 'beginner',
            concepts TEXT DEFAULT '[]',
            estimated_minutes INTEGER DEFAULT 15,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS course_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            course_id TEXT NOT NULL,
            current_step INTEGER DEFAULT 0,
            completed_steps TEXT DEFAULT '[]',
            started_at DATETIME,
            completed_at DATETIME,
            time_spent INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE(user_id, course_id)
        );

        CREATE TABLE IF NOT EXISTS step_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            course_id TEXT NOT NULL,
            step_index INTEGER NOT NULL,
            attempts INTEGER DEFAULT 0,
            time_spent INTEGER DEFAULT 0,
            errors_count INTEGER DEFAULT 0,
            accuracy REAL,
            wpm REAL,
            last_attempt DATETIME,
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE(user_id, course_id, step_index)
        );

        CREATE TABLE IF NOT EXISTS achievements (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS settings (
            user_id TEXT PRIMARY KEY,
            settings_json TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS env_cache (
            language TEXT PRIMARY KEY,
            available INTEGER NOT NULL,
            version TEXT,
            runtime_path TEXT,
            error_msg TEXT,
            checked_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        ",
    )?;

    // 渐进式迁移: 为 course_progress 添加 course_mode 列（若不存在）
    let _ = conn.execute_batch(
        "ALTER TABLE course_progress ADD COLUMN course_mode TEXT;",
    );

    Ok(())
}
