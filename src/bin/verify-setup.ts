#!/usr/bin/env node
/**
 * CLI tool to verify hazo_collab_forms setup in consuming applications
 * Run with: npx hazo-collab-forms-verify
 */

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const BOLD = '\x1b[1m';

const CHECK = `${GREEN}✓${RESET}`;
const CROSS = `${RED}✗${RESET}`;
const WARN = `${YELLOW}⚠${RESET}`;

interface CheckResult {
  passed: boolean;
  message: string;
  fix?: string;
}

function log(message: string): void {
  console.log(message);
}

function header(title: string): void {
  log(`\n${BOLD}${BLUE}${title}${RESET}`);
  log('─'.repeat(50));
}

function result(check: CheckResult): void {
  const icon = check.passed ? CHECK : CROSS;
  log(`${icon} ${check.message}`);
  if (!check.passed && check.fix) {
    log(`  ${YELLOW}Fix: ${check.fix}${RESET}`);
  }
}

function checkFileExists(filePath: string, name: string, fix?: string): CheckResult {
  const exists = existsSync(filePath);
  return {
    passed: exists,
    message: `${name} ${exists ? 'found' : 'not found'}`,
    fix: fix || `Create ${name}`,
  };
}

function checkPackageJson(): CheckResult[] {
  const results: CheckResult[] = [];
  const pkgPath = resolve(process.cwd(), 'package.json');

  if (!existsSync(pkgPath)) {
    return [{ passed: false, message: 'package.json not found', fix: 'Run from project root' }];
  }

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    // Check required dependencies
    const required = [
      'hazo_collab_forms',
      'hazo_chat',
      'hazo_ui',
      'hazo_auth',
      'hazo_config',
      'react',
      'react-dom',
      'react-icons',
      'sonner',
      '@radix-ui/react-dialog',
      '@radix-ui/react-label',
    ];

    for (const dep of required) {
      const installed = dep in deps;
      results.push({
        passed: installed,
        message: `${dep} ${installed ? `(${deps[dep]})` : 'missing'}`,
        fix: `npm install ${dep}`,
      });
    }

    // Check optional but recommended
    const optional = ['lucide-react'];
    for (const dep of optional) {
      const installed = dep in deps;
      results.push({
        passed: installed,
        message: `${dep} ${installed ? `(${deps[dep]})` : 'not installed (optional)'}`,
        fix: `npm install ${dep}`,
      });
    }

    // Check for lucide-react override
    if (pkg.overrides?.['lucide-react']) {
      results.push({
        passed: true,
        message: `lucide-react override: ${pkg.overrides['lucide-react']}`,
      });
    }

  } catch (e) {
    results.push({ passed: false, message: 'Failed to parse package.json', fix: 'Check JSON syntax' });
  }

  return results;
}

function checkConfigFiles(): CheckResult[] {
  const results: CheckResult[] = [];
  const cwd = process.cwd();

  // Required config files
  const configs = [
    {
      path: resolve(cwd, 'hazo_collab_forms_config.ini'),
      name: 'hazo_collab_forms_config.ini',
      fix: 'cp node_modules/hazo_collab_forms/templates/hazo_collab_forms_config.ini ./',
    },
    {
      path: resolve(cwd, 'hazo_chat_config.ini'),
      name: 'hazo_chat_config.ini',
      fix: 'cp node_modules/hazo_collab_forms/templates/hazo_chat_config.ini ./',
    },
    {
      path: resolve(cwd, 'hazo_auth_config.ini'),
      name: 'hazo_auth_config.ini',
      fix: 'See hazo_auth documentation for config template',
    },
  ];

  for (const config of configs) {
    results.push(checkFileExists(config.path, config.name, config.fix));
  }

  return results;
}

function checkNextConfig(): CheckResult {
  const cwd = process.cwd();
  const jsPath = resolve(cwd, 'next.config.js');
  const mjsPath = resolve(cwd, 'next.config.mjs');
  const tsPath = resolve(cwd, 'next.config.ts');

  let configPath: string | null = null;
  if (existsSync(jsPath)) configPath = jsPath;
  else if (existsSync(mjsPath)) configPath = mjsPath;
  else if (existsSync(tsPath)) configPath = tsPath;

  if (!configPath) {
    return {
      passed: false,
      message: 'next.config.js not found',
      fix: 'Create next.config.js with transpilePackages config',
    };
  }

  const content = readFileSync(configPath, 'utf-8');
  const hasTranspile = content.includes('transpilePackages') && content.includes('hazo_collab_forms');

  return {
    passed: hasTranspile,
    message: hasTranspile
      ? 'next.config includes transpilePackages for hazo_collab_forms'
      : 'transpilePackages not configured for hazo_collab_forms',
    fix: "Add transpilePackages: ['hazo_collab_forms'] to next.config.js",
  };
}

