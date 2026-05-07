use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Difficulty {
    Beginner,
    Basic,
    Intermediate,
    Advanced,
    Hell,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum CourseCategory {
    Fundamentals,
    Frontend,
    Backend,
    Algorithms,
    Database,
    DevTools,
}

impl CourseCategory {
    pub fn from_str(s: &str) -> Self {
        match s.to_lowercase().as_str() {
            "fundamentals" | "基础" => CourseCategory::Fundamentals,
            "frontend" | "前端" => CourseCategory::Frontend,
            "backend" | "后端" => CourseCategory::Backend,
            "algorithms" | "算法" => CourseCategory::Algorithms,
            "database" | "数据库" => CourseCategory::Database,
            "devtools" | "开发工具" => CourseCategory::DevTools,
            _ => CourseCategory::Fundamentals,
        }
    }

    pub fn label(&self) -> &'static str {
        match self {
            CourseCategory::Fundamentals => "编程基础",
            CourseCategory::Frontend => "前端开发",
            CourseCategory::Backend => "后端开发",
            CourseCategory::Algorithms => "数据结构与算法",
            CourseCategory::Database => "数据库",
            CourseCategory::DevTools => "开发工具",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Course {
    pub id: String,
    pub title: String,
    pub description: String,
    pub language: String,
    pub category: CourseCategory,
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
    pub category: CourseCategory,
    pub difficulty: Difficulty,
    pub concepts: Vec<String>,
    pub estimated_minutes: u32,
    pub steps_count: u32,
}
