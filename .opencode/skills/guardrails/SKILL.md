# Livtet Development Guardrails

## DO NOT Commands

These rules are **absolute** for this project. Never violate them.

### Build & Execution

- **NEVER** run Gradle/cargo commands directly — always use `mise run` tasks
- **NEVER** use `head` or `tail` in bash commands — use tool offset/limit or grep --max-count
- **NEVER** restart, start, or kill dev servers (Vite, SvelteKit, Cargo, Tauri). The user manages dev server lifecycle. Always ask before running `mise run dev`, `yarn dev`, `cargo run`, etc.
- **NEVER** assume a mise task succeeded — always verify the output
- **NEVER** run mise tasks without `workdir` parameter — working directory defaults to shell's CWD, not the repo

### Native Code (Rust/Android)

- After Rust/Kotlin code changes, MUST run `mise run android-clean` before `mise run build-native` to avoid stale object files
- When mise says "sources up-to-date, skipping" but source files were changed:
  - Force rebuild by touching a tracked source file (e.g., `crates/livtet-android/src/lib.rs`)
  - Or delete output files directly: `rm android/livtet-app/src/main/jniLibs/*/liblivtet_android.so`
- The `activity-compose` dependency must NOT have an explicit version — let `compose-bom:2026.03.00` manage it

### SQLite

- When writing SQL trigger bodies, ALWAYS terminate each statement with `;` before `END`
- Use `?mode=rwc` in SQLite connection URLs to allow read-write and file creation
- Optimize queries with JSON functions (`json_extract`, `json_object`), generated columns, window functions, expression indexes, and CTEs

### State Management

- Use `$state`, `$derived`, `$derived.by`, `$props` runes — do NOT use `export let`
- TanStack Query state accessed via `$` prefix: `$query.data`, `$query.isLoading`
- Query keys follow `['resource', 'action', { params }]` structure
- Mutations invalidate related queries in `onSuccess` via `useQueryClient`

### Tauri/IPC

- All backend calls go through `$lib/tauri.ts` using `invoke`
- Rust `snake_case` commands become `camelCase` JS wrappers
- Commands return structured objects matching Rust types

### Android Emulator

- Use `adb -e` for emulator targeting (emulator at `emulator-5554`)
