use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum Step {
    Coding {
        id: String,
        title: String,
        concept: String,
        instruction: String,
        hint: Option<String>,
        starter: Option<String>,
        answer: String,
        expected_output: Option<String>,
        validation: ValidationRule,
        encouragement: Option<String>,
    },
    Typing {
        id: String,
        title: String,
        concept: String,
        instruction: String,
        hint: Option<String>,
        target_code: String,
        encouragement: Option<String>,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValidationRule {
    #[serde(rename = "type")]
    pub rule_type: ValidationType,
    pub value: Option<String>,
    pub pattern: Option<String>,
    pub keywords: Option<Vec<String>>,
    pub exact_match: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ValidationType {
    Contains,
    Regex,
    Exact,
    Ast,
}
