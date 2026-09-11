#!/usr/bin/env node
/**
 * Integration tests for elenchus-crucible install.js and research tooling.
 *
 * Tests in an isolated sandbox environment. Sets HOME to a temp directory
 * with mock OpenCode configs so real user configs are never touched.
 *
 * Usage:
 *   node test/test-install.mjs            # Run all tests
 *   node test/test-install.mjs --verbose  # Verbose output
 *   node test/test-install.mjs --name "CLI"  # Run only CLI tests
 */

import { strict as assert } from 'node:assert';
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_DIR = path.resolve(__dirname, '..');
const SANDBOX_DIR = '/tmp/elenchus-test';
const SANDBOX_HOME = path.join(SANDBOX_DIR, 'sandbox-home');

const PKG_DIR = path.join(REPO_DIR, 'packages/elenchus-crucible');
const INSTALL_JS = path.join(PKG_DIR, 'bin/install.js');
const DOWNLOAD_PAPER_JS = path.join(PKG_DIR, 'bin/download-paper.js');
const DOWNLOAD_PAPER_PY = path.join(PKG_DIR, 'scripts/download_paper.py');
const COMMANDS_DIR = path.join(PKG_DIR, 'commands');
const SKILLS_DIR = path.join(PKG_DIR, 'skills');