function checkTailwindConfig(): CheckResult {
  const cwd = process.cwd();
  const tsPath = resolve(cwd, 'tailwind.config.ts');
  const jsPath = resolve(cwd, 'tailwind.config.js');

  let configPath: string | null = null;
  if (existsSync(tsPath)) configPath = tsPath;
  else if (existsSync(jsPath)) configPath = jsPath;

  if (!configPath) {
    return {
      passed: false,
      message: 'tailwind.config not found',
      fix: 'Create tailwind.config.ts',
    };
  }

  const content = readFileSync(configPath, 'utf-8');
  const hasHazoPath = content.includes('hazo_collab_forms');

  return {
    passed: hasHazoPath,
    message: hasHazoPath
      ? 'Tailwind content includes hazo_collab_forms'
      : 'hazo_collab_forms not in Tailwind content paths',
    fix: 'Add "./node_modules/hazo_collab_forms/**/*.{js,ts,jsx,tsx}" to content array',
  };
}

function checkShadcnComponents(): CheckResult[] {
  const results: CheckResult[] = [];
  const cwd = process.cwd();
  const componentsDir = resolve(cwd, 'components/ui');

  if (!existsSync(componentsDir)) {
    return [{
      passed: false,
      message: 'components/ui directory not found',
      fix: 'npx shadcn@latest init',
    }];
  }

  const required = ['button', 'label', 'dialog', 'tooltip'];
  const forCombo = ['popover', 'command'];
  const forDate = ['calendar'];
  const optional = ['sonner', 'separator', 'card'];

  const checkComponent = (name: string, type: string): CheckResult => {
    const tsxPath = resolve(componentsDir, `${name}.tsx`);
    const exists = existsSync(tsxPath);
    return {
      passed: exists,
      message: `${name} (${type}) ${exists ? 'installed' : 'missing'}`,
      fix: `npx shadcn@latest add ${name}`,
    };
  };

  for (const comp of required) {
    results.push(checkComponent(comp, 'required'));
  }
  for (const comp of forCombo) {
    results.push(checkComponent(comp, 'for Combo'));
  }
  for (const comp of forDate) {
    results.push(checkComponent(comp, 'for Date'));
  }
  for (const comp of optional) {
    const check = checkComponent(comp, 'optional');
    // Don't fail for optional components
    if (!check.passed) {
      check.message = `${comp} (optional) not installed`;
    }
    results.push(check);
  }

  return results;
}

async function main(): Promise<void> {
  log(`\n${BOLD}Hazo Collab Forms - Setup Verification${RESET}`);
  log('═'.repeat(50));

  let totalPassed = 0;
  let totalFailed = 0;

  // Check dependencies
  header('Dependencies');
  const depResults = checkPackageJson();
  for (const r of depResults) {
    result(r);
    if (r.passed) totalPassed++; else totalFailed++;
  }

  // Check config files
  header('Configuration Files');
  const configResults = checkConfigFiles();
  for (const r of configResults) {
    result(r);
    if (r.passed) totalPassed++; else totalFailed++;
  }

  // Check Next.js config
  header('Next.js Configuration');
  const nextResult = checkNextConfig();
  result(nextResult);
  if (nextResult.passed) totalPassed++; else totalFailed++;

  // Check Tailwind config
  const tailwindResult = checkTailwindConfig();
  result(tailwindResult);
  if (tailwindResult.passed) totalPassed++; else totalFailed++;

  // Check shadcn components
  header('shadcn/ui Components');
  const shadcnResults = checkShadcnComponents();
  for (const r of shadcnResults) {
    result(r);
    if (r.passed) totalPassed++; else totalFailed++;
  }

  // Summary
  header('Summary');
  log(`${CHECK} Passed: ${totalPassed}`);
  log(`${CROSS} Failed: ${totalFailed}`);

  if (totalFailed === 0) {
    log(`\n${GREEN}${BOLD}All checks passed! Your setup is complete.${RESET}\n`);
  } else {
    log(`\n${YELLOW}${BOLD}Some checks failed. See fixes above.${RESET}\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
