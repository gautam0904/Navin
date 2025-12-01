#![warn(clippy::all)]
#![allow(clippy::too_many_arguments)]

mod commands;
mod core;
mod database;
mod models;
mod repositories;

use commands::*;
use database::{create_pool, get_db_path, init_db};
use tauri::Manager;

// -------------------------------------------------------
//  TAURI ENTRYPOINT
// -------------------------------------------------------
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize logging first
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
            get_project_checklist
        ])
        .setup(|app| {
            let db_path = get_db_path(&app.handle());
            
            // Initialize database schema
            match init_db(&app.handle()) {
                Ok(_) => {
                    tracing::info!("✅ Database initialized successfully");
                }
                Err(e) => {
                    let error_msg = format!("Failed to initialize database: {}", e);
                    tracing::error!("{}", error_msg);
                    
                    // Try to show error dialog if possible
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.eval(&format!(
                            "alert('Database initialization failed. Please contact support. Error: {}')",
                            e
                        ));
                    }
                    
                    tracing::error!("Setup failed: {}", error_msg);
                    // Continue anyway - pool creation might still work
                }
            }
            
            // Create connection pool
            match create_pool(db_path) {
                Ok(pool) => {
                    tracing::info!("✅ Connection pool created successfully");
                    app.manage(pool);
                    Ok(())
                }
                Err(e) => {
                    let error_msg = format!("Failed to create connection pool: {}", e);
                    tracing::error!("{}", error_msg);
                    Err(Box::from(error_msg))
                }
            }
        })
        .on_window_event(|_window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                // Allow window to close gracefully
            }
        })
        .run(tauri::generate_context!())
        .expect("Error running app");
}
