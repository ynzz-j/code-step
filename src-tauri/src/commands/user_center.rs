use crate::db::AppState;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};

// ===================== 课程模式配置 =====================
const COURSE_MODE_TYPING: &str = "typing";
const COURSE_MODE_CODING: &str = "coding";
const CURRENT_MODE: &str = COURSE_MODE_TYPING;

fn get_mode_dir() -> &'static str {
    match CURRENT_MODE {
        COURSE_MODE_CODING => "coding",
        _ => "typing",
    }
}
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
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserLearningSummary {
    #[serde(rename = "courseProgress")]
    pub course_progress: Vec<CourseProgressSummary>,
}

// ===================== 课程 JSON 格式定义 =====================
// 格式1: 语言包格式 - courses/typing/{language}/course.json
#[derive(Debug, Deserialize)]
struct LanguageCourseFile {
    id: String,
    title: String,
    description: Option<String>,
    language: String,
    difficulty: Option<String>,
    courses: Vec<InnerCourse>,
}

// 格式2: 单课程格式 - courses/typing/courses/{courseId}/course.json
#[derive(Debug, Deserialize)]
struct SingleCourseFile {
    id: String,
    title: String,
    description: Option<String>,
    language: Option<String>,
    difficulty: Option<String>,
    concepts: Option<Vec<String>>,
    estimated_minutes: Option<u32>,
    estimatedMinutes: Option<u32>,
    category: Option<String>,
    steps: Vec<String>,
}

#[derive(Debug, Deserialize)]
struct InnerCourse {
    id: String,
    title: String,
    description: Option<String>,
    language: String,
    difficulty: Option<String>,
    concepts: Vec<String>,
    estimated_minutes: Option<u32>,
    estimatedMinutes: Option<u32>,
    category: Option<String>,
    steps: Vec<String>,
}
// =============================================================

// 语言包格式（旧/兼容）
#[derive(Debug, Deserialize)]
struct CourseJson {
    courses: Vec<InnerCourse>,
}

// 单课程格式（新/兼容）
#[derive(Debug, Deserialize)]
struct SingleCourseJson {
    id: String,
    title: String,
    language: Option<String>,
    steps: Vec<String>,
}

fn get_courses_dir() -> PathBuf {
    // 优先从 EXE 所在目录向上查找
    if let Ok(exe_path) = std::env::current_exe() {
        eprintln!("[DEBUG] EXE path for user_center: {:?}", exe_path);
        
        // 从 EXE 路径向上查找到项目根目录
        // debug/release: src-tauri/target/{debug,release}/codestep.exe -> 项目根 (需要 4 层 parent)
        let possible_roots = [
            exe_path.parent().unwrap().parent().unwrap().parent().unwrap().parent().unwrap(),
        ];
        
        for root in &possible_roots {
            let courses_path = root.join("courses");
            eprintln!("[DEBUG] Checking root: {:?}, courses: {:?}", root, courses_path);
            if courses_path.exists() {
                // 检查 typing/coding 目录
                let mode_dir = courses_path.join(get_mode_dir());
                if mode_dir.exists() {
                    eprintln!("[DEBUG] Using mode_dir: {:?}", mode_dir);
                    return mode_dir;
                }
                // 如果 mode_dir 不存在，使用 courses 根目录
                eprintln!("[DEBUG] Using courses_path: {:?}", courses_path);
                return courses_path;
            }
        }
    }

    // 回退：尝试相对路径（开发模式）
    let possible_paths = vec![
        PathBuf::from("../../.."),
        PathBuf::from("../.."),
        PathBuf::from("."),
    ];

    for base in possible_paths {
        let courses_path = base.join("courses");
        if courses_path.exists() {
            let mode_dir = courses_path.join(get_mode_dir());
            if mode_dir.exists() {
                return mode_dir;
            }
            return courses_path;
        }
    }

    eprintln!("[DEBUG] Falling back to 'courses'");
    PathBuf::from("courses")
}

