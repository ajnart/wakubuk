use std::{fs, ops::Not};

use tauri::{
    api::process::{Command, CommandEvent},
    regex::{Captures, Regex},
    Manager,
};

use crate::ProgramState;

pub fn start(
    app_handle: tauri::AppHandle,
    state: tauri::State<'_, ProgramState>,
    path: String,
    ratio: String,
) -> Result<(), ()> {
    // Start scanning in a new thread at the given path
    println!("Start Scanning {}", path);
    let ratio = ["--min-ratio=", ratio.as_str()].join("");

    let mut paths_to_scan: Vec<String> = Vec::new();
    paths_to_scan.push("--json-output".to_string());
    paths_to_scan.push("--progress".to_string());
    paths_to_scan.push(ratio);
    if path.eq("/") {
        let paths = fs::read_dir("/").unwrap();
        println!("{:#?}", paths);
        let banned = [
            "/dev", "/mnt", "/cdrom", "/proc", "/media", "/Volumes", "/System",
        ];

        for scan_path in paths {
            let scan_path_str = scan_path.unwrap().path();
            if banned.contains(&(scan_path_str.to_str().unwrap())).not() {
                paths_to_scan.push(scan_path_str.display().to_string());
            }
        }
    } else {
        paths_to_scan.push(path);
    }

    let (mut rx, child) = Command::new_sidecar("pdu")
        .expect("failed to create `my-sidecar` binary command")
        .args(paths_to_scan)
        .spawn()
        .expect("Failed to spawn sidecar");

    *state.0.lock().unwrap() = Some(child);

    // unlisten to the event using the `id` returned on the `listen_global` function
    // an `once_global` API is also exposed on the `App` struct

    let re = Regex::new(r"\(scanned ([0-9]*), total ([0-9]*)(?:, erred ([0-9]*))?\)").unwrap();

    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(line) => {
                    // println!("Stdout:{}", &line);
                    app_handle.emit_all("scan_completed", line).ok();
                }
                CommandEvent::Stderr(msg) => {
                    // println!("Stderr:{}", &msg);

                    let caps = re.captures(&msg);
                    if let Some(groups) = caps {
                        if groups.len() > 2 {
                            emit_scan_status(&app_handle, groups)
                        }
                    }
                }
                CommandEvent::Terminated(t) => {
                    println!("Finished scanning a folder: {t:?}");
                }
                _ => unimplemented!(),
            };
        }
        Result::<(), ()>::Ok(())
    });

    Ok(())
}

pub fn stop(state: tauri::State<'_, ProgramState>) {
    state
        .0
        .lock()
        .unwrap()
        .take()
        .unwrap()
        .kill()
        .expect("State is None");
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    items: u64,
    total: u64,
    errors: u64,
}

fn emit_scan_status(app_handle: &tauri::AppHandle, groups: Captures) {
    app_handle
        .emit_all(
            "scan_status",
            Payload {
                items: groups
                    .get(1)
                    .map_or("0", |m| m.as_str())
                    .trim_end()
                    .parse::<u64>()
                    .unwrap(),
                total: groups
                    .get(2)
                    .map_or("0", |m| m.as_str())
                    .trim_end()
                    .parse::<u64>()
                    .unwrap(),
                errors: groups
                    .get(3)
                    .map_or("0", |m| m.as_str())
                    .trim_end()
                    .parse::<u64>()
                    .unwrap(),
            },
        )
        .unwrap();
}
