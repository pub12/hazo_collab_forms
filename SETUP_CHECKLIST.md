# Hazo Collab Forms - Setup Guide

Complete setup guide for integrating `hazo_collab_forms` into your Next.js application.

---

## Quick Start (Experienced Developers)

```bash
# 1. Install everything
npm install hazo_collab_forms react react-dom react-icons sonner lucide-react \
  @radix-ui/react-dialog @radix-ui/react-label hazo_chat hazo_ui hazo_auth hazo_config

# 2. Initialize shadcn (if not done) and install components
npx shadcn@latest init
npx shadcn@latest add button label dialog tooltip sonner popover command calendar separator card

# 3. Copy config templates
cp node_modules/hazo_collab_forms/templates/*.ini ./

# 4. Verify setup
npx hazo-collab-forms-verify
```

Then configure Next.js and Tailwind (see Steps 4-5 below).

---

## Prerequisites

- [ ] Node.js 18+
- [ ] Next.js 14+ with TypeScript
- [ ] Tailwind CSS configured

---

## Step 1: Install the Package

```bash
npm install hazo_collab_forms
```

---

## Step 2: Install Peer Dependencies

### 2a. Core Dependencies

```bash
# React (skip if already installed)
npm install react react-dom

# UI Libraries
npm install react-icons sonner lucide-react

# Radix UI Primitives
npm install @radix-ui/react-dialog @radix-ui/react-label
```

### 2b. Hazo Ecosystem Packages

These are required for the chat collaboration features:

```bash
npm install hazo_chat hazo_ui hazo_auth hazo_config
```

### One-Line Install (All Dependencies)

```bash
npm install hazo_collab_forms react react-dom react-icons sonner lucide-react \
  @radix-ui/react-dialog @radix-ui/react-label hazo_chat hazo_ui hazo_auth hazo_config
```

---

## Step 3: Install shadcn/ui Components

### 3a. Initialize shadcn/ui (First Time Only)

If you haven't set up shadcn/ui in your project:

```bash
npx shadcn@latest init
```

Follow the prompts to configure your project.

### 3b. Install Required Components

**Core Components** (required for all form fields):

```bash
npx shadcn@latest add button
npx shadcn@latest add label
npx shadcn@latest add dialog
npx shadcn@latest add tooltip
npx shadcn@latest add sonner
```

**For HazoCollabFormCombo** (dropdown/select with search):

```bash
npx shadcn@latest add popover
npx shadcn@latest add command
```

**For HazoCollabFormDate** (date picker):

```bash
npx shadcn@latest add calendar
```

**Optional but Recommended**:

```bash
npx shadcn@latest add separator
npx shadcn@latest add card
```

### One-Line Install (All shadcn Components)

```bash
npx shadcn@latest add button label dialog tooltip sonner popover command calendar separator card
```

### Component Requirements by Form Field

| Form Component | Required shadcn Components |
|----------------|---------------------------|
| `HazoCollabFormInputbox` | button, label, dialog, tooltip, sonner |
| `HazoCollabFormTextArea` | button, label, dialog, tooltip, sonner |
| `HazoCollabFormCheckbox` | button, label, dialog, tooltip, sonner |
| `HazoCollabFormRadio` | button, label, dialog, tooltip, sonner |
| `HazoCollabFormCombo` | + popover, command |
| `HazoCollabFormDate` | + calendar |
| `HazoCollabFormGroup` | button, label, dialog, tooltip, sonner |
| `HazoCollabFormSet` | all of the above |

---

## Step 4: Configure Next.js

Add to your `next.config.js` (or `next.config.mjs`):

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['hazo_collab_forms'],
};

module.exports = nextConfig;
```

### Advanced Configuration (if needed)

If you encounter module resolution issues:

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

## Step 5: Configure Tailwind CSS

Add the package to your `tailwind.config.ts` content paths:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Add this line:
    "./node_modules/hazo_collab_forms/**/*.{js,ts,jsx,tsx}",
  ],
  // ... rest of your config
};

export default config;
```

