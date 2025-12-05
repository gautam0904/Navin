#![warn(clippy::all)]
#![allow(clippy::too_many_arguments)]

pub mod commands;
pub mod core;
pub mod database;
pub mod file_system;
pub mod menu;
pub mod models;
pub mod repositories;

use commands::*;
use database::{create_pool, get_db_path, init_db};
use tauri::Manager;

// -------------------------------------------------------
//  TAURI ENTRYPOINT
// -------------------------------------------------------
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    core::logging::init();

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            // Checklist commands
            get_all_sections,
            add_section,
            update_section_title,
            delete_section,
            add_item,
            update_item,
            delete_item,
            update_section_examples,
            update_section_code_examples,
            update_section_code_example,
            update_item_examples,
            update_item_code_examples,
            update_item_code_example,
            // Progress commands
            get_checked_items,
            toggle_item_checked,
            set_item_checked,
            reset_progress,
            // Export/Import commands
            save_export_file,
            open_import_file,
            import_checklist_data,
            // Project commands
            get_all_projects,
            get_current_project,
            create_project,
            update_project,
            delete_project,
            switch_project,
            get_project_checklist,
            file_system::read_dir,
            // Git commands
            open_repository,
            discover_repository,
            get_repository_status,
            get_branches,
            stage_file,
            stage_all,
            unstage_file,
            unstage_all,
            create_commit,
            checkout_branch,
            create_branch,
            delete_branch,
            get_current_repository,
            get_git_config,
            get_git_config_detailed,
            set_git_config,
            // Phase 2: History commands
            get_commits,
            get_commit_details,
            get_commit_diff,
            get_file_history,
            // Phase 2: Diff commands
            get_file_diff_unstaged,
            get_file_diff_staged,
            get_diff_between_commits,
            // Phase 2: Remote commands  
            list_remotes,
            add_remote,
            remove_remote,
            fetch_remote,
            push_to_remote,
            pull_from_remote,
            // Stash commands
            list_stashes,
            create_stash,
            apply_stash,
            pop_stash,
            drop_stash
        ])
        .manage(GitState::new())
        .setup(|app| {
            let db_path = get_db_path(app.handle());

            match init_db(app.handle()) {
                Ok(_) => {
                    tracing::info!("✅ Database initialized successfully");
                }
                Err(e) => {
                    let error_msg = format!("Failed to initialize database: {}", e);
                    tracing::error!("{}", error_msg);

                    // Try to show error dialog if possible
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.eval(format!(
                            "alert('Database initialization failed. Please contact support. Error: {}')",
                            e
                        ));
                    }

                    tracing::error!("Setup failed: {}", error_msg);
                }
            }

            match create_pool(db_path) {
                Ok(pool) => {
                    tracing::info!("✅ Connection pool created successfully");
                    app.manage(pool);
                }
                Err(e) => {
                    let error_msg = format!("Failed to create connection pool: {}", e);
                    tracing::error!("{}", error_msg);
                    return Err(Box::from(error_msg));
                }
            }

            match menu::create_menu(app.handle()) {
                Ok(menu) => {
                    if let Err(e) = app.set_menu(menu) {
                        tracing::error!("Failed to set menu: {}", e);
                    } else {
                        tracing::info!("✅ Application menu created successfully");
                    }
                }
                Err(e) => {
                    tracing::error!("Failed to create menu: {}", e);
                }
            }

            Ok(())
        })
        .on_menu_event(|app, event| {
            menu::handle_menu_event(app, event);
        })
        .on_window_event(|_window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
            }
        })
        .run(tauri::generate_context!())
        .expect("Error running app");
}
