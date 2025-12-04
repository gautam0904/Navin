use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

/// Initialize the logging system with enhanced formatting
pub fn init() {
    // Configure default log levels per module
    // Set RUST_LOG environment variable to override, e.g., RUST_LOG=debug or RUST_LOG=git_engine=trace
    let env_filter = EnvFilter::try_from_default_env().unwrap_or_else(|_| {
        EnvFilter::new(
            "info,navin_lib::core::git_engine=debug,navin_lib::commands::git_commands=debug",
        )
    });

    tracing_subscriber::registry()
        .with(env_filter)
        .with(
            fmt::layer()
                .with_target(true) // Show the module path
                .with_file(true) // Show file name
                .with_line_number(true) // Show line number
                .with_thread_ids(false) // Don't show thread IDs (cleaner output)
                .with_level(true) // Show log level
                .pretty(), // Use pretty formatting for better readability
        )
        .init();

    tracing::info!("🚀 Logging system initialized");
}