const verbose = process.argv.includes('--verbose');
const filter = process.argv.includes('--name')
  ? process.argv[process.argv.indexOf('--name') + 1]
  : null;

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  if (filter && !name.toLowerCase().includes(filter.toLowerCase())) return;
  try {
    fn();
    passed++;
    if (verbose) console.log(`  ✅ ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, err });
    console.error(`  ❌ ${name}`);
    if (verbose) console.error(`     ${err.message}`);
  }
}

function setupSandbox() {
  fs.rmSync(SANDBOX_DIR, { recursive: true, force: true });
  const mockConfigDir = path.join(SANDBOX_HOME, '.config/opencode');
  fs.mkdirSync(mockConfigDir, { recursive: true });

  const mockConfig = {
    model: 'opencode-go/muse-spark-1.3-contributor',
    plugin: ['oh-my-openagent@beta'],
    mcp: {
      context7: {
        type: 'remote',
        url: 'https://mcp.context7.com/mcp',
        enabled: true,
      },
      searxng: {
        type: 'remote',
        url: 'http://localhost:8080',
        enabled: true,
      },
    },
  };

  fs.writeFileSync(
    path.join(mockConfigDir, 'opencode.json'),
    JSON.stringify(mockConfig, null, 2),
  );
}

function sandboxExec(args, opts = {}) {
  const env = {
    ...process.env,
    HOME: SANDBOX_HOME,
    USERPROFILE: SANDBOX_HOME,
  };
  const result = spawnSync('node', [INSTALL_JS, ...args], {
    env: { ...env, ...(opts.env || {}) },
    cwd: opts.cwd || REPO_DIR,
    encoding: 'utf-8',
    timeout: 15000,
    stdio: 'pipe',
  });
  return {
    stdout: result.stdout?.trim() || '',
    stderr: result.stderr?.trim() || '',
    status: result.status,
    error: result.error,
  };
}

// Setup sandbox environment before tests
setupSandbox();

// ============================================================
// SUITE 1: CLI flag tests
// ============================================================
console.log('\n📋 CLI Flag Tests');

test('--help exits with code 0 and shows help text', () => {
  const r = sandboxExec(['--help']);
  assert.equal(r.status, 0, `exit code should be 0, got ${r.status}`);
  assert.ok(r.stdout.includes('Usage:'), 'should show Usage');
  assert.ok(r.stdout.includes('npx elenchus-crucible'), 'should show npx command');
  assert.ok(r.stdout.includes('/elenchus'), 'should mention /elenchus');
  assert.ok(r.stdout.includes('/crucible'), 'should mention /crucible');
});

test('--version exits with code 0 and shows version', () => {
  const r = sandboxExec(['--version']);
  assert.equal(r.status, 0);
  assert.ok(r.stdout.includes('elenchus-crucible v1.'), `should show version, got: ${r.stdout}`);
});

test('--check runs health check', () => {
  const r = sandboxExec(['--check']);
  assert.equal(r.status, 0);
  assert.ok(r.stdout.includes('Health Check'), 'should show health check header');
  assert.ok(r.stdout.includes('OpenCode'), 'should mention OpenCode');
});

test('unknown flag does not crash', () => {
  const r = sandboxExec(['--bogus-flag']);
  assert.ok(r.status === 0 || r.status === 1, `should exit cleanly, got ${r.status}`);
});

// ============================================================
// SUITE 2: Command & Skills files exist
// ============================================================
console.log('\n📋 Command & Skills Files Tests');

const EXPECTED_COMMANDS = ['elenchus.md', 'crucible.md'];

test('all 2 command files exist', () => {
  for (const cmd of EXPECTED_COMMANDS) {
    const p = path.join(COMMANDS_DIR, cmd);
    assert.ok(fs.existsSync(p), `missing command: ${cmd}`);
  }
});

test('each command file has description frontmatter', () => {
  for (const cmd of EXPECTED_COMMANDS) {
    const content = fs.readFileSync(path.join(COMMANDS_DIR, cmd), 'utf-8');
    assert.ok(content.includes('description:'), `${cmd} missing description frontmatter`);
    assert.ok(content.startsWith('---'), `${cmd} should start with ---`);
  }
});

test('skill files and references exist for elenchus and crucible', () => {
  assert.ok(fs.existsSync(path.join(SKILLS_DIR, 'elenchus/SKILL.md')), 'elenchus SKILL.md missing');
  assert.ok(fs.existsSync(path.join(SKILLS_DIR, 'crucible/SKILL.md')), 'crucible SKILL.md missing');

  const elenchusRefs = ['framing-templates.md', 'ideation-methods.md', 'memory-architecture.md'];
  for (const ref of elenchusRefs) {
    const refPath = path.join(SKILLS_DIR, 'elenchus/references', ref);
    assert.ok(fs.existsSync(refPath), `elenchus reference missing: ${ref}`);
  }

  const crucibleRefs = [
    'research-protocol.md',
    'stress-spike-protocol.md',
    'technical-feasibility-matrix.md',
    'tool-orchestration.md',
    'memory-architecture.md',
  ];
  for (const ref of crucibleRefs) {
    const refPath = path.join(SKILLS_DIR, 'crucible/references', ref);
    assert.ok(fs.existsSync(refPath), `crucible reference missing: ${ref}`);
  }
});

// ============================================================
// SUITE 3: JSONC parser tests
// ============================================================
console.log('\n📋 JSONC Parser Tests');

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

  out = out.replace(/,(\s*[}\]])/g, '$1');
  return JSON.parse(out);
}

test('parseJSONC strips // comments', () => {
  const result = parseJSONC('{"a": 1, // comment\n"b": 2}');
  assert.deepEqual(result, { a: 1, b: 2 });
});

test('parseJSONC handles comments with apostrophes and quotes', () => {
  const result = parseJSONC('{"a": 1, // here\'s a comment that doesn\'t fail\n"b": 2}');
  assert.deepEqual(result, { a: 1, b: 2 });
});

test('parseJSONC strips /* block comments */', () => {
  const result = parseJSONC('{"a": 1 /* block */, "b": 2}');
  assert.deepEqual(result, { a: 1, b: 2 });
});

test('parseJSONC handles trailing commas', () => {
  const result = parseJSONC('{"a": 1, "b": 2,}');
  assert.deepEqual(result, { a: 1, b: 2 });
});

test('parseJSONC does NOT strip URLs containing //', () => {
  const result = parseJSONC('{"url": "https://mcp.context7.com/mcp"}');
  assert.equal(result.url, 'https://mcp.context7.com/mcp');
});

// ============================================================
// SUITE 4: Sandbox Installation & Health Check
// ============================================================
console.log('\n📋 Sandbox Installation & Health Check');

test('sandbox installation with --yes installs commands and skills', () => {
  const r = sandboxExec(['--yes']);
  assert.equal(r.status, 0, `sandbox install failed with status ${r.status}: ${r.stderr}`);

  const destCommandElenchus = path.join(SANDBOX_HOME, '.config/opencode/command/elenchus.md');
  const destCommandCrucible = path.join(SANDBOX_HOME, '.config/opencode/command/crucible.md');
  assert.ok(fs.existsSync(destCommandElenchus), 'elenchus.md was not installed in sandbox');
  assert.ok(fs.existsSync(destCommandCrucible), 'crucible.md was not installed in sandbox');

  const destSkillElenchus = path.join(SANDBOX_HOME, '.config/opencode/skills/elenchus/SKILL.md');
  const destSkillCrucible = path.join(SANDBOX_HOME, '.config/opencode/skills/crucible/SKILL.md');
  assert.ok(fs.existsSync(destSkillElenchus), 'elenchus skill was not installed in sandbox');
  assert.ok(fs.existsSync(destSkillCrucible), 'crucible skill was not installed in sandbox');

  // Assert NO legacy or short aliases exist
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
    const aliasPath = path.join(SANDBOX_HOME, '.config/opencode/skills', alias);
    assert.ok(!fs.existsSync(aliasPath), `legacy alias should not exist: ${alias}`);
  }
});

test('installer removes pre-existing legacy aliases automatically', () => {
  const skillsDir = path.join(SANDBOX_HOME, '.config/opencode/skills');
  // Create dummy legacy alias symlinks/dirs
  fs.mkdirSync(path.join(skillsDir, 'discovering-before-building'), { recursive: true });
  fs.mkdirSync(path.join(skillsDir, 'planning-before-building'), { recursive: true });
  assert.ok(fs.existsSync(path.join(skillsDir, 'discovering-before-building')));

  // Run installer
  const r = sandboxExec(['--yes']);
  assert.equal(r.status, 0);

  // Verify they got cleaned up
  assert.ok(!fs.existsSync(path.join(skillsDir, 'discovering-before-building')), 'failed to clean up legacy alias');
  assert.ok(!fs.existsSync(path.join(skillsDir, 'planning-before-building')), 'failed to clean up legacy alias');
  assert.ok(fs.existsSync(path.join(skillsDir, 'elenchus/SKILL.md')));
  assert.ok(fs.existsSync(path.join(skillsDir, 'crucible/SKILL.md')));
});

test('--check detects all installed components in sandbox', () => {
  const r = sandboxExec(['--check']);
  assert.equal(r.status, 0);
  assert.ok(r.stdout.includes('All 2 commands installed'), 'should verify commands installed');
  assert.ok(r.stdout.includes('All skills installed'), 'should verify skills installed');
});

// ============================================================
// SUITE 5: Package.json validation
// ============================================================
console.log('\n📋 Package Validation Tests');

test('package.json has all required fields', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(PKG_DIR, 'package.json'), 'utf-8'));
  assert.ok(pkg.name, 'missing name');
  assert.ok(pkg.version, 'missing version');
  assert.ok(pkg.description, 'missing description');
  assert.ok(pkg.bin, 'missing bin entry');
  assert.ok(pkg.files, 'missing files array');
  assert.ok(pkg.repository, 'missing repository');
  assert.ok(pkg.license, 'missing license');
  assert.equal(pkg.author, 'BlackPool25', 'author should be BlackPool25');
});

test('package.json bin entries point to existing executable files', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(PKG_DIR, 'package.json'), 'utf-8'));
  for (const [name, binPath] of Object.entries(pkg.bin)) {
    const fullPath = path.join(PKG_DIR, binPath);
    assert.ok(fs.existsSync(fullPath), `bin entry "${name}" points to missing file: ${binPath}`);
  }
});

test('package.json files array covers bin, commands, skills, scripts', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(PKG_DIR, 'package.json'), 'utf-8'));
  assert.ok(pkg.files.includes('bin/'), 'bin/ must be in files');
  assert.ok(pkg.files.includes('commands/'), 'commands/ must be in files');
  assert.ok(pkg.files.includes('skills/'), 'skills/ must be in files');
  assert.ok(pkg.files.includes('scripts/'), 'scripts/ must be in files');
});

// ============================================================
// SUITE 6: Scripts & Syntax Validation
// ============================================================
console.log('\n📋 Script Syntax & Execution Tests');

test('install.js has valid Node.js syntax', () => {
  const r = spawnSync('node', ['--check', INSTALL_JS], { encoding: 'utf-8' });
  assert.equal(r.status, 0, `syntax error: ${r.stderr}`);
});

test('download-paper.js has valid Node.js syntax', () => {
  const r = spawnSync('node', ['--check', DOWNLOAD_PAPER_JS], { encoding: 'utf-8' });
  assert.equal(r.status, 0, `syntax error: ${r.stderr}`);
});

test('download_paper.py has valid Python syntax', () => {
  const r = spawnSync('python3', ['-m', 'py_compile', DOWNLOAD_PAPER_PY], { encoding: 'utf-8' });
  assert.equal(r.status, 0, `python syntax error: ${r.stderr}`);
});

test('download_paper.py --help executes successfully', () => {
  const r = spawnSync('python3', [DOWNLOAD_PAPER_PY, '--help'], { encoding: 'utf-8' });
  assert.equal(r.status, 0, `python help failed: ${r.stderr}`);
  assert.ok(r.stdout.includes('arXiv'), 'should include arXiv in help text');
});

test('install.js uses correct oh-my-openagent flags (stable + beta channels)', () => {
  const content = fs.readFileSync(INSTALL_JS, 'utf-8');
  const cmds = [...content.matchAll(/execSync\(\s*['"]([^"']*oh-my-openagent[^"']*)['"]/g)].map(
    (m) => m[1],
  );
  const expected = [
    'npx -y oh-my-openagent@latest install',
    'npx -y oh-my-openagent@beta install',
  ];
  for (const prefix of expected) {
    const cmd = cmds.find((c) => c.startsWith(prefix));
    assert.ok(cmd, `missing installer command for: ${prefix}`);
    assert.ok(!cmd.includes('--yes'), 'should NOT use --yes flag');
    assert.ok(cmd.includes('--no-tui'), 'must use --no-tui');
    assert.ok(cmd.includes('--platform=opencode'), 'must specify platform=opencode');
    assert.ok(cmd.includes('--claude=no'), 'must pass --claude=no');
    assert.ok(cmd.includes('--gemini=no'), 'must pass --gemini=no');
    assert.ok(cmd.includes('--copilot=no'), 'must pass --copilot=no');
    assert.ok(!cmd.includes('2>/dev/null'), 'should NOT mask installer errors');
    assert.ok(cmd.startsWith('npx '), 'should use npx');
  }
});

test('install.js asks first before touching an existing omo install', () => {
  const content = fs.readFileSync(INSTALL_JS, 'utf-8');
  assert.ok(
    content.includes('What should the installer do?'),
    'should prompt keep / stable / beta / skip when omo exists',
  );
  assert.ok(
    content.includes('keeping existing install untouched'),
    '--yes mode should keep an existing omo install untouched',
  );
  assert.ok(
    content.includes('oh-my-openagent@beta'),
    'should support the beta channel explicitly',
  );
});

// ============================================================
// RESULTS
// ============================================================
console.log('\n' + '='.repeat(50));
console.log(`📊 Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failures.length > 0) {
  console.error('\n❌ Failed tests:');
  for (const f of failures) {
    console.error(`   - ${f.name}: ${f.err.message}`);
  }
  process.exit(1);
} else {
  console.log('✅ All tests passed!\n');
  process.exit(0);
}
