# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**hazo_collab_forms** is an ES module npm package that provides reusable collaboration form components built with React, Next.js, TypeScript, and Tailwind CSS. It enables form fields with integrated chat functionality, allowing users to collaborate on form submissions in real-time.

## Commands

### Build & Development
```bash
npm run build              # Build package (TypeScript → JavaScript)
npm run dev:package        # Watch mode for development
npm run dev:test-app       # Build package and run test app in dev mode
npm run build:test-app     # Build package and test app for production
npm run clean              # Clean dist directory
```

### Test App (run from test-app/)
```bash
npm run dev                # Run Next.js dev server
npm run build              # Build for production
npm run lint               # Run ESLint
```

## Architecture

### Source Structure
- `src/components/` - React form components (inputbox, textarea, checkbox, combo, radio, date, group, form-set)
- `src/lib/` - Server-only utilities (config management via hazo_config)
- `src/utils/` - Client-side utilities (cn, chat hooks)
- `src/bin/` - CLI tools (verify-setup)
- `src/types/` - Type definitions
- `templates/` - Config file templates for consumers
- `test-app/` - Full Next.js application for testing

### Entry Points (Package Exports)
- `.` (default) - Client-safe components and utilities
- `./components` - Components only
- `./utils` - Utilities only (cn, chat hooks)
- `./lib` - Server-only utilities (config functions)

### CLI Tools
- `npx hazo-collab-forms-verify` - Verify setup in consuming apps

### Component Architecture

All form components inherit from a shared base (`hazo_collab_form_base.tsx`) providing:
- `CollabFormFieldContainer` - Wrapper div with styling
- `CollabFormFieldLabel` - Label component
- `CollabFormChatIcon` - Chat trigger button
- `CollabFormFieldError` - Error display
- `CollabFormDataOkCheckbox` - Validation checkbox
- `CollabFormFileUploadSection` - File handling

**Common Base Props:**
- `label`, `error` - Field label and error message
- `field_id`, `field_data_id`, `field_name` - Identifiers for chat context
- `has_chat_messages` - Visual indicator (red border) when chat exists
- `is_chat_active` - Visual feedback (grey background) when chat open
- `data_ok_checked` - Validation checkbox state
- `container_class_name`, `label_class_name`, `field_wrapper_class_name` - Styling

### Chat Integration
- Each field has a chat icon trigger linked via `reference_id` and `reference_type`
- Hooks: `use_collab_chat()` for click handling, `use_chat_messages_check()` for message status
- Visual states: Red border = has messages, Grey background = chat active

### Configuration
Server-only config via `hazo_collab_forms_config.ini`:
```ini
[logging]
logfile=logs/hazo_collab_forms.log
[chat]
background_color=bg-muted
field_background_color=bg-muted
```

## Critical ES Module Rules

**Always use explicit `.js` extensions in all exports:**
```typescript
// ✅ CORRECT
export * from './components/index.js';
export { get_config } from './config.js';

// ❌ WRONG - Will cause runtime failures
export * from './components';
```

TypeScript compiles to `.js` files; imports must match. This applies to all `index.ts` files.

## Code Conventions

### Naming
- Use `snake_case` for all identifiers
- Class name identifiers prefixed with `cls_` for DOM element identification

### Technology Stack
- React, Next.js, TailwindCSS, TypeScript, shadcn/ui
- Use `npx shadcn@latest add` to install components (NOT shadcn-ui)

### Icons & Notifications
- Icons: Use `react-icons` library
- Toasts: shadcn sonner (for notifications without acknowledgment)
- Alerts: shadcn alert dialog with OK button (for acknowledgment required)

### Edit Field Pattern
- Non-editable by default with lucide pencil icon
- Green circle-check for save, red circle-x for cancel

### Configuration & Logging
- Hard-coded values with potential to change → config INI files
- Sensitive data → .env files
- Console logging with filename, line number, message, and relevant data in JSON format

## Key Dependencies

- `hazo_auth`, `hazo_config`, `hazo_ui`, `hazo_chat` - Hazo ecosystem packages
- `react-icons`, `lucide-react` - Icon libraries
- `@radix-ui/react-dialog`, `@radix-ui/react-label` - UI primitives
- `sonner` - Toast notifications
- `clsx`, `tailwind-merge` - Class name utilities

## TypeScript Config

- `tsconfig.json` - Development mode (bundler resolution)
- `tsconfig.build.json` - Build mode (node16 resolution for proper ESM output)