---

## Step 6: Create Configuration Files

### Option A: Copy Templates (Recommended)

```bash
cp node_modules/hazo_collab_forms/templates/*.ini ./
```

### Option B: Create Manually

**hazo_collab_forms_config.ini** (in project root):

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

**hazo_chat_config.ini** (in project root):

```ini
[api]
base_url=/api/hazo_chat

[realtime]
mode=polling
polling_interval=5000

[messages]
per_page=20
```

**hazo_auth_config.ini** (in project root):

See [hazo_auth documentation](https://github.com/pub12/hazo_auth) for configuration options.

---

## Step 7: Set Up API Routes (For Chat)

Create the chat API endpoint at `app/api/hazo_chat/messages/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Implement chat message retrieval
  // Query params: reference_id, reference_type
  return NextResponse.json({ messages: [] });
}

export async function POST(request: NextRequest) {
  // Implement chat message creation
  const body = await request.json();
  // Save message to your database
  return NextResponse.json({ success: true });
}
```

---

## Step 8: Verify Installation

Run the verification tool:

```bash
npx hazo-collab-forms-verify
```

This checks:
- [ ] All peer dependencies installed
- [ ] Config files exist
- [ ] Next.js configured correctly
- [ ] Tailwind configured correctly
- [ ] shadcn components installed

---

## Step 9: Start Using Components

```typescript
'use client';

import { HazoCollabFormInputbox } from 'hazo_collab_forms';
import { useState } from 'react';

export default function MyForm() {
  const [name, setName] = useState('');

  return (
    <HazoCollabFormInputbox
      label="Your Name"
      value={name}
      onChange={setName}
      field_data_id="user-name"
      field_name="User Name"
      hazo_chat_receiver_user_id="recipient-user-id"
    />
  );
}
```

---

## Troubleshooting

### Components Not Rendering

1. Check browser console for import errors
2. Verify shadcn components are installed:
   ```bash
   ls components/ui/
   ```
3. Ensure `transpilePackages` includes `hazo_collab_forms`
4. Run verification: `npx hazo-collab-forms-verify`

### Chat Not Working

1. Verify `hazo_chat` is installed: `npm list hazo_chat`
2. Check `hazo_chat_config.ini` exists in project root
3. Ensure API routes exist at `/api/hazo_chat/messages`
4. Verify `hazo_chat_receiver_user_id` prop is provided

### Styling Issues

1. Verify package path in Tailwind content:
   ```typescript
   "./node_modules/hazo_collab_forms/**/*.{js,ts,jsx,tsx}"
   ```
2. Restart dev server after changing Tailwind config
3. Check for CSS conflicts in browser dev tools

### TypeScript Errors

1. Verify TypeScript 5.3+: `npx tsc --version`
2. Ensure `@types/react` and `@types/react-dom` are installed
3. Check module resolution in `tsconfig.json`

### lucide-react Version Conflicts

Add to your `package.json`:

```json
"overrides": {
  "lucide-react": "^0.553.0"
}
```

Then run `npm install`.

### Build Errors

1. Clean and rebuild:
   ```bash
   rm -rf .next node_modules/.cache
   npm run build
   ```
2. Check for missing shadcn components in error messages
3. Verify ES module imports use correct paths

---

## Checklist Summary

- [ ] Package installed (`npm install hazo_collab_forms`)
- [ ] Peer dependencies installed
- [ ] shadcn/ui initialized
- [ ] Required shadcn components installed
- [ ] `next.config.js` configured with `transpilePackages`
- [ ] `tailwind.config.ts` includes package path
- [ ] Config files created (`.ini` files)
- [ ] API routes set up (for chat)
- [ ] Verification passed (`npx hazo-collab-forms-verify`)

---

## Additional Resources

- [Package Repository](https://github.com/pub12/hazo_collab_forms)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Hazo Chat Documentation](https://github.com/pub12/hazo_chat)
- [Hazo Auth Documentation](https://github.com/pub12/hazo_auth)


