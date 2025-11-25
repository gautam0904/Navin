mod commands;
mod core;
mod database;
mod models;
mod repositories;

use commands::*;
use database::init_db;
use tauri::Manager;

// -------------------------------------------------------
//  TAURI ENTRYPOINT
// -------------------------------------------------------
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
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
            // Initialize database with better error handling
            match init_db(&app.handle()) {
                Ok(_) => {
                    println!("✅ Database initialized successfully");
                    Ok(())
                }
                Err(e) => {
                    let error_msg = format!("Failed to initialize database: {}", e);
                    eprintln!("❌ {}", error_msg);
                    
                    // Try to show error dialog if possible
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.eval(&format!(
                            "alert('Database initialization failed. Please contact support. Error: {}')",
                            e
                        ));
                    }
                    
                    // Return error but don't use SetupError (not in Tauri v2)
                    eprintln!("Setup failed: {}", error_msg);
                    // Continue anyway - app might still work
                    Ok(())
                }
            }
        })
        .on_window_event(|_window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                // Allow window to close gracefully - prevent_close() would prevent closing
                // We want to allow normal closing behavior
            }
        })
        .run(tauri::generate_context!())
        .expect("Error running app");
}
