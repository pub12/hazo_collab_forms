#!/usr/bin/env node
/**
 * CLI tool to install required shadcn components for hazo_collab_forms
 * Run with: npx hazo-collab-forms-setup
 *
 * Options:
 *   --all     Install all shadcn components (including optional)
 *   --combo   Install components for Combobox only
 *   --date    Install components for Date picker only
 *   --check   Only check which components are missing (don't install)
 */

import { existsSync } from 'fs';
import { resolve } from 'path';
import { execSync, spawnSync } from 'child_process';

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

const CHECK = `${GREEN}✓${RESET}`;
const CROSS = `${RED}✗${RESET}`;

interface ComponentGroup {
  name: string;
  components: string[];
  description: string;
}

const COMPONENT_GROUPS: ComponentGroup[] = [
  {
    name: 'core',
    components: ['button', 'label', 'dialog', 'tooltip'],
    description: 'Core components (required for all form fields)',
  },
  {
    name: 'combo',
    components: ['popover', 'command'],
    description: 'Combobox components (for HazoCollabFormCombo)',
  },
  {
    name: 'date',
    components: ['calendar'],
    description: 'Date picker components (for HazoCollabFormDate)',
  },
  {
    name: 'optional',
    components: ['sonner', 'separator', 'card'],
    description: 'Optional components (recommended)',
  },
];

function log(message: string): void {
  console.log(message);
}

function getComponentsDir(): string {
  const cwd = process.cwd();
  // Check common component paths
  const paths = [
    resolve(cwd, 'components/ui'),
    resolve(cwd, 'src/components/ui'),
    resolve(cwd, 'app/components/ui'),
  ];

  for (const p of paths) {
    if (existsSync(p)) {
      return p;
    }
  }

  // Default path
  return resolve(cwd, 'components/ui');
}

function checkComponent(name: string): boolean {
  const componentsDir = getComponentsDir();
  const tsxPath = resolve(componentsDir, `${name}.tsx`);
  return existsSync(tsxPath);
}

function getMissingComponents(components: string[]): string[] {
  return components.filter(c => !checkComponent(c));
}

function detectPackageManager(): 'npm' | 'yarn' | 'pnpm' | 'bun' {
  const cwd = process.cwd();

  if (existsSync(resolve(cwd, 'bun.lockb'))) return 'bun';
  if (existsSync(resolve(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(resolve(cwd, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

function runShadcnAdd(components: string[]): boolean {
  if (components.length === 0) return true;

  const pm = detectPackageManager();
  const npxCmd = pm === 'bun' ? 'bunx' : pm === 'pnpm' ? 'pnpm dlx' : 'npx';

  const cmd = `${npxCmd} shadcn@latest add ${components.join(' ')}`;

  log(`\n${DIM}Running: ${cmd}${RESET}\n`);

  try {
    // Use inherit to show shadcn prompts
    const result = spawnSync(cmd, {
      shell: true,
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    return result.status === 0;
  } catch (error) {
    log(`${RED}Failed to run shadcn CLI${RESET}`);
    return false;
  }
}

function showStatus(): void {
  log(`\n${BOLD}shadcn/ui Component Status${RESET}`);
  log('─'.repeat(50));

  for (const group of COMPONENT_GROUPS) {
    log(`\n${BOLD}${group.name.toUpperCase()}${RESET} ${DIM}(${group.description})${RESET}`);

    for (const comp of group.components) {
      const installed = checkComponent(comp);
      const icon = installed ? CHECK : CROSS;
      const status = installed ? 'installed' : 'missing';
      log(`  ${icon} ${comp} ${DIM}(${status})${RESET}`);
    }
  }
}

function showHelp(): void {
  log(`
${BOLD}hazo-collab-forms-setup${RESET} - Install required shadcn/ui components

${BOLD}Usage:${RESET}
  npx hazo-collab-forms-setup [options]

${BOLD}Options:${RESET}
  ${CYAN}(no options)${RESET}  Install core + combo + date components (recommended)
  ${CYAN}--all${RESET}         Install all components including optional
  ${CYAN}--core${RESET}        Install only core components
  ${CYAN}--combo${RESET}       Install only combobox components
  ${CYAN}--date${RESET}        Install only date picker components
  ${CYAN}--check${RESET}       Show status without installing
  ${CYAN}--help${RESET}        Show this help message

${BOLD}Examples:${RESET}
  npx hazo-collab-forms-setup          # Install recommended components
  npx hazo-collab-forms-setup --all    # Install everything
  npx hazo-collab-forms-setup --check  # Just check status
`);
}

function main(): void {
  const args = process.argv.slice(2);

  // Help
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  // Check only
  if (args.includes('--check')) {
    showStatus();
    return;
  }

  log(`\n${BOLD}${GREEN}hazo_collab_forms${RESET} - shadcn/ui Setup`);
  log('═'.repeat(50));

  // Determine which groups to install
  let groupsToInstall: string[] = [];

  if (args.includes('--all')) {
    groupsToInstall = ['core', 'combo', 'date', 'optional'];
  } else if (args.includes('--core')) {
    groupsToInstall = ['core'];
  } else if (args.includes('--combo')) {
    groupsToInstall = ['combo'];
  } else if (args.includes('--date')) {
    groupsToInstall = ['date'];
  } else {
    // Default: core + combo + date (most common use case)
    groupsToInstall = ['core', 'combo', 'date'];
  }

  // Collect all components to install
  const allComponents: string[] = [];
  const groupsMissing: { group: ComponentGroup; missing: string[] }[] = [];

  for (const groupName of groupsToInstall) {
    const group = COMPONENT_GROUPS.find(g => g.name === groupName);
    if (!group) continue;

    const missing = getMissingComponents(group.components);
    if (missing.length > 0) {
      groupsMissing.push({ group, missing });
      allComponents.push(...missing);
    }
  }

  // Show what will be installed
  if (allComponents.length === 0) {
    log(`\n${CHECK} All required components are already installed!`);
    showStatus();
    return;
  }

  log(`\n${BOLD}Components to install:${RESET}`);
  for (const { group, missing } of groupsMissing) {
    log(`\n  ${YELLOW}${group.name}${RESET} ${DIM}(${group.description})${RESET}`);
    for (const comp of missing) {
      log(`    ${CYAN}• ${comp}${RESET}`);
    }
  }

  // Install
  log(`\n${BOLD}Installing ${allComponents.length} component(s)...${RESET}`);

  const success = runShadcnAdd(allComponents);

  if (success) {
    log(`\n${CHECK} ${GREEN}Setup complete!${RESET}`);
    log(`\n${DIM}Run ${CYAN}npx hazo-collab-forms-verify${DIM} to verify your full setup.${RESET}\n`);
  } else {
    log(`\n${CROSS} ${RED}Some components may not have installed correctly.${RESET}`);
    log(`${DIM}Try running manually: ${CYAN}npx shadcn@latest add ${allComponents.join(' ')}${RESET}\n`);
    process.exit(1);
  }
}

main();
