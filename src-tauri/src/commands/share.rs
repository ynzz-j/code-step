use std::path::PathBuf;

fn sanitize_file_name(file_name: &str) -> String {
    let sanitized: String = file_name
        .chars()
        .map(|ch| match ch {
            '<' | '>' | ':' | '"' | '/' | '\\' | '|' | '?' | '*' => '-',
            ch if ch.is_control() => '-',
            ch => ch,
        })
        .collect();

    let trimmed = sanitized.trim().trim_matches('.').to_string();
    if trimmed.is_empty() {
        "codestep-share-card.png".to_string()
    } else if trimmed.to_ascii_lowercase().ends_with(".png") {
        trimmed
    } else {
        format!("{trimmed}.png")
    }
}

fn unique_path(dir: PathBuf, file_name: &str) -> PathBuf {
    let path = dir.join(file_name);
    if !path.exists() {
        return path;
    }

    let stem = file_name.strip_suffix(".png").unwrap_or(file_name);
    for index in 1..1000 {
        let candidate = dir.join(format!("{stem}-{index}.png"));
        if !candidate.exists() {
            return candidate;
        }
    }

    dir.join(format!("{stem}-latest.png"))
}

#[tauri::command]
pub async fn save_share_card_png(file_name: String, png_bytes: Vec<u8>) -> Result<String, String> {
    if png_bytes.is_empty() {
        return Err("PNG 数据为空".to_string());
    }

    if png_bytes.len() > 12 * 1024 * 1024 {
        return Err("PNG 文件过大".to_string());
    }

    let export_dir = dirs::download_dir()
        .or_else(dirs::picture_dir)
        .or_else(dirs::home_dir)
        .ok_or_else(|| "无法定位导出目录".to_string())?;

    std::fs::create_dir_all(&export_dir).map_err(|e| e.to_string())?;

    let safe_name = sanitize_file_name(&file_name);
    let export_path = unique_path(export_dir, &safe_name);
    std::fs::write(&export_path, png_bytes).map_err(|e| e.to_string())?;

    Ok(export_path.to_string_lossy().to_string())
}
