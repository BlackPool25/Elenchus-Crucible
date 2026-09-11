#!/usr/bin/env node

/**
 * Elenchus & Crucible Installer
 *
 * Installs Elenchus (Socratic Problem Discovery & Idea Refutation) and
 * Crucible (Architectural Stress-Testing & Pre-Build Engine)
 * commands and skills into OpenCode (~/.config/opencode/).
 *
 * Configures:
 *   - OpenCode commands: /elenchus, /crucible
 *   - OpenCode skills: elenchus, crucible
 *   - Context7 MCP (local docs lookup via @upstash/context7-mcp)
 *   - SearXNG MCP (academic and deep tech search)
 *   - oh-my-openagent (Sisyphus / multi-agent orchestration)
 *   - Python research toolchain (arxiv, pymupdf for paper extraction)
 *
 * GitHub: https://github.com/BlackPool25/Elenchus-Crucible
 *
 * Usage:
 *   npx elenchus-crucible              Interactive install
 *   npx elenchus-crucible --help       Show help
 *   npx elenchus-crucible --yes        Auto-install with defaults
 *   npx elenchus-crucible --version    Show version
 *   npx elenchus-crucible --check      Verify install health
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawnSync } from 'node:child_process';
import {
  intro,
  outro,
  text,
  select,
  confirm,
  spinner as createSpinner,
  isCancel,
  cancel,
  log,
} from '@clack/prompts';
import pc from 'picocolors';
import boxen from 'boxen';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PKG_DIR = path.resolve(__dirname, '..');
const COMMANDS_DIR = path.join(PKG_DIR, 'commands');
const SKILLS_DIR = path.join(PKG_DIR, 'skills');
const SCRIPTS_DIR = path.join(PKG_DIR, 'scripts');

const OPENCODE_CONFIG_DIR = path.join(
  process.env.HOME || process.env.USERPROFILE,
  '.config',
  'opencode',
);
const OPENCODE_COMMAND_DIR = path.join(OPENCODE_CONFIG_DIR, 'command');
const OPENCODE_SKILLS_DIR = path.join(OPENCODE_CONFIG_DIR, 'skills');
const OPENCODE_CONFIG_PATH = path.join(OPENCODE_CONFIG_DIR, 'opencode.json');
const OPENCODE_CONFIGC_PATH = path.join(OPENCODE_CONFIG_DIR, 'opencode.jsonc');
const CRUCIBLE_CONFIG_PATH = path.join(OPENCODE_CONFIG_DIR, 'crucible.json');

const COMMANDS = ['elenchus.md', 'crucible.md'];

const SKILLS = ['elenchus', 'crucible'];



const PKG_VERSION = JSON.parse(
  fs.readFileSync(path.join(PKG_DIR, 'package.json'), 'utf-8'),
).version;

// ─── JSONC Helpers ───

/**
 * Robust JSONC parser with full state machine support.
 * Handles // line comments (even with apostrophes), /* block comments *\,
 * string literals with URLs, escaped quotes, and trailing commas.
 */
function parseJSONC(text) {
  let inString = false;
  let inLineComment = false;
  let inBlockComment = false;
  let isEscaped = false;
  let out = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inLineComment) {
      if (char === '\n') {
        inLineComment = false;
        out += char;
      }
      continue;
    }

    if (inBlockComment) {
      if (char === '*' && nextChar === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if (inString) {
      out += char;
      if (isEscaped) {
        isEscaped = false;
      } else if (char === '\\') {
        isEscaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      out += char;
      continue;
    }

    if (char === '/' && nextChar === '/') {
      inLineComment = true;
      i++;
      continue;
    }

    if (char === '/' && nextChar === '*') {
      inBlockComment = true;
      i++;
      continue;
    }

    out += char;
  }

  // Strip trailing commas before closing braces/brackets
  out = out.replace(/,(\s*[}\]])/g, '$1');
  return JSON.parse(out);
}

function readOpenCodeConfigSafe() {
  const configPath = fs.existsSync(OPENCODE_CONFIG_PATH)
    ? OPENCODE_CONFIG_PATH
    : fs.existsSync(OPENCODE_CONFIGC_PATH)
      ? OPENCODE_CONFIGC_PATH
      : null;
  if (!configPath) return { path: null, data: null, isJSONC: false };
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const isJSONC = configPath.endsWith('.jsonc');
    const data = isJSONC ? parseJSONC(raw) : JSON.parse(raw);
    return { path: configPath, data, isJSONC };
  } catch (err) {
    log.warn(`Could not parse OpenCode config at ${configPath}: ${err.message}`);
    return { path: configPath, data: null, isJSONC: configPath.endsWith('.jsonc') };
  }
}

