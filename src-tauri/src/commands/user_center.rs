use crate::db::AppState;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use tauri::Manager;

// ===================== 课程模式配置 =====================
const SUPPORTED_MODES: &[&str] = &["typing", "coding"];
// =====================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct CourseProgressSummary {
    #[serde(rename = "courseId")]
    pub course_id: String,
    #[serde(rename = "courseTitle")]
    pub course_title: String,
    pub language: String,
    #[serde(rename = "progressPercent")]
    pub progress_percent: f64,
    #[serde(rename = "completedSteps")]
    pub completed_steps: u32,
    #[serde(rename = "totalSteps")]
    pub total_steps: u32,
    #[serde(rename = "lastStudiedAt")]
    pub last_studied_at: Option<String>,
    #[serde(rename = "timeSpentMinutes")]
    pub time_spent_minutes: u32,
    #[serde(rename = "courseMode")]
    pub course_mode: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserLearningSummary {
    #[serde(rename = "courseProgress")]
    pub course_progress: Vec<CourseProgressSummary>,
}

// ===================== 课程 JSON 格式 =====================
// 唯一支持的格式：单课程目录 courses/{mode}/{language}/{courseId}/course.json
#[derive(Debug, Deserialize)]
struct SingleCourseFile {
    id: String,
    title: String,
    language: Option<String>,
    steps: Vec<String>,
}
// =============================================================

fn find_courses_root(app_handle: &tauri::AppHandle) -> Option<PathBuf> {
    if let Ok(resource_dir) = app_handle.path().resource_dir() {
        let courses_path = resource_dir.join("courses");
        if courses_path.exists() {
            return Some(courses_path);
        }

        let up_courses = resource_dir.join("_up_").join("courses");
        if up_courses.exists() {
            return Some(up_courses);
        }
    }

    if let Ok(exe_path) = std::env::current_exe() {
        let mut current = exe_path.parent();
        for _ in 0..5 {
            if let Some(dir) = current {
                let courses_path = dir.join("courses");
                if courses_path.exists() {
                    return Some(courses_path);
                }

                let up_courses = dir.join("_up_").join("courses");
                if up_courses.exists() {
                    return Some(up_courses);
                }

                current = dir.parent();
            }
        }

        if let Some(root) = exe_path
            .parent()
            .and_then(|p| p.parent())
            .and_then(|p| p.parent())
            .and_then(|p| p.parent())
        {
            let courses_path = root.join("courses");
            if courses_path.exists() {
                return Some(courses_path);
            }
        }
    }

    for base in ["../../..", "../..", "."] {
        let courses_path = PathBuf::from(base).join("courses");
        if courses_path.exists() {
            return Some(courses_path);
        }
    }

    None
}

fn get_courses_dir_for(app_handle: &tauri::AppHandle, mode: &str) -> Option<PathBuf> {
    let root = find_courses_root(app_handle)?;
    let mode_dir = root.join(mode);
    if mode_dir.exists() {
        Some(mode_dir)
    } else {
        None
    }
}

/// 扫描一个 mode 目录下所有课程的元数据。
/// 结构：{mode_dir}/{language}/{courseId}/course.json
/// 返回 (courseId -> (title, language, totalSteps, mode))
fn scan_course_metadata(mode_dir: &Path, mode: &str) -> HashMap<String, (String, String, u32, String)> {
    let mut metadata: HashMap<String, (String, String, u32, String)> = HashMap::new();

    let Ok(lang_entries) = fs::read_dir(mode_dir) else {
        return metadata;
    };
    for lang_entry in lang_entries.flatten() {
        let lang_dir = lang_entry.path();
        if !lang_dir.is_dir() {
            continue;
        }
        let lang_fallback = lang_dir
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("")
            .to_string();

        let Ok(course_entries) = fs::read_dir(&lang_dir) else {
            continue;
        };
        for course_entry in course_entries.flatten() {
            let course_dir = course_entry.path();
            if !course_dir.is_dir() {
                continue;
            }
            let course_file = course_dir.join("course.json");
            if !course_file.exists() {
                continue;
            }
            let Ok(content) = fs::read_to_string(&course_file) else {
                continue;
            };
            if let Ok(course) = serde_json::from_str::<SingleCourseFile>(&content) {
                let language = course.language.unwrap_or_else(|| lang_fallback.clone());
                metadata.insert(
                    course.id.clone(),
                    (course.title, language, course.steps.len() as u32, mode.to_string()),
                );
            }
        }
    }

    metadata
}

#[tauri::command]
pub async fn get_user_learning_summary(
    app_handle: tauri::AppHandle,
    state: tauri::State<'_, AppState>,
) -> Result<UserLearningSummary, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    // 跨 typing / coding 两种模式收集课程元数据
    let mut course_metadata: HashMap<String, (String, String, u32, String)> = HashMap::new();
    for mode in SUPPORTED_MODES {
        if let Some(dir) = get_courses_dir_for(&app_handle, mode) {
            for (k, v) in scan_course_metadata(&dir, mode) {
                course_metadata.entry(k).or_insert(v);
            }
        }
    }
    eprintln!("[UserCenter] scanned {} courses total", course_metadata.len());

    let mut stmt = db
        .prepare(
            "SELECT course_id, current_step, completed_steps, time_spent, started_at, course_mode
             FROM course_progress
             ORDER BY started_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let progress_rows: Vec<(String, String, u32, Option<String>, Option<String>)> = stmt
        .query_map([], |row| {
            let course_id: String = row.get(0)?;
            let _current_step: u32 = row.get(1)?;
            let completed_steps_json: String = row.get(2)?;
            let time_spent: u32 = row.get(3)?;
            let started_at: Option<String> = row.get(4)?;
            let course_mode: Option<String> = row.get(5)?;
            Ok((course_id, completed_steps_json, time_spent, started_at, course_mode))
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    eprintln!("[UserCenter] progress_rows count: {}", progress_rows.len());

    let mut course_progress_list: Vec<CourseProgressSummary> = Vec::new();

    for (course_id, completed_steps_json, time_spent, started_at, db_course_mode) in progress_rows {
        let (title, language, total_steps, mode) = if let Some(meta) = course_metadata.get(&course_id) {
            (meta.0.clone(), meta.1.clone(), meta.2, meta.3.clone())
        } else {
            // Fallback: course file not found on disk (common in production builds),
            // use DB data so progress rows are never silently dropped.
            let fallback_mode = db_course_mode.unwrap_or_else(|| "typing".to_string());
            (course_id.clone(), "".to_string(), 0, fallback_mode)
        };
        let completed_count = count_json_array_items(&completed_steps_json);
        let progress_percent = if total_steps > 0 {
            (completed_count as f64 / total_steps as f64 * 100.0).min(100.0)
        } else if completed_count > 0 {
            // No total_steps known → treat completed_count as the denominator
            100.0
        } else {
            0.0
        };

        course_progress_list.push(CourseProgressSummary {
            course_id: course_id.clone(),
            course_title: title,
            language,
            progress_percent,
            completed_steps: completed_count,
            total_steps,
            last_studied_at: started_at,
            time_spent_minutes: time_spent / 60,
            course_mode: mode,
        });
    }

    Ok(UserLearningSummary {
        course_progress: course_progress_list,
    })
}

fn count_json_array_items(json: &str) -> u32 {
    let trimmed = json.trim();
    if !trimmed.starts_with('[') || !trimmed.ends_with(']') {
        return 0;
    }
    let inner = &trimmed[1..trimmed.len() - 1].trim();
    if inner.is_empty() {
        return 0;
    }
    let comma_count = inner.matches(',').count();
    (comma_count + 1) as u32
}
