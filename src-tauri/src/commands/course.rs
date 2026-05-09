use crate::models::course::{Course, CourseCategory, CourseMetadata, Difficulty};
use std::fs;
use std::path::{Path, PathBuf};

// ===================== 课程 JSON 格式定义 =====================
// 格式1: 语言包格式（旧）- courses/{language}/course.json
//   包含多个课程的列表
#[derive(Debug, serde::Deserialize)]
struct LanguageCourseFile {
    id: String,
    title: String,
    description: Option<String>,
    language: String,
    difficulty: Option<String>,
    courses: Vec<InnerCourse>,
}

// 格式2: 单课程格式（新）- courses/{mode}/courses/{courseId}/course.json
//   每个文件只有一个课程
#[derive(Debug, serde::Deserialize)]
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

#[derive(Debug, serde::Deserialize)]
struct InnerCourse {
    id: String,
    title: String,
    description: Option<String>,
    language: String,
    #[serde(default = "default_difficulty")]
    difficulty: String,
    concepts: Vec<String>,
    estimated_minutes: Option<u32>,
    estimatedMinutes: Option<u32>,
    #[serde(default = "default_category")]
    category: String,
    steps: Vec<String>,
}

fn default_difficulty() -> String {
    "beginner".to_string()
}

fn default_category() -> String {
    "fundamentals".to_string()
}

// =====================================================
// 课程模式配置
// 现在由前端通过命令参数指定模式；后端保留支持的模式列表和默认回退。
const COURSE_MODE_TYPING: &str = "typing";
const COURSE_MODE_CODING: &str = "coding";
const DEFAULT_MODE: &str = COURSE_MODE_TYPING;
const SUPPORTED_MODES: &[&str] = &[COURSE_MODE_TYPING, COURSE_MODE_CODING];

fn normalize_mode(mode: Option<&str>) -> &str {
    match mode {
        Some(m) if SUPPORTED_MODES.contains(&m) => match m {
            "coding" => COURSE_MODE_CODING,
            _ => COURSE_MODE_TYPING,
        },
        _ => DEFAULT_MODE,
    }
}

// =====================================================

