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
// 一期: Typing 模式
// 二期: Coding 模式 - 修改 CURRENT_MODE 切换
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

fn get_courses_dir() -> PathBuf {
    // 优先从 EXE 所在目录向上查找
    if let Ok(exe_path) = std::env::current_exe() {
        eprintln!("[DEBUG] EXE path: {:?}", exe_path);
        
        // 从 EXE 路径向上查找到项目根目录
        // debug/release: src-tauri/target/{debug,release}/codestep.exe -> 项目根 (需要 4 层 parent)
        let possible_roots = [
            exe_path.parent().unwrap().parent().unwrap().parent().unwrap().parent().unwrap(),
        ];
        
        for root in &possible_roots {
            let courses_path = root.join("courses");
            eprintln!("[DEBUG] Checking root: {:?}, courses: {:?}", root, courses_path);
            if courses_path.exists() {
                // 检查 typing 目录
                let mode_dir = courses_path.join(get_mode_dir());
                if mode_dir.exists() {
                    eprintln!("[DEBUG] Using mode_dir: {:?}", mode_dir);
                    return mode_dir;
                }
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
pub async fn get_courses() -> Result<Vec<CourseMetadata>, String> {
    let courses_dir = get_courses_dir();

    eprintln!("[DEBUG get_courses] courses_dir: {:?}, exists: {}", courses_dir, courses_dir.exists());

    if !courses_dir.exists() {
        eprintln!("[DEBUG get_courses] courses_dir does NOT exist, returning empty");
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
            eprintln!("[DEBUG get_courses] scanning dir: {:?}", path);
            if path.is_dir() && !path.join("courses").exists() {
                let course_file = path.join("course.json");
                eprintln!("[DEBUG get_courses] course_file: {:?}, exists: {}", course_file, course_file.exists());
                if course_file.exists() {
                    if let Ok(content) = fs::read_to_string(&course_file) {
                        eprintln!("[DEBUG get_courses] read course_file OK, len={}", content.len());
                        match serde_json::from_str::<LanguageCourseFile>(&content) {
                            Ok(lang_course) => {
                                eprintln!("[DEBUG get_courses] parsed {} courses from language pack", lang_course.courses.len());
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
                            Err(e) => {
                                eprintln!("[DEBUG get_courses] FAILED to parse language pack: {:?}", e);
                            }
                        }
                    } else {
                        eprintln!("[DEBUG get_courses] FAILED to read course_file");
                    }
                }
            } else if path.is_dir() {
                eprintln!("[DEBUG get_courses] skipped (has courses/ subdir): {:?}", path);
            }
        }
    }

    eprintln!("[DEBUG get_courses] total courses found: {}", all_courses.len());
    Ok(all_courses)
}

#[tauri::command]
pub async fn get_course(course_id: String) -> Result<Course, String> {
    let courses_dir = get_courses_dir();

    if !courses_dir.exists() {
        return Err("Courses directory not found".to_string());
    }

    // 尝试获取课程根目录
    let course_root = if let Some(root) = get_course_root_dir(&courses_dir, &course_id) {
        root
    } else if let Some(root) = find_language_pack_root(&courses_dir, &course_id) {
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
                    // step_path 已经是相对于 course_root 的路径，如 "steps/step-01.json"
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
        if let Ok(lang_course) =
            serde_json::from_str::<LanguageCourseFile>(&content)
        {
            if let Some(inner_course) =
                lang_course.courses.into_iter().find(|c| c.id == course_id)
            {
                let mut steps: Vec<serde_json::Value> = Vec::new();

                for step_path in &inner_course.steps {
                    // step_path 是相对于 course_root 的完整路径，如 "steps/java-syntax-basic/steps/step-01.json"
                    let full_step_path = course_root.join(step_path);
                    if let Ok(step_content) = fs::read_to_string(&full_step_path) {
                        if let Ok(step_json) =
                            serde_json::from_str::<serde_json::Value>(&step_content)
                        {
                            steps.push(step_json);
                        }
                    } else {
                        eprintln!("[DEBUG] Failed to read step file: {:?}", full_step_path);
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
pub async fn get_step(course_id: String, step_index: u32) -> Result<serde_json::Value, String> {
    let courses_dir = get_courses_dir();

    if !courses_dir.exists() {
        return Err("Courses directory not found".to_string());
    }

    let course_root = if let Some(root) = get_course_root_dir(&courses_dir, &course_id) {
        root
    } else if let Some(root) = find_language_pack_root(&courses_dir, &course_id) {
        root
    } else {
        return Err(format!("Course not found: {}", course_id));
    };

    let course_file = course_root.join("course.json");
    if let Ok(content) = fs::read_to_string(&course_file) {
        // 优先尝试单课程格式
        if let Ok(single_course) = serde_json::from_str::<SingleCourseFile>(&content) {
            if single_course.id == course_id {
                if step_index >= single_course.steps.len() as u32 {
                    return Err(format!("Step index {} out of range", step_index));
                }

                let step_path = single_course.steps[step_index as usize].clone();
                let full_step_path = course_root.join(&step_path);

                if let Ok(step_content) = fs::read_to_string(&full_step_path) {
                    if let Ok(step_json) = serde_json::from_str::<serde_json::Value>(&step_content) {
                        return Ok(step_json);
                    } else {
                        return Err("Failed to parse step JSON".to_string());
                    }
                } else {
                    return Err(format!("Step file not found: {}", step_path));
                }
            }
        }

        // 尝试语言包格式
        if let Ok(lang_course) =
            serde_json::from_str::<LanguageCourseFile>(&content)
        {
            if let Some(inner_course) =
                lang_course.courses.into_iter().find(|c| c.id == course_id)
            {
                if step_index >= inner_course.steps.len() as u32 {
                    return Err(format!("Step index {} out of range", step_index));
                }

                let step_path = inner_course.steps[step_index as usize].clone();
                // step_path 是相对于 course_root 的完整路径，如 "steps/java-syntax-basic/steps/step-01.json"
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
pub async fn debug_courses() -> Result<DebugInfo, String> {
    let current_dir = std::env::current_dir()
        .map(|p| p.to_string_lossy().to_string())
        .unwrap_or_default();

    let exe_path = std::env::current_exe()
        .map(|p| p.to_string_lossy().to_string())
        .unwrap_or_default();

    let courses_dir = get_courses_dir();
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
