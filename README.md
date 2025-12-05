# Hazo Collab Forms

[![npm version](https://img.shields.io/npm/v/hazo_collab_forms.svg)](https://www.npmjs.com/package/hazo_collab_forms)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

React form components with integrated chat collaboration, built for Next.js with TypeScript and Tailwind CSS.

## Quick Install

```bash
# Install package and peer dependencies
npm install hazo_collab_forms react react-dom react-icons sonner \
  @radix-ui/react-dialog @radix-ui/react-label \
  hazo_chat hazo_ui hazo_auth hazo_config lucide-react

# Install required shadcn/ui components
npx shadcn@latest add button label dialog tooltip sonner popover command calendar separator card

# Copy config templates
cp node_modules/hazo_collab_forms/templates/*.ini ./

# Verify setup
npx hazo-collab-forms-verify
```

Add to `next.config.js`:

```javascript
const nextConfig = {
  transpilePackages: ['hazo_collab_forms'],
};
module.exports = nextConfig;
```

Add to `tailwind.config.ts` content:

```typescript
"./node_modules/hazo_collab_forms/**/*.{js,ts,jsx,tsx}",
```

See [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) for detailed setup instructions.

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

| Component | Description |
|-----------|-------------|
| `HazoCollabFormInputbox` | Text input with validation |
| `HazoCollabFormTextArea` | Multi-line text input |
| `HazoCollabFormCheckbox` | Boolean toggle |
| `HazoCollabFormCombo` | Dropdown select with search |
| `HazoCollabFormRadio` | Radio button group |
| `HazoCollabFormDate` | Date or date-range picker |
| `HazoCollabFormGroup` | Field grouping container |
| `HazoCollabFormSet` | Complete form with field arrays |

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

## Known Issues

### lucide-react Version Conflicts

Different Hazo packages require different versions of `lucide-react`. Add this to your `package.json` if you encounter conflicts:

```json
"overrides": {
  "lucide-react": "^0.553.0"
}
```

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
