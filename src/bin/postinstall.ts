#!/usr/bin/env node
/**
 * Postinstall script to display setup instructions after npm install
 * Shows required shadcn components and configuration steps
 */

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

function log(message: string): void {
  console.log(message);
}

function main(): void {
  // Only show in TTY (not in CI or piped output)
  if (!process.stdout.isTTY) {
    return;
  }

  log('');
  log(`${BOLD}${GREEN}╔════════════════════════════════════════════════════════════════╗${RESET}`);
  log(`${BOLD}${GREEN}║${RESET}  ${BOLD}hazo_collab_forms${RESET} installed successfully!                    ${BOLD}${GREEN}║${RESET}`);
  log(`${BOLD}${GREEN}╚════════════════════════════════════════════════════════════════╝${RESET}`);
  log('');
  log(`${BOLD}${YELLOW}Required shadcn/ui components:${RESET}`);
  log('');
  log(`  ${CYAN}npx shadcn@latest add button label dialog tooltip${RESET}`);
  log('');
  log(`${BOLD}${YELLOW}For Combobox component (HazoCollabFormCombo):${RESET}`);
  log('');
  log(`  ${CYAN}npx shadcn@latest add popover command${RESET}`);
  log('');
  log(`${BOLD}${YELLOW}For Date picker component (HazoCollabFormDate):${RESET}`);
  log('');
  log(`  ${CYAN}npx shadcn@latest add calendar${RESET}`);
  log('');
  log(`${DIM}Or install all at once:${RESET}`);
  log('');
  log(`  ${CYAN}npx shadcn@latest add button label dialog tooltip popover command calendar${RESET}`);
  log('');
  log(`${DIM}Run verification: ${CYAN}npx hazo-collab-forms-verify${RESET}`);
  log('');
}

main();