/**
 * Write config data back to file. If the file is .jsonc, warn about
 * comment loss but still write (OpenCode accepts both formats).
 */
function writeOpenCodeConfigSafe(configPath, data, isJSONC) {
  const output = JSON.stringify(data, null, 2) + '\n';
  if (isJSONC) {
    log.warn(
      `Writing to ${path.basename(configPath)} (JSONC format) — comments in the original file will be lost. ` +
        'This is safe; OpenCode reads both .json and .jsonc.',
    );
  }
  fs.writeFileSync(configPath, output);
}

// ─── Utilities ───

function printVersion() {
  console.log(`elenchus-crucible v${PKG_VERSION}`);
  process.exit(0);
}

function printHelp() {
  const help = boxen(
    [
      `${pc.bold('Usage:')}`,
      `  npx elenchus-crucible           ${pc.dim('Interactive install')}`,
      `  npx elenchus-crucible --yes     ${pc.dim('Auto-install with defaults')}`,
      `  npx elenchus-crucible --help    ${pc.dim('Show this help')}`,
      `  npx elenchus-crucible --version ${pc.dim('Show version')}`,
      `  npx elenchus-crucible --check   ${pc.dim('Verify install health')}`,
      '',
      `${pc.bold('What this does:')}`,
      `  1. Verifies OpenCode is installed (prompts to install if missing)`,
      `  2. Configures Context7 MCP (local docs lookup via @upstash/context7-mcp)`,
      `  3. Configures SearXNG MCP (academic and deep tech search)`,
      `  4. Ensures oh-my-openagent is installed (asks first if any install exists — never overwrites a beta with stable; --yes keeps existing untouched)`,
      `  5. Verifies Python 3 research tools (arxiv, pymupdf for paper extraction)`,
      `  6. Copies commands to ~/.config/opencode/command/ (/elenchus, /crucible)`,
      `  7. Installs skills and references to ~/.config/opencode/skills/`,
      `  8. Configures research workspace directory (~/.config/opencode/crucible.json)`,
      '',
      `${pc.bold('After install:')}`,
      `  In OpenCode run:`,
      `    ${pc.cyan('/elenchus')} <idea>  ${pc.dim('— Socratic problem discovery & idea refutation')}`,
      `    ${pc.cyan('/crucible')} <spec>  ${pc.dim('— Architectural stress-testing & pre-build engine')}`,
      `  Or extract academic papers:`,
      `    ${pc.cyan('download-paper')} <arxiv-id>  ${pc.dim('— Download & convert arXiv paper to Markdown')}`,
    ].join('\n'),
    {
      padding: { top: 0, bottom: 0, left: 2, right: 2 },
      margin: 1,
      borderStyle: 'round',
      borderColor: 'magenta',
    },
  );
  console.log(help);
  process.exit(0);
}

