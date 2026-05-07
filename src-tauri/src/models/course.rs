use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Course {
    pub id: String,
    pub title: String,
    pub description: String,
    pub language: String,
    pub difficulty: Difficulty,
    pub concepts: Vec<String>,
    pub steps: Vec<serde_json::Value>,
    pub estimated_minutes: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CourseMetadata {
    pub id: String,
    pub title: String,
    pub description: String,
    pub language: String,
    pub difficulty: Difficulty,
    pub concepts: Vec<String>,
    pub estimated_minutes: u32,
    pub steps_count: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Difficulty {
    Beginner,
    Intermediate,
    Advanced,
}
