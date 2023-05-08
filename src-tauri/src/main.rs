#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{process::Command, sync::Mutex};

use serde::Serialize;
use sysinfo::{DiskExt, System, SystemExt};
use tauri::api::process::CommandChild;
mod files;

#[cfg(target_os = "windows")]
use tauri::regex::Regex;

#[cfg(target_os = "linux")]
use {std::fs::metadata, std::path::PathBuf};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Disk {
    name: String,
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

    let mut vec = Vec::<Disk>::new();
    for disk in s.disks() {
        vec.push(Disk {
            name: disk.name().to_str().unwrap().to_string(),
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
fn open_folder(path: String, inside: bool) {
    #[cfg(target_os = "windows")]
    {
        let re = Regex::new(r"/").unwrap();
        let result = re.replace_all(&path, "\\");
        Command::new("explorer")
            .args([
                if inside { "" } else { "/select," },
                format!("{}", result).as_str(),
            ])
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
        Command::new("open")
            .args([if inside { "" } else { "-R" }, &path])
            .spawn()
            .unwrap();
    }
}

pub struct ProgramState(Mutex<Option<CommandChild>>);

#[tauri::command]
fn start_scanning(
    app_handle: tauri::AppHandle,
    state: tauri::State<'_, ProgramState>,
    path: String,
    ratio: String,
) -> Result<(), ()> {
    files::start(app_handle, state, path, ratio)
}

#[tauri::command]
fn stop_scanning(
    _app_handle: tauri::AppHandle,
    state: tauri::State<'_, ProgramState>,
    _path: String,
) -> Result<(), ()> {
    files::stop(state);
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .manage(ProgramState(Default::default()))
        .invoke_handler(tauri::generate_handler![
            greet,
            get_disks,
            open_folder,
            start_scanning,
            stop_scanning
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