/// 查找 courses 根目录（不含 mode 子目录）
fn find_courses_root() -> Option<PathBuf> {
    if let Ok(exe_path) = std::env::current_exe() {
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

/// 获取指定模式的课程目录。
/// 如果该模式目录不存在则回退到 courses 根目录（兼容旧结构）。
fn get_courses_dir_for(mode: &str) -> PathBuf {
    let Some(root) = find_courses_root() else {
        return PathBuf::from("courses");
    };
    let mode_dir = root.join(mode);
    if mode_dir.exists() {
        return mode_dir;
    }
    root
}

// 获取单个课程的根目录
fn get_course_root_dir(courses_dir: &Path, course_id: &str) -> Option<PathBuf> {
    // 一期结构: courses/typing/courses/{courseId}/
    let courses_subdir = courses_dir.join("courses");
    if courses_subdir.is_dir() {
        let course_dir = courses_subdir.join(course_id);
        if course_dir.is_dir() {
            return Some(course_dir);
        }
    }
    // 旧结构: courses/{courseId}/
    let course_dir = courses_dir.join(course_id);
    if course_dir.is_dir() {
        return Some(course_dir);
    }
    None
}

/// 在语言包子目录中查找包含指定 course_id 的语言包根目录
/// 例如: course_id="java-syntax-basic" -> 找到 courses/typing/java/ (其 course.json 包含该 id)
fn find_language_pack_root(courses_dir: &Path, course_id: &str) -> Option<PathBuf> {
    if let Ok(entries) = fs::read_dir(courses_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if !path.is_dir() {
                continue;
            }
            // 跳过 courses 子目录（单课程格式已在 get_course_root_dir 中处理）
            if path.file_name() == Some(std::ffi::OsStr::new("courses")) {
                continue;
            }
            let course_file = path.join("course.json");
            if !course_file.exists() {
                continue;
            }
            if let Ok(content) = fs::read_to_string(&course_file) {
                if let Ok(lang_course) = serde_json::from_str::<LanguageCourseFile>(&content) {
                    if lang_course.courses.iter().any(|c| c.id == course_id) {
                        return Some(path);
                    }
                }
            }
        }
    }
    None
}

fn parse_difficulty(diff_str: &str) -> Difficulty {
    match diff_str.to_lowercase().as_str() {
        "beginner" => Difficulty::Beginner,
        "basic" => Difficulty::Basic,
        "intermediate" => Difficulty::Intermediate,
        "advanced" => Difficulty::Advanced,
        "hell" => Difficulty::Hell,
        _ => Difficulty::Beginner,
    }
}

#[tauri::command]
pub async fn get_courses(mode: Option<String>) -> Result<Vec<CourseMetadata>, String> {
    let mode = normalize_mode(mode.as_deref());
    let courses_dir = get_courses_dir_for(mode);

    if !courses_dir.exists() {
        return Ok(vec![]);
    }

    let mut all_courses: Vec<CourseMetadata> = Vec::new();

    // 一期结构: courses/java-typing/courses/{courseId}/course.json (单课程格式)
    let courses_subdir = courses_dir.join("courses");
    if courses_subdir.is_dir() {
        if let Ok(entries) = fs::read_dir(&courses_subdir) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.is_dir() {
                    let course_file = path.join("course.json");
                    if course_file.exists() {
                        if let Ok(content) = fs::read_to_string(&course_file) {
                            // 尝试解析为单课程格式
                            if let Ok(single_course) =
                                serde_json::from_str::<SingleCourseFile>(&content)
                            {
                                let estimated_minutes = single_course
                                    .estimated_minutes
                                    .or(single_course.estimatedMinutes)
                                    .unwrap_or(15);
                                all_courses.push(CourseMetadata {
                                    id: single_course.id.clone(),
                                    title: single_course.title.clone(),
                                    description: single_course.description.clone().unwrap_or_default(),
                                    language: single_course.language.clone().unwrap_or_else(|| "java".to_string()),
                                    category: CourseCategory::from_str(
                                        single_course.category.as_deref().unwrap_or("fundamentals"),
                                    ),
                                    difficulty: parse_difficulty(
                                        single_course.difficulty.as_deref().unwrap_or("beginner"),
                                    ),
                                    concepts: single_course.concepts.unwrap_or_default(),
                                    estimated_minutes,
                                    steps_count: single_course.steps.len() as u32,
                                });
                                continue;
                            }
                        }
                    }
                }
            }
        }
    }

    // 旧结构兼容: courses/{language}/course.json (语言包格式)
    if let Ok(entries) = fs::read_dir(&courses_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() && !path.join("courses").exists() {
                let course_file = path.join("course.json");
                if course_file.exists() {
                    if let Ok(content) = fs::read_to_string(&course_file) {
                        match serde_json::from_str::<LanguageCourseFile>(&content) {
                            Ok(lang_course) => {
                                for inner_course in lang_course.courses {
                                    let estimated_minutes = inner_course
                                        .estimated_minutes
                                        .or(inner_course.estimatedMinutes)
                                        .unwrap_or(15);
                                    all_courses.push(CourseMetadata {
                                        id: inner_course.id.clone(),
                                        title: inner_course.title,
                                        description: inner_course.description.unwrap_or_default(),
                                        language: inner_course.language,
                                        category: CourseCategory::from_str(&inner_course.category),
                                        difficulty: parse_difficulty(&inner_course.difficulty),
                                        concepts: inner_course.concepts,
                                        estimated_minutes,
                                        steps_count: inner_course.steps.len() as u32,
                                    });
                                }
                            }
                            Err(_) => {}
                        }
                    }
                }
            }
        }
    }

    Ok(all_courses)
}

#[tauri::command]
pub async fn get_course(course_id: String, mode: Option<String>) -> Result<Course, String> {
    let requested_mode = normalize_mode(mode.as_deref());

    // 优先按请求的模式查找，缺省时按支持的模式依次回落
    let search_modes: Vec<&str> = if mode.is_some() {
        let mut modes = vec![requested_mode];
        for m in SUPPORTED_MODES {
            if *m != requested_mode {
                modes.push(m);
            }
        }
        modes
    } else {
        SUPPORTED_MODES.to_vec()
    };

    for m in search_modes {
        let courses_dir = get_courses_dir_for(m);
        if !courses_dir.exists() {
            continue;
        }
        if let Ok(course) = try_load_course(&courses_dir, &course_id) {
            return Ok(course);
        }
    }

    Err(format!("Course not found: {}", course_id))
}

