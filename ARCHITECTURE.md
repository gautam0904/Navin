# Enterprise Architecture Overview

## Project Structure

This project follows an enterprise-ready architecture with clear separation of concerns:

```
src/
├── components/          # React UI components
├── services/           # Business logic layer (Tauri command wrappers)
├── hooks/             # React hooks for state management
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── constants/         # Application constants
└── data/              # Static data (kept for reference, now seeded in DB)

src-tauri/
├── src/
│   ├── database/      # Database initialization and seed data
│   ├── repositories/   # Data access layer (Rust)
│   ├── models/        # Data models (Rust)
│   └── lib.rs         # Tauri commands and app setup
```

## Architecture Layers

### 1. Frontend Layer (TypeScript/React)

#### Services (`src/services/`)
- **Purpose**: Business logic layer that wraps Tauri commands
- **Files**:
  - `checklist.service.ts`: Checklist CRUD operations
  - `progress.service.ts`: User progress tracking
- **Benefits**: 
  - Centralized API calls
  - Type-safe error handling
  - Easy to mock for testing

#### Hooks (`src/hooks/`)
- **Purpose**: React state management and side effects
- **Files**:
  - `useChecklist.ts`: Main checklist state management
- **Benefits**:
  - Reusable state logic
  - Automatic data loading from database
  - Optimistic UI updates

#### Components (`src/components/`)
- **Purpose**: Presentational React components
- **Benefits**: Reusable, testable UI components

### 2. Backend Layer (Rust/Tauri)

#### Database (`src-tauri/src/database/`)
- **Purpose**: Database initialization and seed data
- **Files**:
  - `mod.rs`: Database connection and schema initialization
  - `seeds.rs`: Default checklist data (hardcoded seed data)
- **Benefits**:
  - Automatic schema creation
  - Default data seeding on first run
  - Environment-aware database paths (dev vs production)

#### Repositories (`src-tauri/src/repositories/`)
- **Purpose**: Data access layer (DAL)
- **Files**:
  - `checklist_repository.rs`: Checklist data operations
  - `progress_repository.rs`: Progress tracking operations
- **Benefits**:
  - Separation of data access from business logic
  - Transaction support
  - Type-safe database operations

#### Models (`src-tauri/src/models/`)
- **Purpose**: Data structures and serialization
- **Benefits**: Type-safe data models with Serde serialization

#### Commands (`src-tauri/src/lib.rs`)
- **Purpose**: Tauri command handlers (API endpoints)
- **Benefits**: 
  - Type-safe IPC between frontend and backend
  - Automatic error handling
  - Database connection management

## Data Flow

```
User Action
    ↓
React Component
    ↓
Hook (useChecklist)
    ↓
Service (ChecklistService)
    ↓
Tauri Command (invoke)
    ↓
Rust Command Handler (lib.rs)
    ↓
Repository (ChecklistRepository)
    ↓
SQLite Database
```

## Key Features

### 1. Default Data Seeding
- Default checklist data is **hardcoded** in `src-tauri/src/database/seeds.rs`
- Automatically seeded on first database initialization
- Prevents duplicate seeding with existence check

### 2. Database Persistence
- All checklist data stored in SQLite
- User progress tracked in database (not localStorage)
- Automatic schema migrations on startup

### 3. Type Safety
- Full TypeScript types on frontend
- Rust types with Serde serialization
- Compile-time type checking across the stack

### 4. Error Handling
- Try-catch blocks in services
- Result types in Rust
- User-friendly error messages in UI

### 5. Loading States
- Loading indicators during data fetch
- Error states with retry functionality
- Optimistic UI updates

## Database Schema

### Tables
- `checklist_sections`: Main sections (Branch Naming, API, Code Quality, etc.)
- `checklist_items`: Individual checklist items within sections
- `section_examples`: Good/bad examples for sections
- `section_code_examples`: Code examples for sections
- `user_progress`: User's checked items

### Relationships
- Sections → Items (one-to-many)
- Sections → Examples (one-to-many)
- Sections → Code Examples (one-to-one)
- Items → Progress (one-to-one)

## Development Workflow

1. **Adding New Features**:
   - Add Rust models if needed
   - Create repository methods
   - Add Tauri commands
   - Create service methods
   - Update hooks
   - Add UI components

2. **Modifying Default Data**:
   - Edit `src-tauri/src/database/seeds.rs`
   - Delete database file to re-seed
   - Or add migration logic

3. **Database Changes**:
   - Update schema in `database/mod.rs`
   - Add migration logic if needed
   - Update repositories if structure changes

## Benefits of This Architecture

1. **Scalability**: Easy to add new features and data models
2. **Maintainability**: Clear separation of concerns
3. **Testability**: Services and repositories can be tested independently
4. **Type Safety**: Compile-time checks prevent runtime errors
5. **Performance**: Direct database access, no unnecessary layers
6. **Enterprise Ready**: Follows industry best practices

