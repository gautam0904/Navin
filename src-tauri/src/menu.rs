use tauri::{menu::*, AppHandle, Emitter};

pub fn create_menu(app: &AppHandle) -> Result<Menu<tauri::Wry>, tauri::Error> {
    let menu_new = MenuItemBuilder::with_id("new", "New Project")
        .accelerator("Ctrl+N")
        .build(app)?;
    let menu_open = MenuItemBuilder::with_id("open", "Open...")
        .accelerator("Ctrl+O")
        .build(app)?;
    let menu_open_folder = MenuItemBuilder::with_id("open_folder", "Open Folder...")
        .accelerator("Ctrl+Shift+O")
        .build(app)?;
    let menu_export = MenuItemBuilder::with_id("export", "Export Checklist")
        .accelerator("Ctrl+E")
        .build(app)?;
    let menu_import = MenuItemBuilder::with_id("import", "Import Checklist")
        .accelerator("Ctrl+I")
        .build(app)?;

    let file_menu = SubmenuBuilder::new(app, "File")
        .item(&menu_new)
        .item(&menu_open)
        .item(&menu_open_folder)
        .separator()
        .item(&menu_export)
        .item(&menu_import)
        .separator()
        .quit()
        .build()?;

    let menu_new_section = MenuItemBuilder::with_id("new_section", "New Section")
        .accelerator("Ctrl+Shift+N")
        .build(app)?;
    let menu_reset_progress = MenuItemBuilder::with_id("reset_progress", "Reset Progress")
        .build(app)?;

    let tasks_menu = SubmenuBuilder::new(app, "Tasks")
        .item(&menu_new_section)
        .separator()
        .item(&menu_reset_progress)
        .build()?;

    let menu_view_stats = MenuItemBuilder::with_id("view_stats", "View Statistics")
        .build(app)?;
    let menu_progress_report = MenuItemBuilder::with_id("progress_report", "Progress Report")
        .build(app)?;

    let analytics_menu = SubmenuBuilder::new(app, "Analytics")
        .item(&menu_view_stats)
        .item(&menu_progress_report)
        .build()?;
    
    let menu_preferences = MenuItemBuilder::with_id("preferences", "Preferences")
        .accelerator("Ctrl+,")
        .build(app)?;
    let menu_about = MenuItemBuilder::with_id("about", "About Navin")
        .build(app)?;

    let settings_menu = SubmenuBuilder::new(app, "Settings")
        .item(&menu_preferences)
        .separator()
        .item(&menu_about)
        .build()?;

    let menu = MenuBuilder::new(app)
        .item(&file_menu)
        .item(&tasks_menu)
        .item(&analytics_menu)
        .item(&settings_menu)
        .build()?;

    Ok(menu)
}

pub fn handle_menu_event(app: &AppHandle, event: tauri::menu::MenuEvent) {
    let event_id = event.id().0.clone();
    
    match event_id.as_str() {
        "new" => {
            tracing::info!("New Project menu clicked");
            if let Err(e) = app.emit("menu:new-project", ()) {
                tracing::error!("Failed to emit event: {}", e);
            }
        }
        "open" => {
            tracing::info!("Open menu clicked");
            let _ = app.emit("menu:open", ());
        }
        "open_folder" => {
            tracing::info!("Open menu clicked");
            let _ = app.emit("menu:open_folder", ());
        }
        "export" => {
            tracing::info!("Export menu clicked");
            let _ = app.emit("menu:export", ());
        }
        "import" => {
            tracing::info!("Import menu clicked");
            let _ = app.emit("menu:import", ());
        }
        "new_section" => {
            tracing::info!("New Section menu clicked");
            let _ = app.emit("menu:new-section", ());
        }
        "reset_progress" => {
            tracing::info!("Reset Progress menu clicked");
            let _ = app.emit("menu:reset-progress", ());
        }
        "view_stats" => {
            tracing::info!("View Statistics menu clicked");
            let _ = app.emit("menu:view-stats", ());
        }
        "progress_report" => {
            tracing::info!("Progress Report menu clicked");
            let _ = app.emit("menu:progress-report", ());
        }
        "preferences" => {
            tracing::info!("Preferences menu clicked");
            let _ = app.emit("menu:preferences", ());
        }
        "about" => {
            tracing::info!("About menu clicked");
            let _ = app.emit("menu:about", ());
        }
        _ => {
            tracing::debug!("Unhandled menu event: {}", event_id);
        }
    }
}