fn try_load_course(courses_dir: &Path, course_id: &str) -> Result<Course, String> {
    let course_root = if let Some(root) = get_course_root_dir(courses_dir, course_id) {
        root
    } else if let Some(root) = find_language_pack_root(courses_dir, course_id) {
        root
    } else {
        return Err(format!("Course not found: {}", course_id));
    };

    let course_file = course_root.join("course.json");
    if let Ok(content) = fs::read_to_string(&course_file) {
        // 优先尝试单课程格式
        if let Ok(single_course) = serde_json::from_str::<SingleCourseFile>(&content) {
            if single_course.id == course_id {
                let mut steps: Vec<serde_json::Value> = Vec::new();

                for step_path in &single_course.steps {
                    let full_step_path = course_root.join(step_path);
                    if let Ok(step_content) = fs::read_to_string(&full_step_path) {
                        if let Ok(step_json) =
                            serde_json::from_str::<serde_json::Value>(&step_content)
                        {
                            steps.push(step_json);
                        }
                    }
                }

                let estimated_minutes = single_course
                    .estimated_minutes
                    .or(single_course.estimatedMinutes)
                    .unwrap_or(15);
                return Ok(Course {
                    id: single_course.id,
                    title: single_course.title,
                    description: single_course.description.unwrap_or_default(),
                    language: single_course.language.unwrap_or_else(|| "java".to_string()),
                    category: CourseCategory::from_str(
                        single_course.category.as_deref().unwrap_or("fundamentals"),
                    ),
                    difficulty: parse_difficulty(
                        single_course.difficulty.as_deref().unwrap_or("beginner"),
                    ),
                    concepts: single_course.concepts.unwrap_or_default(),
                    steps,
                    estimated_minutes,
                });
            }
        }

        // 尝试语言包格式
        if let Ok(lang_course) = serde_json::from_str::<LanguageCourseFile>(&content) {
            if let Some(inner_course) = lang_course.courses.into_iter().find(|c| c.id == course_id)
            {
                let mut steps: Vec<serde_json::Value> = Vec::new();

                for step_path in &inner_course.steps {
                    let full_step_path = course_root.join(step_path);
                    if let Ok(step_content) = fs::read_to_string(&full_step_path) {
                        if let Ok(step_json) =
                            serde_json::from_str::<serde_json::Value>(&step_content)
                        {
                            steps.push(step_json);
                        }
                    }
                }

                let estimated_minutes = inner_course
                    .estimated_minutes
                    .or(inner_course.estimatedMinutes)
                    .unwrap_or(15);
                return Ok(Course {
                    id: inner_course.id,
                    title: inner_course.title,
                    description: inner_course.description.unwrap_or_default(),
                    language: inner_course.language,
                    category: CourseCategory::from_str(&inner_course.category),
                    difficulty: parse_difficulty(&inner_course.difficulty),
                    concepts: inner_course.concepts,
                    steps,
                    estimated_minutes,
                });
            }
        }
    }

    Err(format!("Course not found: {}", course_id))
}

#[tauri::command]
pub async fn get_step(
    course_id: String,
    step_index: u32,
    mode: Option<String>,
) -> Result<serde_json::Value, String> {
    let requested_mode = normalize_mode(mode.as_deref());

    let search_modes: Vec<&str> = if mode.is_some() {
        let mut modes = vec![requested_mode];
        for m in SUPPORTED_MODES {
            if *m != requested_mode {
                modes.push(m);
            }
        }
        modes
    } else {
        SUPPORTED_MODES.to_vec()
    };

    for m in search_modes {
        let courses_dir = get_courses_dir_for(m);
        if !courses_dir.exists() {
            continue;
        }
        if let Ok(step) = try_load_step(&courses_dir, &course_id, step_index) {
            return Ok(step);
        }
    }

    Err(format!("Course not found: {}", course_id))
}