function isOpenCodeInstalled() {
  if (fs.existsSync(OPENCODE_COMMAND_DIR) || fs.existsSync(OPENCODE_CONFIG_DIR)) return true;
  try {
    execSync('command -v opencode 2>/dev/null', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function isContext7Configured(config) {
  if (!config?.mcp) return false;
  return Object.keys(config.mcp).some(
    (key) =>
      key.toLowerCase().includes('context7') ||
      key.toLowerCase().includes('ctx7'),
  );
}

function isSearXNGConfigured(config) {
  if (!config?.mcp) return false;
  return Object.keys(config.mcp).some(
    (key) =>
      key.toLowerCase().includes('searxng') ||
      key.toLowerCase().includes('searx'),
  );
}

function pluginEntryText(p) {
  if (typeof p === 'string') return p;
  if (Array.isArray(p)) return p.filter((x) => typeof x === 'string').join(' ');
  return '';
}

function isOmoPluginEntry(p) {
  const t = pluginEntryText(p).toLowerCase();
  if (!t) return false;
  return (
    t.includes('oh-my-openagent') ||
    t.includes('oh-my-opencode') ||
    t.includes('oh-my-ohmy') ||
    /(^|[^a-z])omo([^a-z]|$)/.test(t)
  );
}

function isOhMyOpenAgentInstalled(config) {
  if (!config?.plugin) return false;
  return config.plugin.some(isOmoPluginEntry);
}

/**
 * Detect an existing oh-my-openagent/omo install of ANY channel.
 * Returns { found, entry, channel, binaryVersion } where channel is
 * 'beta' | 'stable' | 'unknown'. Never returns a default that implies
 * a fresh install — callers must ask before touching an existing setup.
 */
function detectOmoInstall(config) {
  let entry = null;
  if (config?.plugin) {
    entry = config.plugin.find(isOmoPluginEntry) ?? null;
  }
  let binaryVersion = null;
  try {
    const probed = spawnSync('omo', ['--version'], {
      encoding: 'utf-8',
      timeout: 10000,
      stdio: 'pipe',
    });
    if (probed.status === 0 && probed.stdout) binaryVersion = probed.stdout.trim();
  } catch {
    binaryVersion = null;
  }
  if (!entry && !binaryVersion) {
    return { found: false, entry: null, channel: 'unknown', binaryVersion: null };
  }
  const haystack = `${entry ? pluginEntryText(entry) : ''} ${binaryVersion || ''}`.toLowerCase();
  const channel = haystack.includes('beta') ? 'beta' : entry ? 'stable' : 'unknown';
  return { found: true, entry, channel, binaryVersion };
}

function checkPythonTools() {
  try {
    const pyVersion = execSync('python3 --version 2>/dev/null', {
      encoding: 'utf-8',
    }).trim();
    const checkImport = spawnSync('python3', ['-c', 'import arxiv, fitz; print("OK")'], {
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    const modulesAvailable = checkImport.status === 0 && checkImport.stdout.includes('OK');
    return {
      pythonFound: true,
      pythonVersion: pyVersion,
      modulesAvailable,
    };
  } catch {
    return {
      pythonFound: false,
      pythonVersion: null,
      modulesAvailable: false,
    };
  }
}

function isCrucibleConfigured() {
  return fs.existsSync(CRUCIBLE_CONFIG_PATH);
}

function readCrucibleConfig() {
  try {
    const raw = fs.readFileSync(CRUCIBLE_CONFIG_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Supply-chain safety confirmation before executing remote scripts.
 */
async function confirmRemoteScript({ what, source, command }, autoYes) {
  const warning = boxen(
    [
      `${pc.yellow('⚠')}  About to install ${pc.bold(what)}`,
      '',
      `${pc.dim('Source:')}  ${pc.cyan(source)}`,
      `${pc.dim('Command:')} ${pc.dim(command.slice(0, 120) + (command.length > 120 ? '...' : ''))}`,
      '',
      `${pc.yellow('This will download and execute a script from the internet.')}`,
      `${pc.dim('Review the source URL before proceeding.')}`,
    ].join('\n'),
    {
      padding: { top: 0, bottom: 0, left: 2, right: 2 },
      margin: { top: 0, bottom: 1 },
      borderStyle: 'round',
      borderColor: 'yellow',
    },
  );
  console.log(warning);

  if (autoYes) return true;

  const ok = await confirm({
    message: `Install ${what}?`,
    initialValue: true,
  });
  if (isCancel(ok)) {
    cancel('Installation cancelled');
    process.exit(0);
  }
  return ok;
}

// ─── Steps ───

async function installOpenCode(autoYes) {
  const approved = await confirmRemoteScript(
    {
      what: 'OpenCode',
      source: 'https://opencode.ai/install',
      command: 'curl -fsSL https://opencode.ai/install | bash',
    },
    autoYes,
  );
  if (!approved) {
    log.warn('OpenCode install skipped. Install manually:');
    log.info(`  ${pc.cyan('curl -fsSL https://opencode.ai/install | bash')}`);
    return false;
  }

  log.info('Installing OpenCode...');
  const s = createSpinner();
  s.start('Downloading OpenCode...');
  try {
    execSync('curl -fsSL https://opencode.ai/install | bash', {
      stdio: 'inherit',
      timeout: 120000,
      maxBuffer: 10 * 1024 * 1024,
    });
    s.stop('OpenCode installed successfully');
    return true;
  } catch (err) {
    s.stop('OpenCode install failed');
    log.error(`Could not install OpenCode: ${err.message}`);
    log.info('Install manually:');
    log.info(`  ${pc.cyan('curl -fsSL https://opencode.ai/install | bash')}`);
    return false;
  }
}

async function setupContext7MCP(configInfo, autoYes = false) {
  const { path: configPath, data: config, isJSONC } = configInfo;

  if (!configPath || !config) {
    log.warn('OpenCode config file not found — cannot auto-configure Context7 MCP.');
    log.info('Add it manually to opencode.json under the "mcp" key:');
    log.info(`  ${pc.dim('See: https://context7.com/docs/clients/opencode')}`);
    return false;
  }

  if (isContext7Configured(config)) {
    const ctxKey = Object.keys(config.mcp).find(
      (k) =>
        k.toLowerCase().includes('context7') || k.toLowerCase().includes('ctx7'),
    );
    log.success(`Context7 MCP already configured as "${pc.cyan(ctxKey)}"`);
    return true;
  }

  let shouldSetup = autoYes;
  if (!autoYes) {
    shouldSetup = await confirm({
      message:
        'Context7 MCP not configured. Crucible uses it for live documentation lookup. Set it up now?',
      initialValue: true,
    });
    if (isCancel(shouldSetup)) {
      cancel('Installation cancelled');
      process.exit(0);
    }
  }
  if (!shouldSetup) {
    log.info('Skipping Context7 setup.');
    return false;
  }

  const s = createSpinner();
  s.start('Configuring Context7 MCP (local mode)...');
  try {
    if (!config.mcp) config.mcp = {};
    // Current Context7 format for OpenCode (2026): local stdio via the
    // @upstash/context7-mcp package. API key is optional — without one the
    // server works with default rate limits; export CONTEXT7_API_KEY for more.
    config.mcp.context7 = {
      type: 'local',
      command: ['npx', '-y', '@upstash/context7-mcp'],
      enabled: true,
    };
    writeOpenCodeConfigSafe(configPath, config, isJSONC);
    s.stop('Context7 MCP configured (local mode)');
    log.success('Context7 documentation MCP is now enabled in OpenCode');
    return true;
  } catch (err) {
    s.stop('Failed to configure Context7');
    log.error(`Could not configure Context7: ${err.message}`);
    return false;
  }
}

async function setupSearXNGMCP(configInfo, autoYes) {
  const { path: configPath, data: config, isJSONC } = configInfo;

  if (!configPath || !config) return false;

  if (isSearXNGConfigured(config)) {
    const searxKey = Object.keys(config.mcp).find(
      (k) =>
        k.toLowerCase().includes('searxng') || k.toLowerCase().includes('searx'),
    );
    log.success(`SearXNG MCP already configured as "${pc.cyan(searxKey)}"`);
    return true;
  }

  let shouldSetup = autoYes;
  if (!autoYes) {
    shouldSetup = await confirm({
      message:
        'SearXNG MCP not detected. Crucible uses it for academic and technical searches. Configure local SearXNG MCP?',
      initialValue: true,
    });
    if (isCancel(shouldSetup)) {
      cancel('Installation cancelled');
      process.exit(0);
    }
  }

  if (!shouldSetup) {
    log.info('Skipping SearXNG setup. You can add it later to opencode.json.');
    return false;
  }

  let url = 'http://localhost:8080';
  if (!autoYes) {
    const inputUrl = await text({
      message: 'SearXNG instance URL:',
      placeholder: 'http://localhost:8080',
      initialValue: 'http://localhost:8080',
    });
    if (isCancel(inputUrl)) return false;
    url = inputUrl.trim() || 'http://localhost:8080';
  }

  const s = createSpinner();
  s.start('Configuring SearXNG MCP...');
  try {
    if (!config.mcp) config.mcp = {};
    config.mcp.searxng = {
      type: 'remote',
      url: url,
      enabled: true,
    };
    writeOpenCodeConfigSafe(configPath, config, isJSONC);
    s.stop(`SearXNG MCP configured for ${pc.cyan(url)}`);
    return true;
  } catch (err) {
    s.stop('Failed to configure SearXNG MCP');
    log.warn(`Could not save SearXNG config: ${err.message}`);
    return false;
  }
}

async function ensureOhMyOpenAgent(configInfo, autoYes) {
  const { path: configPath, data: config, isJSONC } = configInfo;
  const detected = detectOmoInstall(config);

  // Ask-first: never force-install over an existing setup of ANY channel.
  if (detected.found) {
    const where = [];
    if (detected.entry) where.push(`plugin entry "${pluginEntryText(detected.entry)}"`);
    if (detected.binaryVersion) where.push(`omo binary (${detected.binaryVersion})`);
    if (autoYes) {
      log.success(`oh-my-openagent already installed (${where.join(' + ')}, channel: ${detected.channel}) — keeping existing install untouched`);
      return true;
    }
    const choice = await select({
      message: `oh-my-openagent already installed (${where.join(' + ')}, channel: ${detected.channel}). What should the installer do?`,
      options: [
        { value: 'keep', label: 'Keep existing install (recommended)' },
        { value: 'stable', label: 'Reinstall stable channel (oh-my-openagent@latest)' },
        { value: 'beta', label: 'Install beta channel (oh-my-openagent@beta)' },
        { value: 'skip', label: 'Skip oh-my-openagent setup' },
      ],
    });
    if (isCancel(choice)) {
      cancel('Installation cancelled');
      process.exit(0);
    }
    if (choice === 'keep' || choice === 'skip') {
      log.info('Keeping existing oh-my-openagent install untouched.');
      return true;
    }
    return runOmoInstaller(choice, configPath);
  }

  let shouldInstall = autoYes;
  if (!autoYes) {
    shouldInstall = await confirm({
      message:
        'Oh-My-OpenAgent not found. It provides the Sisyphus multi-agent orchestration engine used by Crucible. Install it now?',
      initialValue: true,
    });
    if (isCancel(shouldInstall)) {
      cancel('Installation cancelled');
      process.exit(0);
    }
  }

  if (!shouldInstall) {
    log.warn('oh-my-openagent is strongly recommended for Elenchus & Crucible.');
    log.info('Install manually:');
    log.info(`  ${pc.cyan('npx oh-my-openagent@latest install')}`);
    return false;
  }

  return runOmoInstaller('stable', configPath);
}

/**
 * Run the oh-my-openagent installer for the chosen channel.
 * channel is 'stable' (oh-my-openagent@latest) or 'beta' (oh-my-openagent@beta).
 */
async function runOmoInstaller(channel, configPath) {
  const tag = channel === 'beta' ? 'oh-my-openagent@beta' : 'oh-my-openagent@latest';
  const sp = createSpinner();
  sp.start(`Running oh-my-openagent installer (${channel} channel)...`);
  try {
    // Keep literals (test pins flags via string match).
    if (channel === 'beta') {
      execSync(
        'npx -y oh-my-openagent@beta install --no-tui --platform=opencode --claude=no --openai=no --gemini=no --copilot=no --skip-auth',
        {
          stdio: 'inherit',
          timeout: 180000,
          maxBuffer: 10 * 1024 * 1024,
        },
      );
    } else {
      execSync(
        'npx -y oh-my-openagent@latest install --no-tui --platform=opencode --claude=no --openai=no --gemini=no --copilot=no --skip-auth',
        {
          stdio: 'inherit',
          timeout: 180000,
          maxBuffer: 10 * 1024 * 1024,
        },
      );
    }
    sp.stop(`oh-my-openagent installed (${channel} channel)`);

    const refreshed = readOpenCodeConfigSafe();
    if (refreshed.data && !isOhMyOpenAgentInstalled(refreshed.data)) {
      if (!refreshed.data.plugin) refreshed.data.plugin = [];
      if (!refreshed.data.plugin.includes('oh-my-openagent')) {
        refreshed.data.plugin.push('oh-my-openagent');
        writeOpenCodeConfigSafe(refreshed.path, refreshed.data, refreshed.isJSONC);
      }
    }
    log.success('oh-my-openagent is now installed and configured');
    return true;
  } catch (err) {
    sp.stop('oh-my-openagent install failed');
    log.warn('Could not complete non-interactive oh-my-openagent installation.');
    log.info('Run it manually in an interactive terminal:');
    log.info(`  ${pc.cyan(`npx ${tag} install`)}`);
    return false;
  }
}

async function ensurePythonTools(autoYes) {
  const status = checkPythonTools();
  if (status.modulesAvailable) {
    log.success(`Python research tools verified (${pc.cyan(status.pythonVersion)}, arxiv, pymupdf)`);
    return true;
  }

  if (!status.pythonFound) {
    log.warn('python3 not found. Academic paper extraction (/download-paper) requires Python 3.');
    return false;
  }

  log.warn("Python modules 'arxiv' or 'pymupdf' are missing.");
  let shouldInstall = autoYes;
  if (!autoYes) {
    shouldInstall = await confirm({
      message: 'Install arxiv and pymupdf Python packages for academic paper research?',
      initialValue: true,
    });
    if (isCancel(shouldInstall)) return false;
  }

  if (!shouldInstall) {
    log.info('Skipping Python module installation. Install manually: uv pip install arxiv pymupdf');
    return false;
  }

  const s = createSpinner();
  s.start('Installing arxiv and pymupdf...');
  try {
    const hasUv = spawnSync('command -v uv 2>/dev/null', { shell: true }).status === 0;
    if (hasUv) {
      execSync('uv pip install --system arxiv pymupdf', { stdio: 'pipe' });
    } else {
      execSync('python3 -m pip install arxiv pymupdf', { stdio: 'pipe' });
    }
    s.stop('Python research tools installed successfully');
    return true;
  } catch (err) {
    s.stop('Failed to install Python packages automatically');
    log.info(`Install manually: ${pc.cyan('pip install arxiv pymupdf')}`);
    return false;
  }
}

async function copyCommandFiles(forceOverwrite) {
  const s = createSpinner();

  if (!fs.existsSync(OPENCODE_COMMAND_DIR)) {
    fs.mkdirSync(OPENCODE_COMMAND_DIR, { recursive: true });
  }

  let existing = [];
  try {
    existing = fs
      .readdirSync(OPENCODE_COMMAND_DIR)
      .filter((f) => COMMANDS.includes(f));
  } catch {
    existing = [];
  }

  if (existing.length > 0 && !forceOverwrite) {
    log.info(`Found existing command(s): ${existing.join(', ')}`);
    const shouldOverwrite = await confirm({
      message: 'Overwrite existing commands?',
      initialValue: true,
    });
    if (isCancel(shouldOverwrite)) {
      cancel('Installation cancelled');
      process.exit(0);
    }
    if (!shouldOverwrite) {
      log.info('Existing commands preserved. Skipping command install.');
      return 0;
    }
  }

  s.start('Installing command files...');
  let copied = 0;
  let failed = 0;

  for (const cmd of COMMANDS) {
    const src = path.join(COMMANDS_DIR, cmd);
    const dest = path.join(OPENCODE_COMMAND_DIR, cmd);

    if (!fs.existsSync(src)) {
      log.warn(`Source not found: ${cmd}`);
      failed++;
      continue;
    }

    try {
      fs.copyFileSync(src, dest);
      fs.chmodSync(dest, 0o644);
      copied++;
    } catch (err) {
      log.error(`Failed to install ${cmd}: ${err.message}`);
      failed++;
    }
  }

  s.stop(
    `Installed ${copied}/${COMMANDS.length} command(s)${failed > 0 ? ` (${failed} failed)` : ''}`,
  );
  return copied;
}

async function installSkills(forceOverwrite) {
  const s = createSpinner();

  if (!fs.existsSync(OPENCODE_SKILLS_DIR)) {
    fs.mkdirSync(OPENCODE_SKILLS_DIR, { recursive: true });
  }

  s.start('Installing skills and references...');
  let installed = 0;

  for (const skill of SKILLS) {
    const srcDir = path.join(SKILLS_DIR, skill);
    const destDir = path.join(OPENCODE_SKILLS_DIR, skill);

    if (!fs.existsSync(srcDir)) {
      log.warn(`Skill source not found: ${skill}`);
      continue;
    }

    try {
      if (fs.existsSync(destDir) && forceOverwrite) {
        fs.rmSync(destDir, { recursive: true, force: true });
      }
      fs.cpSync(srcDir, destDir, { recursive: true });
      installed++;
    } catch (err) {
      log.error(`Failed to install skill ${skill}: ${err.message}`);
    }
  }

  // Clean up any legacy or short aliases if present
  const legacyAliases = [
    'discovering-before-building',
    'planning-before-building',
    'prebuild-discovery',
    'prebuild-planning',
    'prebuild-discover',
    'prebuild-plan',
    'prebuild-architecture',
  ];
  for (const alias of legacyAliases) {
    const p = path.join(OPENCODE_SKILLS_DIR, alias);
    if (fs.existsSync(p)) {
      try {
        fs.rmSync(p, { recursive: true, force: true });
      } catch {}
    }
  }

  s.stop(`Installed ${installed}/${SKILLS.length} skill(s) (elenchus, crucible)`);
  return installed;
}

async function configureWorkspaceDir() {
  const shouldConfigure = await confirm({
    message:
      'Configure default research workspace directory? (Holds spikes, matrices, and papers)',
    initialValue: true,
  });
  if (isCancel(shouldConfigure)) {
    cancel('Configuration cancelled');
    process.exit(0);
  }
  if (!shouldConfigure) return null;

  const defaultDir = path.join(
    process.env.HOME || process.env.USERPROFILE,
    'Research',
  );

  const dirInput = await text({
    message: 'Where should research spikes and dossiers live?',
    placeholder: defaultDir,
    initialValue: defaultDir,
    validate: (value) => {
      if (!value || value.trim().length === 0) return 'Path is required';
      return undefined;
    },
  });
  if (isCancel(dirInput)) {
    cancel('Configuration cancelled');
    process.exit(0);
  }

  const workspaceDir = dirInput.trim() || defaultDir;
  const config = {
    workspaceDirectory: workspaceDir,
    setupDate: new Date().toISOString().slice(0, 10),
    version: PKG_VERSION,
    modules: ['elenchus', 'crucible'],
  };

  const s = createSpinner();
  s.start('Creating research workspace...');
  try {
    fs.mkdirSync(workspaceDir, { recursive: true });
    fs.mkdirSync(path.join(workspaceDir, '.crucible'), { recursive: true });
    fs.writeFileSync(CRUCIBLE_CONFIG_PATH, JSON.stringify(config, null, 2));
    s.stop(`Research workspace configured at ${pc.cyan(workspaceDir)}`);
    return workspaceDir;
  } catch (err) {
    s.stop('Failed to configure research workspace');
    log.error(`Could not create directory: ${err.message}`);
    return null;
  }
}

// ─── Health Check ───

async function runHealthCheck() {
  intro(pc.inverse(' Elenchus & Crucible Health Check '));

  const configInfo = readOpenCodeConfigSafe();
  const checks = [];

  // 1. OpenCode
  if (isOpenCodeInstalled()) {
    checks.push(`${pc.green('✓')} OpenCode installed`);
  } else {
    checks.push(`${pc.red('✗')} OpenCode not installed`);
    checks.push(`  ${pc.dim('Run: npx elenchus-crucible to install')}`);
  }

  // 2. Commands
  let cmdCount = 0;
  for (const cmd of COMMANDS) {
    if (fs.existsSync(path.join(OPENCODE_COMMAND_DIR, cmd))) cmdCount++;
  }
  if (cmdCount === COMMANDS.length) {
    checks.push(`${pc.green('✓')} All ${COMMANDS.length} commands installed in ${pc.cyan('~/.config/opencode/command/')}`);
  } else {
    checks.push(`${pc.yellow('⚠')} ${cmdCount}/${COMMANDS.length} commands installed`);
  }

  // 3. Skills
  let skillCount = 0;
  for (const skill of SKILLS) {
    const p = path.join(OPENCODE_SKILLS_DIR, skill, 'SKILL.md');
    if (fs.existsSync(p)) skillCount++;
  }
  if (skillCount === SKILLS.length) {
    checks.push(`${pc.green('✓')} All skills installed in ${pc.cyan('~/.config/opencode/skills/')}`);
  } else {
    checks.push(`${pc.yellow('⚠')} ${skillCount}/${SKILLS.length} skills found`);
  }

  // 4. Context7 MCP
  if (configInfo.data && isContext7Configured(configInfo.data)) {
    const ctxKey = Object.keys(configInfo.data.mcp).find(
      (k) => k.toLowerCase().includes('context7') || k.toLowerCase().includes('ctx7'),
    );
    checks.push(`${pc.green('✓')} Context7 MCP configured (${pc.cyan(ctxKey)})`);
  } else {
    checks.push(`${pc.yellow('⚠')} Context7 MCP not configured`);
  }

  // 5. SearXNG MCP
  if (configInfo.data && isSearXNGConfigured(configInfo.data)) {
    checks.push(`${pc.green('✓')} SearXNG MCP configured`);
  } else {
    checks.push(`${pc.dim('ℹ')} SearXNG MCP optional (not configured)`);
  }

  // 6. oh-my-openagent
  if (configInfo.data && isOhMyOpenAgentInstalled(configInfo.data)) {
    checks.push(`${pc.green('✓')} oh-my-openagent plugin registered`);
  } else {
    checks.push(`${pc.yellow('⚠')} oh-my-openagent not registered`);
  }

  // 7. Python Research Tools
  const py = checkPythonTools();
  if (py.modulesAvailable) {
    checks.push(`${pc.green('✓')} Python research tools ready (${pc.cyan(py.pythonVersion)}, arxiv, pymupdf)`);
  } else if (py.pythonFound) {
    checks.push(`${pc.yellow('⚠')} Python 3 found, but 'arxiv' or 'pymupdf' not installed`);
    checks.push(`  ${pc.dim('Run: uv pip install arxiv pymupdf')}`);
  } else {
    checks.push(`${pc.yellow('⚠')} Python 3 not found (needed for /download-paper)`);
  }

  // 8. Research Workspace
  if (isCrucibleConfigured()) {
    const cfg = readCrucibleConfig();
    checks.push(`${pc.green('✓')} Research workspace: ${pc.cyan(cfg?.workspaceDirectory || 'configured')}`);
  } else {
    checks.push(`${pc.dim('ℹ')} Workspace directory not explicitly set`);
  }

  const report = checks.join('\n');
  console.log(
    boxen(report, {
      padding: { top: 0, bottom: 0, left: 2, right: 2 },
      margin: { top: 0, bottom: 1 },
      borderStyle: 'round',
    }),
  );

  const failCount = checks.filter((c) => c.startsWith(pc.red('✗'))).length;
  if (failCount === 0) {
    outro(pc.green('Elenchus & Crucible environment verified!'));
  } else {
    outro(pc.red(`${failCount} issue(s) found. Run npx elenchus-crucible to resolve.`));
  }
  process.exit(0);
}

// ─── Main Install ───

async function install(autoYes = false) {
  intro(
    boxen(' Elenchus & Crucible — Pre-Build Engine ', {
      padding: { top: 1, bottom: 1, left: 0, right: 0 },
      margin: { top: 0, bottom: 1 },
      borderStyle: 'double',
      borderColor: 'magenta',
      textAlignment: 'center',
    }),
  );

  // ── Step 1: OpenCode ──
  log.step('1/8  Checking OpenCode');
  const opencodeFound = isOpenCodeInstalled();
  if (!opencodeFound) {
    log.warn('OpenCode is not installed on this system.');
    if (!autoYes) {
      const shouldInstall = await confirm({
        message: 'OpenCode is required. Install it now?',
        initialValue: true,
      });
      if (isCancel(shouldInstall) || !shouldInstall) {
        log.error('OpenCode is required.');
        process.exit(1);
      }
    }
    const ok = await installOpenCode(autoYes);
    if (!ok) process.exit(1);
  } else {
    log.success(`OpenCode found at ${pc.cyan(OPENCODE_CONFIG_DIR)}`);
  }

  // ── Step 2: Context7 MCP ──
  log.step('2/8  Configuring Context7 MCP (documentation lookups)');
  const configInfo = readOpenCodeConfigSafe();
  await setupContext7MCP(configInfo, autoYes);

  // ── Step 3: SearXNG MCP ──
  log.step('3/8  Configuring SearXNG MCP (academic & deep search)');
  const refreshedForSearx = readOpenCodeConfigSafe();
  await setupSearXNGMCP(refreshedForSearx, autoYes);

  // ── Step 4: oh-my-openagent ──
  log.step('4/8  Checking oh-my-openagent (Sisyphus multi-agent orchestration)');
  const refreshedForOmo = readOpenCodeConfigSafe();
  await ensureOhMyOpenAgent(refreshedForOmo, autoYes);

  // ── Step 5: Python research tools ──
  log.step('5/8  Checking Python academic tools (arxiv, pymupdf)');
  await ensurePythonTools(autoYes);

  // ── Step 6: Commands ──
  log.step('6/8  Installing OpenCode commands (/elenchus, /crucible)');
  await copyCommandFiles(autoYes);

  // ── Step 7: Skills ──
  log.step('7/8  Installing skills and references');
  await installSkills(autoYes);

  // ── Step 8: Workspace ──
  log.step('8/8  Research workspace');
  if (!isCrucibleConfigured() && !autoYes) {
    await configureWorkspaceDir();
  } else if (isCrucibleConfigured()) {
    const cfg = readCrucibleConfig();
    log.success(`Workspace directory: ${pc.cyan(cfg?.workspaceDirectory || 'configured')}`);
  }

  // ── Outro ──
  const summary = [
    `${pc.green('✓')} Elenchus & Crucible are ready!`,
    '',
    `${pc.bold('Commands available in OpenCode:')}`,
    `  ${pc.cyan('/elenchus')} <idea>   ${pc.dim('— Socratic problem discovery & idea refutation')}`,
    `  ${pc.cyan('/crucible')} <spec>   ${pc.dim('— Architectural stress-testing & pre-build engine')}`,
    '',
    `${pc.bold('CLI utilities:')}`,
    `  ${pc.cyan('download-paper')} <id> ${pc.dim('— Download arXiv paper and convert to Markdown')}`,
    `  ${pc.cyan('download-paper --search')} <query> ${pc.dim('— Search arXiv literature')}`,
    '',
    `${pc.bold('Next steps:')}`,
    `  1. Launch OpenCode: ${pc.cyan('opencode')}`,
    `  2. Challenge an idea: ${pc.cyan('/elenchus I want to build a local vector search engine')}`,
  ].join('\n');

  outro(
    boxen(summary, {
      padding: { top: 0, bottom: 0, left: 2, right: 2 },
      margin: { top: 1, bottom: 0 },
      borderStyle: 'round',
      borderColor: 'green',
      title: 'Setup Complete',
      titleAlignment: 'center',
    }),
  );
}

// ─── CLI Dispatch ───

const args = process.argv.slice(2);

if (args.includes('--version') || args.includes('-v')) {
  printVersion();
} else if (args.includes('--help') || args.includes('-h')) {
  printHelp();
} else if (args.includes('--check') || args.includes('-c')) {
  runHealthCheck().catch((err) => {
    log.error(`Health check failed: ${err.message}`);
    process.exit(1);
  });
} else {
  const autoYes = args.includes('--yes') || args.includes('-y');
  install(autoYes).catch((err) => {
    log.error(`Installation failed: ${err.message}`);
    process.exit(1);
  });
}
