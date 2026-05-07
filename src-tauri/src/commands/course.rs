use crate::models::course::{Course, CourseMetadata};
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Debug, serde::Deserialize)]
struct LanguageCourseFile {
    id: String,
    title: String,
    description: String,
    language: String,
    difficulty: String,
    courses: Vec<InnerCourse>,
}

#[derive(Debug, serde::Deserialize)]
struct InnerCourse {
    id: String,
    title: String,
    description: String,
    language: String,
    difficulty: String,
    concepts: Vec<String>,
    estimated_minutes: Option<u32>,
    estimatedMinutes: Option<u32>,
    steps: Vec<String>,
}

fn get_courses_dir() -> PathBuf {
    if let Ok(base_dir) = std::env::current_dir() {
        let courses_path = base_dir.join("courses");
        if courses_path.exists() {
            return courses_path;
        }
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        if let Some(home) = dirs::home_dir() {
            let courses_path = home.join(".codestep").join("courses");
            if courses_path.exists() {
                return courses_path;
            }
        }
    }
    
    PathBuf::from("courses")
}

fn parse_difficulty(diff_str: &str) -> crate::models::course::Difficulty {
    match diff_str.to_lowercase().as_str() {
        "beginner" => crate::models::course::Difficulty::Beginner,
        "intermediate" => crate::models::course::Difficulty::Intermediate,
        "advanced" => crate::models::course::Difficulty::Advanced,
        _ => crate::models::course::Difficulty::Beginner,
    }
}

#[tauri::command]
pub async fn get_courses() -> Result<Vec<CourseMetadata>, String> {
    let courses_dir = get_courses_dir();
    
    if !courses_dir.exists() {
        return Ok(vec![]);
    }
    
    let mut all_courses: Vec<CourseMetadata> = Vec::new();
    
    if let Ok(entries) = fs::read_dir(&courses_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                let course_file = path.join("course.json");
                if course_file.exists() {
                    if let Ok(content) = fs::read_to_string(&course_file) {
                        if let Ok(lang_course) = serde_json::from_str::<LanguageCourseFile>(&content) {
                            for inner_course in lang_course.courses {
                                let estimated_minutes = inner_course.estimated_minutes.or(inner_course.estimatedMinutes).unwrap_or(15);
                                all_courses.push(CourseMetadata {
                                    id: inner_course.id,
                                    title: inner_course.title,
                                    description: inner_course.description,
                                    language: inner_course.language,
                                    difficulty: parse_difficulty(&inner_course.difficulty),
                                    concepts: inner_course.concepts,
                                    estimated_minutes,
                                    steps_count: inner_course.steps.len() as u32,
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    
    Ok(all_courses)
}

#[tauri::command]
pub async fn get_course(course_id: String) -> Result<Course, String> {
    let courses_dir = get_courses_dir();
    
    if !courses_dir.exists() {
        return Err("Courses directory not found".to_string());
    }
    
    if let Ok(entries) = fs::read_dir(&courses_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                let course_file = path.join("course.json");
                if course_file.exists() {
                    if let Ok(content) = fs::read_to_string(&course_file) {
                        if let Ok(lang_course) = serde_json::from_str::<LanguageCourseFile>(&content) {
                            if let Some(inner_course) = lang_course.courses.into_iter().find(|c| c.id == course_id) {
                                let mut steps: Vec<serde_json::Value> = Vec::new();
                                let steps_dir = path.join("steps");
                                
                                for step_path in &inner_course.steps {
                                    let full_step_path = steps_dir.join(step_path);
                                    if let Ok(step_content) = fs::read_to_string(&full_step_path) {
                                        if let Ok(step_json) = serde_json::from_str::<serde_json::Value>(&step_content) {
                                            steps.push(step_json);
                                        }
                                    }
                                }
                                
                                let estimated_minutes = inner_course.estimated_minutes.or(inner_course.estimatedMinutes).unwrap_or(15);
                                return Ok(Course {
                                    id: inner_course.id,
                                    title: inner_course.title,
                                    description: inner_course.description,
                                    language: inner_course.language,
                                    difficulty: parse_difficulty(&inner_course.difficulty),
                                    concepts: inner_course.concepts,
                                    steps,
                                    estimated_minutes,
                                });
                            }
                        }
                    }
                }
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
    
    if let Ok(entries) = fs::read_dir(&courses_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                let course_file = path.join("course.json");
                if course_file.exists() {
                    if let Ok(content) = fs::read_to_string(&course_file) {
                        if let Ok(lang_course) = serde_json::from_str::<LanguageCourseFile>(&content) {
                            if let Some(inner_course) = lang_course.courses.into_iter().find(|c| c.id == course_id) {
                                if step_index >= inner_course.steps.len() as u32 {
                                    return Err(format!("Step index {} out of range", step_index));
                                }
                                
                                let step_path = inner_course.steps[step_index as usize].clone();
                                let full_step_path = path.join("steps").join(&step_path);
                                
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
                    }
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

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct CourseUpdate {
    pub course_id: String,
    pub current_version: String,
    pub latest_version: String,
    pub changelog: String,
    pub download_url: Option<String>,
}