fn try_load_step(
    courses_dir: &Path,
    course_id: &str,
    step_index: u32,
) -> Result<serde_json::Value, String> {
    let course_root = if let Some(root) = get_course_root_dir(courses_dir, course_id) {
        root
    } else if let Some(root) = find_language_pack_root(courses_dir, course_id) {
        root
    } else {
        return Err(format!("Course not found: {}", course_id));
    };

    let course_file = course_root.join("course.json");
    if let Ok(content) = fs::read_to_string(&course_file) {
        if let Ok(single_course) = serde_json::from_str::<SingleCourseFile>(&content) {
            if single_course.id == course_id {
                if step_index >= single_course.steps.len() as u32 {
                    return Err(format!("Step index {} out of range", step_index));
                }

                let step_path = single_course.steps[step_index as usize].clone();
                let full_step_path = course_root.join(&step_path);

                if let Ok(step_content) = fs::read_to_string(&full_step_path) {
                    if let Ok(step_json) = serde_json::from_str::<serde_json::Value>(&step_content)
                    {
                        return Ok(step_json);
                    } else {
                        return Err("Failed to parse step JSON".to_string());
                    }
                } else {
                    return Err(format!("Step file not found: {}", step_path));
                }
            }
        }

        if let Ok(lang_course) = serde_json::from_str::<LanguageCourseFile>(&content) {
            if let Some(inner_course) = lang_course.courses.into_iter().find(|c| c.id == course_id)
            {
                if step_index >= inner_course.steps.len() as u32 {
                    return Err(format!("Step index {} out of range", step_index));
                }

                let step_path = inner_course.steps[step_index as usize].clone();
                let full_step_path = course_root.join(&step_path);

                if let Ok(step_content) = fs::read_to_string(&full_step_path) {
                    if let Ok(step_json) =
                        serde_json::from_str::<serde_json::Value>(&step_content)
                    {
                        return Ok(step_json);
                    } else {
                        return Err("Failed to parse step JSON".to_string());
                    }
                } else {
                    return Err(format!("Step file not found: {}", step_path));
                }
            }
        }
    }

    Err(format!("Course not found: {}", course_id))
}

#[tauri::command]
pub async fn check_course_updates() -> Result<Vec<CourseUpdate>, String> {
    Ok(vec![])
}

#[derive(Debug, serde::Serialize)]
pub struct DebugInfo {
    pub current_dir: String,
    pub exe_path: String,
    pub courses_dir: String,
    pub courses_dir_exists: bool,
    pub courses_subdir: String,
    pub courses_subdir_exists: bool,
    pub scan_log: Vec<String>,
    pub courses_found: u32,
    pub parse_errors: Vec<String>,
}

#[tauri::command]
pub async fn debug_courses(mode: Option<String>) -> Result<DebugInfo, String> {
    let current_dir = std::env::current_dir()
        .map(|p| p.to_string_lossy().to_string())
        .unwrap_or_default();

    let exe_path = std::env::current_exe()
        .map(|p| p.to_string_lossy().to_string())
        .unwrap_or_default();

    let mode = normalize_mode(mode.as_deref());
    let courses_dir = get_courses_dir_for(mode);
    let courses_subdir = courses_dir.join("courses");

    let mut scan_log = Vec::new();
    let mut courses_found: u32 = 0;
    let mut parse_errors = Vec::new();

    // Scan language packs
    if let Ok(entries) = fs::read_dir(&courses_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if !path.is_dir() { continue; }
            let has_courses_sub = path.join("courses").exists();
            scan_log.push(format!("dir: {:?}, has_courses_sub={}", path.file_name().unwrap_or_default(), has_courses_sub));
            if has_courses_sub { continue; }
            let cf = path.join("course.json");
            if !cf.exists() {
                scan_log.push(format!("  no course.json"));
                continue;
            }
            match fs::read_to_string(&cf) {
                Ok(content) => {
                    scan_log.push(format!("  read OK, len={}", content.len()));
                    match serde_json::from_str::<LanguageCourseFile>(&content) {
                        Ok(lang_course) => {
                            courses_found += lang_course.courses.len() as u32;
                            scan_log.push(format!("  parsed {} courses", lang_course.courses.len()));
                        }
                        Err(e) => {
                            let msg = format!("  PARSE ERROR: {:?}", e);
                            scan_log.push(msg.clone());
                            parse_errors.push(format!("{:?}: {}", cf, msg));
                        }
                    }
                }
                Err(e) => {
                    let msg = format!("  READ ERROR: {:?}", e);
                    scan_log.push(msg.clone());
                    parse_errors.push(msg);
                }
            }
        }
    }

    Ok(DebugInfo {
        current_dir,
        exe_path,
        courses_dir: courses_dir.to_string_lossy().to_string(),
        courses_dir_exists: courses_dir.exists(),
        courses_subdir: courses_subdir.to_string_lossy().to_string(),
        courses_subdir_exists: courses_subdir.exists(),
        scan_log,
        courses_found,
        parse_errors,
    })
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct CourseUpdate {
    pub course_id: String,
    pub current_version: String,
    pub latest_version: String,
    pub changelog: String,
    pub download_url: Option<String>,
}
