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

    // ===== CodeStep Growth System Tables =====
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS typing_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            course_id TEXT NOT NULL,
            step_index INTEGER NOT NULL DEFAULT 0,
            pattern_id TEXT NOT NULL DEFAULT '',
            wpm REAL NOT NULL DEFAULT 0,
            accuracy REAL NOT NULL DEFAULT 0,
            errors INTEGER NOT NULL DEFAULT 0,
            backspaces INTEGER NOT NULL DEFAULT 0,
            max_combo INTEGER NOT NULL DEFAULT 0,
            flow_score REAL NOT NULL DEFAULT 0,
            duration_ms INTEGER NOT NULL DEFAULT 0,
            perfect INTEGER NOT NULL DEFAULT 0,
            weak_tokens TEXT NOT NULL DEFAULT '[]',
            local_day TEXT NOT NULL DEFAULT '',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS training_pack_stats (
            user_id TEXT NOT NULL,
            pack_id TEXT NOT NULL,
            mastery_percent REAL NOT NULL DEFAULT 0,
            best_wpm REAL NOT NULL DEFAULT 0,
            best_flow_score REAL NOT NULL DEFAULT 0,
            best_combo INTEGER NOT NULL DEFAULT 0,
            today_delta INTEGER NOT NULL DEFAULT 0,
            recent_trend REAL NOT NULL DEFAULT 0,
            last_practiced_at TEXT,
            PRIMARY KEY (user_id, pack_id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS pattern_mastery (
            user_id TEXT NOT NULL,
            pack_id TEXT NOT NULL,
            pattern_id TEXT NOT NULL,
            attempts INTEGER NOT NULL DEFAULT 0,
            mastery_percent REAL NOT NULL DEFAULT 0,
            best_wpm REAL NOT NULL DEFAULT 0,
            best_flow_score REAL NOT NULL DEFAULT 0,
            recent_trend REAL NOT NULL DEFAULT 0,
            weak_tokens TEXT NOT NULL DEFAULT '[]',
            PRIMARY KEY (user_id, pack_id, pattern_id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS weak_token_stats (
            user_id TEXT NOT NULL,
            pack_id TEXT NOT NULL,
            pattern_id TEXT NOT NULL DEFAULT '',
            token TEXT NOT NULL,
            count INTEGER NOT NULL DEFAULT 0,
            last_seen_at TEXT,
            PRIMARY KEY (user_id, pack_id, pattern_id, token),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        ",
    )?;

    // ===== CodeStep Challenge System Tables =====
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS challenge_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            pack_id TEXT NOT NULL,
            challenge_mode TEXT NOT NULL,
            duration_ms INTEGER NOT NULL DEFAULT 0,
            chars_typed INTEGER NOT NULL DEFAULT 0,
            correct_chars INTEGER NOT NULL DEFAULT 0,
            completed_segments INTEGER NOT NULL DEFAULT 0,
            wpm REAL NOT NULL DEFAULT 0,
            raw_wpm REAL NOT NULL DEFAULT 0,
            accuracy REAL NOT NULL DEFAULT 0,
            errors INTEGER NOT NULL DEFAULT 0,
            backspaces INTEGER NOT NULL DEFAULT 0,
            max_combo INTEGER NOT NULL DEFAULT 0,
            perfect_segments INTEGER NOT NULL DEFAULT 0,
            perfect_failed INTEGER NOT NULL DEFAULT 0,
            flow_score REAL NOT NULL DEFAULT 0,
            rank_score REAL NOT NULL DEFAULT 0,
            weak_tokens TEXT NOT NULL DEFAULT '[]',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS challenge_leaderboard_cache (
            user_id TEXT NOT NULL,
            pack_id TEXT NOT NULL,
            challenge_mode TEXT NOT NULL,
            best_run_id INTEGER,
            best_rank_score REAL NOT NULL DEFAULT 0,
            best_wpm REAL NOT NULL DEFAULT 0,
            best_accuracy REAL NOT NULL DEFAULT 0,
            best_combo INTEGER NOT NULL DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, pack_id, challenge_mode),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        ",
    )?;

    Ok(())
}
