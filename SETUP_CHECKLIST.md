# Hazo Collab Forms - Setup Guide

This guide will help you set up the `hazo_collab_forms` package in your Next.js application.

## Quick Start (5 Minutes)

For experienced developers who want to get started quickly:

```bash
# 1. Install the package and all peer dependencies
npm install hazo_collab_forms react react-dom react-icons sonner \
  @radix-ui/react-dialog @radix-ui/react-label \
  hazo_chat hazo_ui hazo_auth hazo_config lucide-react

# 2. Install all required shadcn/ui components
npx shadcn@latest add button label dialog tooltip sonner popover command calendar separator card

# 3. Copy config templates (run from your project root)
cp node_modules/hazo_collab_forms/templates/*.ini ./

# 4. Verify your setup
npx hazo-collab-forms-verify
```

Then add to your `next.config.js`:

```javascript
const nextConfig = {
  transpilePackages: ['hazo_collab_forms'],
};
module.exports = nextConfig;
```

And add to your `tailwind.config.ts` content array:

```typescript
"./node_modules/hazo_collab_forms/**/*.{js,ts,jsx,tsx}",
```

---

## Full Setup Guide

### Prerequisites

- Node.js 18+
- npm or yarn
- Next.js 14+ project with TypeScript

---

### Step 1: Install Dependencies

#### Main Package

```bash
npm install hazo_collab_forms
```

#### Peer Dependencies

```bash
npm install react react-dom react-icons sonner
npm install @radix-ui/react-dialog @radix-ui/react-label
npm install hazo_chat hazo_ui hazo_auth hazo_config
npm install lucide-react
```

> **Note**: `lucide-react` is required for the Combo and Date picker icons. Add this to your package.json overrides if you encounter version conflicts:
> ```json
> "overrides": {
>   "lucide-react": "^0.553.0"
> }
> ```

---

### Step 2: Install shadcn/ui Components

```bash
# Core components (required for all form fields)
npx shadcn@latest add button label dialog tooltip sonner

# For Combo/dropdown fields
npx shadcn@latest add popover command

# For Date picker fields
npx shadcn@latest add calendar

# Optional but recommended
npx shadcn@latest add separator card
```

---

### Step 3: Configure Next.js

Add to your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['hazo_collab_forms'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'hazo_collab_forms': require.resolve('hazo_collab_forms'),
      };
    }
    return config;
  },
};

module.exports = nextConfig;
```

---

### Step 4: Configure Tailwind CSS

Add to your `tailwind.config.ts` content paths:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/hazo_collab_forms/**/*.{js,ts,jsx,tsx}",
  ],
  // ... rest of your config
};

export default config;
```

---

### Step 5: Create Configuration Files

#### hazo_collab_forms_config.ini

Create in your project root:

```ini
[logging]
logfile=logs/hazo_collab_forms.log

[app]
name=My App
version=1.0.0

[chat]
background_color=bg-muted
field_background_color=bg-muted
default_testing_recipient_id=[]
```

#### hazo_chat_config.ini

```ini
[api]
base_url=/api/hazo_chat

[realtime]
mode=polling
polling_interval=5000

[messages]
per_page=20
```

#### hazo_auth_config.ini

See the [hazo_auth documentation](https://github.com/pub12/hazo_auth) for configuration details.

---

### Step 6: Create API Routes

#### Chat Messages API

Create `app/api/hazo_chat/messages/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Implement your chat messages API
  return NextResponse.json({ messages: [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // Save message and return
  return NextResponse.json({ success: true });
}
```

---

### Step 7: Use Components

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

### Available Components

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

---

## Troubleshooting

### Components not rendering

1. Check all peer dependencies are installed
2. Verify shadcn components are installed (`npx shadcn@latest add ...`)
3. Check browser console for import errors
4. Ensure `transpilePackages` includes `hazo_collab_forms`

### Chat not working

1. Verify `hazo_chat` package is installed and configured
2. Check API routes exist at `/api/hazo_chat/messages`
3. Ensure `hazo_chat_receiver_user_id` prop is provided
4. Verify `hazo_chat_config.ini` exists

### Styling issues

1. Ensure `hazo_collab_forms` is in Tailwind content paths
2. Check shadcn components are styled correctly
3. Look for CSS conflicts in browser dev tools

### TypeScript errors

1. Verify TypeScript 5.3+
2. Check `@types/react` and `@types/react-dom` are installed
3. Ensure module resolution is set correctly in tsconfig.json

### Build errors

1. Run `npm run clean && npm run build`
2. Check for missing dependencies with `npx hazo-collab-forms-verify`
3. Verify ES module exports use `.js` extensions

---

## Additional Resources

- [Package Repository](https://github.com/pub12/hazo_collab_forms)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Hazo Chat Documentation](https://github.com/pub12/hazo_chat)
- [Hazo Auth Documentation](https://github.com/pub12/hazo_auth)

---

**Note:** This package uses ES modules. Ensure your project is configured to handle ES module imports correctly.
