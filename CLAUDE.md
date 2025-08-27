# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Seafoam Desktop is a React-based Electron application that provides a graphical user interface for the [Seafoam](https://github.com/shopify/seafoam) compiler graph analysis tool. The application allows users to browse and visualize compiler graphs from dump files without repeatedly invoking CLI commands.

## Essential Development Commands

### Getting Started
```bash
npm install                    # Install dependencies
npm run prepare               # Set up git pre-commit hooks (run once after clone)
npm start                     # Start development server with hot reload
npm run start:debug           # Start with remote debugging on port 9229
```

### Code Quality
```bash
npm run lint                  # Run ESLint with zero warnings policy
npm run lint:fix             # Auto-fix ESLint issues
npm run prettier             # Check formatting with Prettier
npm run prettier:fix         # Auto-format code with Prettier
```

### Building and Distribution
```bash
npm run package             # Package the app for current platform
npm run make                # Create distributables for current platform
npm run publish             # Publish to configured targets
```

## Architecture Overview

### Electron Structure
- **Main Process**: `src/electron/main.ts` - Entry point, handles IPC communication, window management
- **Renderer Process**: `src/renderer.ts` - Bootstraps React application
- **Preload Script**: `src/electron/preload.ts` - Secure bridge between main and renderer processes

### React Application Structure
- **Entry Point**: `src/App.tsx` - Main application component with 30/70 split layout
- **Context Providers**: Located in `src/contexts/` for state management
  - `GraphsLoadedContext` - Manages loaded graph state
  - `GraphDataSourceContext` - Handles graph data operations
  - `SelectedDumpFileContext` - Tracks currently selected dump file
- **Components**: `src/components/` contains UI components including:
  - `LeftPanel` - File browser and selection interface
  - `RightPanel` - Graph visualization area
  - `GraphPanel` - Main graph rendering component using d3-graphviz
  - `ErrorBoundary` - React error boundary for graceful error handling

### Key Integrations
- **Seafoam CLI Integration**: `src/electron/seafoam.ts` handles all interactions with the external `seafoam` command
- **IPC Communication**: `src/events.ts` defines typed events for main/renderer communication
- **File Utilities**: `src/lib/DumpFileUtils.ts` provides dump file management functions

### Build Configuration
- **Electron Forge**: Configured in package.json with webpack plugins
- **Webpack**: Separate configs for main (`webpack.main.config.js`) and renderer (`webpack.renderer.config.js`) processes
- **TypeScript**: Strict configuration with React JSX support in `tsconfig.json`

## Dependencies and Prerequisites

### External Requirements
- **Seafoam CLI**: The `seafoam` command must be available in PATH for graph processing
- **Node.js**: Current or LTS version required for development

### Key Technologies
- **Electron**: Desktop application framework
- **React**: UI framework
- **Ant Design**: Component library for consistent UI
- **d3-graphviz**: Graph visualization rendering
- **TypeScript**: Type-safe development
- **ESLint + Prettier**: Code quality and formatting

## Development Notes

### Error Handling
- All Seafoam command interactions include proper error handling with user-friendly dialogs
- Electron logging configured for debug output to console and error output to files
- React ErrorBoundary catches and displays component-level errors

### Memory Configuration
- Electron main process configured with `--max-old-space-size=8192` for handling large graph files
- Application handles potentially large compiler dump files that may be multiple megabytes

### Platform Considerations
- Cross-platform support (Windows, macOS, Linux) via Electron Forge makers
- macOS-specific menu handling and application naming
- Platform-specific error dialog formatting

### Git Hooks
- Husky pre-commit hooks enforce linting and formatting standards
- Run `npm run prepare` after initial clone to set up hooks properly