// 扫描课程元数据（支持当前路径结构）
// 当前结构: courses/typing/{language}/course.json (语言包格式)
// 兼容旧结构: courses/typing/courses/{courseId}/course.json (单课程格式)
fn scan_course_metadata(courses_dir: &Path) -> HashMap<String, (String, String, u32)> {
    let mut metadata: HashMap<String, (String, String, u32)> = HashMap::new();

    // 当前结构: courses/typing/{language}/course.json (语言包格式)
    if let Ok(entries) = fs::read_dir(courses_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if !path.is_dir() {
                continue;
            }
            // 跳过 courses 子目录（单课程格式）
            if path.file_name() == Some(std::ffi::OsStr::new("courses")) {
                continue;
            }
            let course_file = path.join("course.json");
            if course_file.exists() {
                if let Ok(content) = fs::read_to_string(&course_file) {
                    // 尝试解析为语言包格式 (LanguageCourseFile)
                    if let Ok(lang_course) = serde_json::from_str::<LanguageCourseFile>(&content) {
                        for inner_course in lang_course.courses {
                            let steps_count = inner_course.steps.len() as u32;
                            metadata.insert(
                                inner_course.id.clone(),
                                (
                                    inner_course.title.clone(),
                                    lang_course.language.clone(),
                                    steps_count,
                                ),
                            );
                        }
                        continue;
                    }
                }
            }
        }
    }

    // 兼容: courses/typing/courses/{courseId}/course.json (单课程格式)
    let courses_subdir = courses_dir.join("courses");
    if courses_subdir.exists() {
        if let Ok(entries) = fs::read_dir(&courses_subdir) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.is_dir() {
                    let course_file = path.join("course.json");
                    if course_file.exists() {
                        if let Ok(content) = fs::read_to_string(&course_file) {
                            // 优先尝试单课程格式
                            if let Ok(single_course) =
                                serde_json::from_str::<SingleCourseFile>(&content)
                            {
                                metadata.insert(
                                    single_course.id.clone(),
                                    (
                                        single_course.title,
                                        single_course.language.unwrap_or_else(|| "java".to_string()),
                                        single_course.steps.len() as u32,
                                    ),
                                );
                                continue;
                            }
                            // 尝试语言包格式
                            if let Ok(lang_course) =
                                serde_json::from_str::<CourseJson>(&content)
                            {
                                for inner_course in lang_course.courses {
                                    metadata.insert(
                                        inner_course.id.clone(),
                                        (
                                            inner_course.title,
                                            inner_course.language,
                                            inner_course.steps.len() as u32,
                                        ),
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    metadata
}

#[tauri::command]
pub async fn get_user_learning_summary(
    state: tauri::State<'_, AppState>,
) -> Result<UserLearningSummary, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    // 从文件系统读取课程元数据（支持新旧路径结构）
    let courses_dir = get_courses_dir();
    eprintln!("[UserCenter] courses_dir: {:?}", courses_dir);
    eprintln!("[UserCenter] courses_dir exists: {}", courses_dir.exists());
    
    let course_metadata = if courses_dir.exists() {
        let metadata = scan_course_metadata(&courses_dir);
        eprintln!("[UserCenter] scanned {} courses: {:?}", metadata.len(), metadata.keys().collect::<Vec<_>>());
        metadata
    } else {
        HashMap::new()
    };

    // 获取用户进度数据
    let mut stmt = db
        .prepare(
            "SELECT course_id, current_step, completed_steps, time_spent, started_at
             FROM course_progress
             ORDER BY started_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let progress_rows: Vec<(String, String, u32, Option<String>)> = stmt
        .query_map([], |row| {
            let course_id: String = row.get(0)?;
            let _current_step: u32 = row.get(1)?;
            let completed_steps_json: String = row.get(2)?;
            let time_spent: u32 = row.get(3)?;
            let started_at: Option<String> = row.get(4)?;
            Ok((course_id, completed_steps_json, time_spent, started_at))
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();
    
    eprintln!("[UserCenter] progress_rows count: {}", progress_rows.len());

    let mut course_progress_list: Vec<CourseProgressSummary> = Vec::new();

    for (course_id, completed_steps_json, time_spent, started_at) in progress_rows {
        if let Some((title, language, total_steps)) = course_metadata.get(&course_id) {
            let completed_count = count_json_array_items(&completed_steps_json);
            let progress_percent = if *total_steps > 0 {
                (completed_count as f64 / *total_steps as f64 * 100.0).min(100.0)
            } else {
                0.0
            };

            course_progress_list.push(CourseProgressSummary {
                course_id: course_id.clone(),
                course_title: title.clone(),
                language: language.clone(),
                progress_percent,
                completed_steps: completed_count,
                total_steps: *total_steps,
                last_studied_at: started_at,
                time_spent_minutes: time_spent / 60,
            });
        }
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
