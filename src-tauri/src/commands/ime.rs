use tauri::command;

#[command]
pub fn switch_to_english_ime() -> Result<bool, String> {
    #[cfg(target_os = "windows")]
    {
        use winapi::um::winuser::{GetForegroundWindow, GetWindowThreadProcessId, PostMessageA, WM_INPUTLANGCHANGEREQUEST};

        unsafe {
            // 获取前台窗口
            let hwnd = GetForegroundWindow();
            if hwnd.is_null() {
                return Err("无法获取前台窗口".to_string());
            }

            // 获取窗口线程ID
            let mut process_id = 0;
            let thread_id = GetWindowThreadProcessId(hwnd, &mut process_id);

            // 创建英文输入法的语言标识符 (0x0409 是英语(美国))
            let english_lang_id = 0x0409;

            // 发送输入法切换消息
            let result = PostMessageA(
                hwnd,
                WM_INPUTLANGCHANGEREQUEST,
                0,
                english_lang_id as isize,
            );

            if result == 0 {
                return Err("切换输入法失败".to_string());
            }

            Ok(true)
        }
    }
    #[cfg(target_os = "macos")]
    {
        use libc::{system, c_char};
        use std::ffi::CString;

        // 在 macOS 上使用 AppleScript 切换到英文输入法
        let script = "tell application \"System Events\" to keystroke space using {command down, option down}";
        let c_script = CString::new(script).unwrap();
        
        unsafe {
            system(c_script.as_ptr());
        }
        
        Ok(true)
    }
    #[cfg(target_os = "linux")]
    {
        // 在 Linux 上尝试设置输入法
        use libc::{system, c_char};
        use std::ffi::CString;

        // 尝试使用 ibus 切换到英文
        let script = "ibus engine xkb:us::eng";
        let c_script = CString::new(script).unwrap();
        
        unsafe {
            system(c_script.as_ptr());
        }
        
        Ok(true)
    }
}
