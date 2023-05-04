#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

use serde::Serialize;
use sysinfo::{DiskExt, System, SystemExt};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Disk<'a> {
    name: &'a str,
    mount_point: String,
    total_space: u64,
    available_space: u64,
    is_removable: bool,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_disks() -> String {
    // Get the name of the external disks using sysinfo crate
    let mut s = System::new_all();
    s.refresh_all();

    let mut vec: Vec<Disk> = Vec::new();
    for disk in s.disks() {
        vec.push(Disk {
            name: disk.name().to_str().unwrap(),
            available_space: disk.available_space(),
            total_space: disk.total_space(),
            mount_point: disk.mount_point().to_str().unwrap().to_string(),
            is_removable: disk.is_removable(),
        });
    }
    // Return vec
    serde_json::to_string(&vec).unwrap().into()
}

#[tauri::command]
fn open_folder(path: String) {
    #[cfg(target_os = "windows")]
    {
        let re = Regex::new(r"/").unwrap();
        let result = re.replace_all(&path, "\\");
        Command::new("explorer")
            .args(["/select,", format!("{}", result).as_str()])
            .spawn()
            .unwrap();
    }

    #[cfg(target_os = "linux")]
    {
        let new_path = match metadata(&path).unwrap().is_dir() {
            true => path,
            false => {
                let mut path2 = PathBuf::from(path);
                path2.pop();
                path2.into_os_string().into_string().unwrap()
            }
        };
        Command::new("xdg-open").arg(&new_path).spawn().unwrap();
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open").args(["-R", &path]).spawn().unwrap();
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_disks, open_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
