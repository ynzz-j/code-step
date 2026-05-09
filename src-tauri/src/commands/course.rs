use crate::models::course::{Course, CourseCategory, CourseMetadata, Difficulty};
use std::fs;
use std::path::{Path, PathBuf};

// ===================== 课程 JSON 格式 =====================
// 唯一支持的格式：单课程目录
//   courses/{mode}/{language}/{courseId}/course.json
//   courses/{mode}/{language}/{courseId}/steps/step-NN.json
//
// course.json 字段：
//   id, title, description, language, category, difficulty,
//   concepts, estimatedMinutes (or estimated_minutes), steps[]
// steps[] 是相对当前课程目录的 step 文件路径数组。
#[derive(Debug, serde::Deserialize)]
struct SingleCourseFile {
    id: String,
    title: String,
    description: Option<String>,
    language: Option<String>,
    difficulty: Option<String>,
    concepts: Option<Vec<String>>,
    #[serde(rename = "estimatedMinutes")]
    estimated_minutes_camel: Option<u32>,
    estimated_minutes: Option<u32>,
    category: Option<String>,
    steps: Vec<String>,
}

impl SingleCourseFile {
    fn estimated_minutes(&self) -> u32 {
        self.estimated_minutes
            .or(self.estimated_minutes_camel)
            .unwrap_or(15)
    }
}

// =====================================================
// 课程模式配置
const COURSE_MODE_TYPING: &str = "typing";
const COURSE_MODE_CODING: &str = "coding";
const DEFAULT_MODE: &str = COURSE_MODE_TYPING;
const SUPPORTED_MODES: &[&str] = &[COURSE_MODE_TYPING, COURSE_MODE_CODING];

