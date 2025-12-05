# Hazo Collab Forms

[![npm version](https://img.shields.io/npm/v/hazo_collab_forms.svg)](https://www.npmjs.com/package/hazo_collab_forms)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

React form components with integrated chat collaboration, built for Next.js with TypeScript and Tailwind CSS.

## Installation

### Step 1: Install the Package

```bash
npm install hazo_collab_forms
```

### Step 2: Install Peer Dependencies

```bash
# Core React dependencies (skip if already installed)
npm install react react-dom

# UI dependencies
npm install react-icons sonner lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-label

# Hazo ecosystem packages (required for chat functionality)
npm install hazo_chat hazo_ui hazo_auth hazo_config
```

### Step 3: Install shadcn/ui Components

This package requires shadcn/ui components. If you haven't initialized shadcn/ui yet:

```bash
npx shadcn@latest init
```

Then install the required components:

```bash
# Core components (required for all form fields)
npx shadcn@latest add button label dialog tooltip sonner

# For HazoCollabFormCombo (dropdown/select)
npx shadcn@latest add popover command

# For HazoCollabFormDate (date picker)
npx shadcn@latest add calendar

# Optional but recommended
npx shadcn@latest add separator card
```

### Step 4: Configure Next.js

Add to your `next.config.js`:

```javascript
const nextConfig = {
  transpilePackages: ['hazo_collab_forms'],
};
module.exports = nextConfig;
```

### Step 5: Configure Tailwind CSS

Add to `tailwind.config.ts` content array:

```typescript
content: [
  // ... your existing paths
  "./node_modules/hazo_collab_forms/**/*.{js,ts,jsx,tsx}",
],
```

### Step 6: Create Config Files

Copy the template config files to your project root:

```bash
cp node_modules/hazo_collab_forms/templates/*.ini ./
```

This creates:
- `hazo_collab_forms_config.ini` - Main package config
- `hazo_chat_config.ini` - Chat functionality config
- `hazo_auth_config.ini` - Authentication config

### Step 7: Verify Installation

```bash
npx hazo-collab-forms-verify
```

This checks all dependencies, config files, and shadcn components are properly installed.

---

## Quick Reference

### One-Line Install (All Dependencies)

```bash
npm install hazo_collab_forms react react-dom react-icons sonner lucide-react \
  @radix-ui/react-dialog @radix-ui/react-label hazo_chat hazo_ui hazo_auth hazo_config
```

### One-Line shadcn Install (All Components)

```bash
npx shadcn@latest add button label dialog tooltip sonner popover command calendar separator card
```

---

## Usage

```typescript
'use client';

import { HazoCollabFormInputbox } from 'hazo_collab_forms';
import { useState } from 'react';

export default function MyForm() {
  const [value, setValue] = useState('');

  return (
    <HazoCollabFormInputbox
      label="Your Name"
      value={value}
      onChange={setValue}
      field_data_id="user-name"
      field_name="User Name"
      hazo_chat_receiver_user_id="recipient-user-id"
    />
  );
}
```

## Components

| Component | Description | Required shadcn |
|-----------|-------------|-----------------|
| `HazoCollabFormInputbox` | Text input with validation | button, label, dialog |
| `HazoCollabFormTextArea` | Multi-line text input | button, label, dialog |
| `HazoCollabFormCheckbox` | Boolean toggle | button, label, dialog |
| `HazoCollabFormCombo` | Dropdown select with search | + popover, command |
| `HazoCollabFormRadio` | Radio button group | button, label, dialog |
| `HazoCollabFormDate` | Date or date-range picker | + calendar |
| `HazoCollabFormGroup` | Field grouping container | button, label, dialog |
| `HazoCollabFormSet` | Complete form with field arrays | all components |

## Import Paths

```typescript
// Default: All client-safe components and utilities
import { HazoCollabFormInputbox, cn } from 'hazo_collab_forms';

// Components only
import { HazoCollabFormInputbox } from 'hazo_collab_forms/components';

// Utilities only
import { cn, use_collab_chat } from 'hazo_collab_forms/utils';

// Server-only (config functions)
import { get_config } from 'hazo_collab_forms/lib';
```

## Troubleshooting

### lucide-react Version Conflicts

Different Hazo packages require different versions of `lucide-react`. Add this to your `package.json`:

```json
"overrides": {
  "lucide-react": "^0.553.0"
}
```

### Missing shadcn Components

If you see errors about missing components, install the specific shadcn component:

```bash
npx shadcn@latest add [component-name]
```

### Verify Your Setup

Run the verification tool to check for common issues:

```bash
npx hazo-collab-forms-verify
```

See [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) for detailed troubleshooting.

---

## Development

### Package Structure

- **Root**: ES module npm package
- **test-app**: Next.js application for testing

### Commands

```bash
npm run build          # Build the package
npm run dev:package    # Watch mode for development
npm run dev:test-app   # Build and run test app
npm run build:test-app # Build for production
npm run clean          # Remove dist directory
```

### TypeScript Configuration

- `tsconfig.json`: Development (bundler module resolution)
- `tsconfig.build.json`: Build (Node16 for ES module output)

### ES Module Exports

All exports use explicit `.js` extensions as required for ES modules:

```typescript
export * from './lib/index.js';
export * from './components/index.js';
```

## License

MIT
