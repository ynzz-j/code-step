use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct UserProgress {
    pub user_id: String,
    pub course_progress: HashMap<String, CourseProgress>,
    pub total_time: u64,
    pub last_active: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CourseProgress {
    pub course_id: String,
    pub completed_steps: Vec<u32>,
    pub current_step: u32,
    pub started_at: String,
    pub completed_at: Option<String>,
    pub time_spent: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StepStats {
    pub step_id: String,
    pub attempts: u32,
    pub time_spent: u64,
    pub errors_count: u32,
    pub accuracy: f32,
    pub wpm: Option<f32>,
}