fn normalize_mode(mode: Option<&str>) -> &'static str {
    match mode {
        Some(m) if m == COURSE_MODE_CODING => COURSE_MODE_CODING,
        Some(m) if m == COURSE_MODE_TYPING => COURSE_MODE_TYPING,
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

fn get_courses_dir_for(mode: &str) -> Option<PathBuf> {
    let root = find_courses_root()?;
    let mode_dir = root.join(mode);
    if mode_dir.exists() {
        Some(mode_dir)
    } else {
        None
    }
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

/// 在 courses/{mode}/ 下定位某门课程的根目录
/// 结构：courses/{mode}/{language}/{courseId}/
fn find_course_dir(mode_dir: &Path, course_id: &str) -> Option<PathBuf> {
    let entries = fs::read_dir(mode_dir).ok()?;
    for entry in entries.flatten() {
        let lang_dir = entry.path();
        if !lang_dir.is_dir() {
            continue;
        }
        let course_dir = lang_dir.join(course_id);
        if course_dir.is_dir() && course_dir.join("course.json").exists() {
            return Some(course_dir);
        }
    }
    None
}

fn load_course_manifest(course_dir: &Path) -> Option<SingleCourseFile> {
    let course_file = course_dir.join("course.json");
    let content = fs::read_to_string(&course_file).ok()?;
    serde_json::from_str::<SingleCourseFile>(&content).ok()
}

/// 扫描某个模式目录下的所有课程（按 {lang}/{courseId}/course.json）
fn scan_courses_in_mode(mode_dir: &Path) -> Vec<(PathBuf, SingleCourseFile)> {
    let mut out = Vec::new();
    let Ok(lang_entries) = fs::read_dir(mode_dir) else {
        return out;
    };
    for lang_entry in lang_entries.flatten() {
        let lang_dir = lang_entry.path();
        if !lang_dir.is_dir() {
            continue;
        }
        let Ok(course_entries) = fs::read_dir(&lang_dir) else {
            continue;
        };
        for course_entry in course_entries.flatten() {
            let course_dir = course_entry.path();
            if !course_dir.is_dir() {
                continue;
            }
            if let Some(manifest) = load_course_manifest(&course_dir) {
                out.push((course_dir, manifest));
            }
        }
    }
    out
}

#[tauri::command]
pub async fn get_courses(mode: Option<String>) -> Result<Vec<CourseMetadata>, String> {
    let mode = normalize_mode(mode.as_deref());
    let Some(mode_dir) = get_courses_dir_for(mode) else {
        return Ok(vec![]);
    };

    let mut all_courses: Vec<CourseMetadata> = Vec::new();
    for (_dir, course) in scan_courses_in_mode(&mode_dir) {
        all_courses.push(CourseMetadata {
            id: course.id.clone(),
            title: course.title.clone(),
            description: course.description.clone().unwrap_or_default(),
            language: course.language.clone().unwrap_or_default(),
            category: CourseCategory::from_str(
                course.category.as_deref().unwrap_or("fundamentals"),
            ),
            difficulty: parse_difficulty(course.difficulty.as_deref().unwrap_or("beginner")),
            concepts: course.concepts.clone().unwrap_or_default(),
            estimated_minutes: course.estimated_minutes(),
            steps_count: course.steps.len() as u32,
        });
    }
    Ok(all_courses)
}

#[tauri::command]
pub async fn get_course(course_id: String, mode: Option<String>) -> Result<Course, String> {
    let requested_mode = normalize_mode(mode.as_deref());

    // 优先按请求的模式查找；缺省/未命中时再扫其他模式
    let search_modes: Vec<&str> = if mode.is_some() {
        let mut modes = vec![requested_mode];
        for m in SUPPORTED_MODES {
            if *m != requested_mode {
                modes.push(*m);
            }
        }
        modes
    } else {
        SUPPORTED_MODES.to_vec()
    };

    for m in search_modes {
        let Some(mode_dir) = get_courses_dir_for(m) else {
            continue;
        };
        let Some(course_dir) = find_course_dir(&mode_dir, &course_id) else {
            continue;
        };
        let Some(manifest) = load_course_manifest(&course_dir) else {
            continue;
        };
        if manifest.id != course_id {
            continue;
        }

        let mut steps: Vec<serde_json::Value> = Vec::new();
        for step_path in &manifest.steps {
            let full_step_path = course_dir.join(step_path);
            if let Ok(step_content) = fs::read_to_string(&full_step_path) {
                if let Ok(step_json) =
                    serde_json::from_str::<serde_json::Value>(&step_content)
                {
                    steps.push(step_json);
                }
            }
        }

        let estimated_minutes = manifest.estimated_minutes();
        return Ok(Course {
            id: manifest.id,
            title: manifest.title,
            description: manifest.description.unwrap_or_default(),
            language: manifest.language.unwrap_or_default(),
            category: CourseCategory::from_str(
                manifest.category.as_deref().unwrap_or("fundamentals"),
            ),
            difficulty: parse_difficulty(
                manifest.difficulty.as_deref().unwrap_or("beginner"),
            ),
            concepts: manifest.concepts.unwrap_or_default(),
            steps,
            estimated_minutes,
        });
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
                modes.push(*m);
            }
        }
        modes
    } else {
        SUPPORTED_MODES.to_vec()
    };

    for m in search_modes {
        let Some(mode_dir) = get_courses_dir_for(m) else {
            continue;
        };
        let Some(course_dir) = find_course_dir(&mode_dir, &course_id) else {
            continue;
        };
        let Some(manifest) = load_course_manifest(&course_dir) else {
            continue;
        };
        if manifest.id != course_id {
            continue;
        }

        if step_index >= manifest.steps.len() as u32 {
            return Err(format!("Step index {} out of range", step_index));
        }
        let step_rel = &manifest.steps[step_index as usize];
        let full_step_path = course_dir.join(step_rel);
        let step_content = fs::read_to_string(&full_step_path)
            .map_err(|_| format!("Step file not found: {}", step_rel))?;
        let step_json = serde_json::from_str::<serde_json::Value>(&step_content)
            .map_err(|_| "Failed to parse step JSON".to_string())?;
        return Ok(step_json);
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
    let mode_dir_opt = get_courses_dir_for(mode);
    let courses_dir_str = mode_dir_opt
        .as_ref()
        .map(|p| p.to_string_lossy().to_string())
        .unwrap_or_default();
    let courses_dir_exists = mode_dir_opt.as_ref().map(|p| p.exists()).unwrap_or(false);

    let mut scan_log = Vec::new();
    let mut courses_found: u32 = 0;
    let parse_errors: Vec<String> = Vec::new();

    if let Some(mode_dir) = mode_dir_opt {
        for (course_dir, manifest) in scan_courses_in_mode(&mode_dir) {
            scan_log.push(format!(
                "course: {} ({}) at {}",
                manifest.id,
                manifest.steps.len(),
                course_dir.display()
            ));
            courses_found += 1;
        }
    }

    Ok(DebugInfo {
        current_dir,
        exe_path,
        courses_dir: courses_dir_str,
        courses_dir_exists,
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
