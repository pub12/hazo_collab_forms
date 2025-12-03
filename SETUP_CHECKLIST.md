# Hazo Collab Forms - Setup Checklist

This checklist will guide you through setting up the `hazo_collab_forms` package in your Next.js application.

## Prerequisites

- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] Next.js 14+ project (or create a new one)
- [ ] TypeScript configured in your project

## Step 1: Install Package Dependencies

### Install the Package

```bash
npm install hazo_collab_forms
```

Or if using from local development:

```bash
npm install file:../path/to/hazo_collab_forms
```

### Install Peer Dependencies

The package requires these peer dependencies:

```bash
npm install react react-dom react-icons sonner
npm install @radix-ui/react-dialog @radix-ui/react-label
npm install hazo_chat@^2.0.16 hazo_ui@^2.2.1
```

### Install Required Hazo Packages

```bash
npm install hazo_auth@^1.6.4 hazo_config@^1.0.0
```

## Step 2: Install shadcn/ui Components

The package requires several shadcn/ui components. Install them using:

```bash
# Required for all components
npx shadcn@latest add button
npx shadcn@latest add label
npx shadcn@latest add dialog
npx shadcn@latest add tooltip
npx shadcn@latest add sonner

# Required for Combo component
npx shadcn@latest add popover
npx shadcn@latest add command

# Required for Date component
npx shadcn@latest add calendar

# Optional but recommended
npx shadcn@latest add separator
npx shadcn@latest add card
```

### Install lucide-react

Required for icons in Combo and Date components:

```bash
npm install lucide-react
```

## Step 3: Configure Next.js

### Update `next.config.js`

Add the following configuration to your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['hazo_collab_forms'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Resolve hazo_collab_forms to the local package
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

### Configure TypeScript Paths (Optional)

If you want to use path aliases, add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Step 4: Create Configuration File

Create `hazo_collab_forms_config.ini` in your project root:

```ini
[logging]
logfile=logs/hazo_collab_forms.log

[app]
name=Hazo Collaboration Forms
version=1.0.0

[chat]
# Background color for the chat window when opened from form fields
# Can be a Tailwind CSS class name (e.g., "bg-muted", "bg-gray-100")
background_color=bg-muted

# Background color for form fields when their chat is active/open
field_background_color=bg-muted

# Default testing recipient ID mapping (optional)
# JSON array that maps current users to recipient users
# Format: [{"current_user": "<current_user_id>", "recipient_user": "<recipient_user_id>"}, ...]
default_testing_recipient_id=[]
```

## Step 5: Configure Tailwind CSS

Ensure your `tailwind.config.ts` includes the package in content paths:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/hazo_collab_forms/**/*.{js,ts,jsx,tsx}", // Add this
  ],
  // ... rest of your config
};

export default config;
```

## Step 6: Set Up Hazo Chat (Required for Chat Functionality)

### Install Hazo Chat

```bash
npm install hazo_chat@^2.0.16
```

### Create Hazo Chat Configuration

Create `hazo_chat_config.ini` in your project root:

```ini
[api]
base_url=/api/hazo_chat

[realtime]
mode=polling
polling_interval=5000

[messages]
per_page=20
```

### Create API Route

Create `app/api/hazo_chat/messages/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Implement your chat messages API
  // This should return messages based on reference_id and reference_type
  return NextResponse.json({ messages: [] });
}

export async function POST(request: NextRequest) {
  // Implement your chat message creation API
  const body = await request.json();
  // Save message and return
  return NextResponse.json({ success: true });
}
```

## Step 7: Set Up Hazo Auth (Required for User Context)

### Install Hazo Auth

```bash
npm install hazo_auth@^1.6.4
```

### Create Hazo Auth Configuration

Create `hazo_auth_config.ini` in your project root. See the hazo_auth package documentation for configuration details.

## Step 8: Import and Use Components

### Basic Import

```typescript
import {
  HazoCollabFormInputbox,
  HazoCollabFormTextArea,
  HazoCollabFormCheckbox,
  HazoCollabFormCombo,
  HazoCollabFormRadio,
  HazoCollabFormDate,
  HazoCollabFormGroup,
  HazoCollabFormSet,
} from 'hazo_collab_forms';
```

### Example Usage

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

## Step 9: Verify Installation

### Check for Errors

1. [ ] Run `npm run build` - should complete without errors
2. [ ] Check browser console for any import errors
3. [ ] Verify all shadcn components are accessible

### Test Components

1. [ ] Test Inputbox component renders correctly
2. [ ] Test TextArea component renders correctly
3. [ ] Test Combo component (requires popover/command)
4. [ ] Test Date component (requires calendar)
5. [ ] Test Chat functionality (requires hazo_chat setup)
6. [ ] Test field disabling when chat is active

## Step 10: Development Setup (For Package Development)

If you're developing the package itself:

### Install All Dependencies

```bash
npm install
```

This installs dependencies for both the root package and test-app workspace.

### Build the Package

```bash
npm run build
```

### Watch Mode for Development

```bash
npm run dev:package
```

### Run Test App

```bash
npm run dev:test-app
```

## Troubleshooting

### Issue: Components not rendering

- [ ] Check that all peer dependencies are installed
- [ ] Verify shadcn components are installed correctly
- [ ] Check browser console for import errors
- [ ] Verify Next.js config includes `transpilePackages`

### Issue: Chat not working

- [ ] Verify `hazo_chat` is installed and configured
- [ ] Check that API routes are set up correctly
- [ ] Verify `hazo_chat_receiver_user_id` prop is provided
- [ ] Check `hazo_chat_config.ini` exists and is configured

### Issue: Styling issues

- [ ] Verify Tailwind CSS is configured correctly
- [ ] Check that `hazo_collab_forms` is in Tailwind content paths
- [ ] Ensure shadcn components are styled correctly
- [ ] Check for CSS conflicts

### Issue: TypeScript errors

- [ ] Verify TypeScript version is 5.3+
- [ ] Check that all type definitions are installed
- [ ] Ensure `@types/react` and `@types/react-dom` are installed
- [ ] Verify module resolution in `tsconfig.json`

### Issue: Build errors

- [ ] Run `npm run clean && npm run build`
- [ ] Check for missing dependencies
- [ ] Verify all exports use `.js` extensions (for ES modules)
- [ ] Check Next.js version compatibility

## Additional Resources

- [Package Repository](https://github.com/pub12/hazo_collab_forms)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Hazo Chat Documentation](https://github.com/pub12/hazo_chat)
- [Hazo Auth Documentation](https://github.com/pub12/hazo_auth)

## Checklist Summary

- [ ] Prerequisites installed
- [ ] Package and peer dependencies installed
- [ ] shadcn/ui components installed
- [ ] Next.js configured
- [ ] Configuration files created
- [ ] Tailwind CSS configured
- [ ] Hazo Chat set up
- [ ] Hazo Auth set up
- [ ] Components imported and tested
- [ ] All functionality verified

---

**Note:** This package uses ES modules. Ensure your project is configured to handle ES module imports correctly.

