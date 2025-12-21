#!/usr/bin/env node

/**
 * Build validation script for Physical AI & Humanoid Robotics Book
 * Ensures 100% build success rate and validates all critical aspects
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const BUILD_DIR = 'build';
const DOCS_DIR = 'docs';
const REQUIRED_DIRS = [
  'robotic-nervous-system',
  'digital-twin',
  'ai-robot-brain',
  'vla-capstone'
];

// Validation results
let validationResults = {
  totalChecks: 0,
  passedChecks: 0,
  failedChecks: 0,
  errors: []
};

// Log function
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const levelColors = {
    info: '\x1b[36m',  // Cyan
    success: '\x1b[32m', // Green
    warn: '\x1b[33m',   // Yellow
    error: '\x1b[31m'   // Red
  };
  const reset = '\x1b[0m';

  console.log(`${levelColors[level] || ''}[${timestamp}] ${message}${reset}`);
}

// Increment validation counters
function incrementCheck(passed, message) {
  validationResults.totalChecks++;
  if (passed) {
    validationResults.passedChecks++;
    log(`✓ ${message}`, 'success');
  } else {
    validationResults.failedChecks++;
    validationResults.errors.push(message);
    log(`✗ ${message}`, 'error');
  }
}

// Check if command exists
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}

// Validate Node.js version
function validateNodeVersion() {
  const nodeVersion = process.version;
  const version = parseInt(nodeVersion.split('.')[0].substring(1));
  const passed = version >= 16; // Docusaurus requires Node 16.14+
  incrementCheck(passed, `Node.js version ${nodeVersion} (>=16 required): ${passed ? 'PASS' : 'FAIL'}`);
  return passed;
}

// Validate npm/yarn installation
function validatePackageManager() {
  const npmExists = commandExists('npm');
  const yarnExists = commandExists('yarn');
  const passed = npmExists || yarnExists;
  incrementCheck(passed, `Package manager (npm or yarn) exists: ${passed ? 'PASS' : 'FAIL'}`);
  return passed;
}

// Validate package.json exists and has required dependencies
function validatePackageJson() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const hasDocusaurus = packageJson.dependencies && (
      packageJson.dependencies['@docusaurus/core'] ||
      packageJson.devDependencies && packageJson.devDependencies['@docusaurus/core']
    );
    const hasScripts = packageJson.scripts &&
      packageJson.scripts.build &&
      packageJson.scripts.start;

    incrementCheck(hasDocusaurus, 'Docusaurus dependency exists: ' + (hasDocusaurus ? 'PASS' : 'FAIL'));
    incrementCheck(hasScripts, 'Build/start scripts exist: ' + (hasScripts ? 'PASS' : 'FAIL'));

    return hasDocusaurus && hasScripts;
  } catch (e) {
    incrementCheck(false, `package.json validation failed: ${e.message}`);
    return false;
  }
}

// Validate docs directory structure
function validateDocsStructure() {
  let allPassed = true;

  for (const dir of REQUIRED_DIRS) {
    const exists = fs.existsSync(path.join(DOCS_DIR, dir));
    incrementCheck(exists, `Docs directory ${dir} exists: ${exists ? 'PASS' : 'FAIL'}`);
    allPassed = allPassed && exists;
  }

  // Check for index files in each module
  for (const dir of REQUIRED_DIRS) {
    const indexPath = path.join(DOCS_DIR, dir, 'index.mdx');
    const exists = fs.existsSync(indexPath);
    incrementCheck(exists, `Index file ${indexPath} exists: ${exists ? 'PASS' : 'FAIL'}`);
    allPassed = allPassed && exists;
  }

  return allPassed;
}

// Run build command and check for success
function runBuild() {
  try {
    log('Starting build process...');
    const startTime = Date.now();

    const buildOutput = execSync('npm run build', {
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf-8',
      timeout: 300000 // 5 minute timeout
    });

    const buildTime = Date.now() - startTime;
    log(`Build completed in ${buildTime / 1000}s`);

    // Check for success indicators in output
    const successIndicators = [
      '[SUCCESS] Generated static files in "build"',
      'Generated static files in "build"'
    ];

    const hasSuccess = successIndicators.some(indicator =>
      buildOutput && buildOutput.includes(indicator)
    );

    incrementCheck(hasSuccess, `Build process completed successfully: ${hasSuccess ? 'PASS' : 'FAIL'}`);

    if (!hasSuccess) {
      log('Build output:', 'info');
      log(buildOutput, 'error');
    }

    return hasSuccess;
  } catch (e) {
    incrementCheck(false, `Build failed: ${e.message}`);
    if (e.stdout) log(`Build stdout: ${e.stdout}`, 'error');
    if (e.stderr) log(`Build stderr: ${e.stderr}`, 'error');
    return false;
  }
}

// Validate build output
function validateBuildOutput() {
  const buildExists = fs.existsSync(BUILD_DIR);
  incrementCheck(buildExists, `Build directory ${BUILD_DIR} exists: ${buildExists ? 'PASS' : 'FAIL'}`);

  if (!buildExists) {
    return false;
  }

  // Check for critical build files
  const criticalFiles = [
    'docs/index.html',  // Main index file for the site
    '404.html',
    'docs/robotic-nervous-system/index.html',  // Module index files
    'docs/digital-twin/index.html',
    'docs/ai-robot-brain/index.html',
    'docs/vla-capstone/index.html'
  ];

  let allPassed = true;
  for (const file of criticalFiles) {
    const filePath = path.join(BUILD_DIR, file);
    const exists = fs.existsSync(filePath);
    incrementCheck(exists, `Critical file ${file} exists: ${exists ? 'PASS' : 'FAIL'}`);
    allPassed = allPassed && exists;
  }

  // Check that each module has been built
  for (const dir of REQUIRED_DIRS) {
    const builtDir = path.join(BUILD_DIR, 'docs', dir);
    const exists = fs.existsSync(builtDir);
    incrementCheck(exists, `Built module directory docs/${dir} exists: ${exists ? 'PASS' : 'FAIL'}`);
    allPassed = allPassed && exists;
  }

  return allPassed;
}

// Validate no SSR errors in build
function validateNoSSRErrors() {
  if (!fs.existsSync('build.log')) {
    // Create a build log for validation
    try {
      execSync('npm run build > build.log 2>&1', { stdio: 'pipe' });
    } catch (e) {
      // Build may have failed, but we still want to check the log
      execSync('npm run build > build.log 2>&1 || true', { stdio: 'pipe' });
    }
  }

  const buildLog = fs.readFileSync('build.log', 'utf8');
  const ssrErrorPatterns = [
    'ReferenceError: window is not defined',
    'ReferenceError: document is not defined',
    'ReferenceError: navigator is not defined',
    'TypeError: Cannot read property.*of undefined',
    'SSR Error'
  ];

  let hasSSRErrors = false;
  for (const pattern of ssrErrorPatterns) {
    if (buildLog.includes(pattern)) {
      hasSSRErrors = true;
      break;
    }
  }

  incrementCheck(!hasSSRErrors, `No SSR errors detected: ${!hasSSRErrors ? 'PASS' : 'FAIL'}`);
  return !hasSSRErrors;
}

// Main validation function
async function runValidation() {
  log('Starting build validation process...', 'info');

  // Run all validations
  const checks = [
    validateNodeVersion(),
    validatePackageManager(),
    validatePackageJson(),
    validateDocsStructure(),
    runBuild(),
    validateBuildOutput(),
    validateNoSSRErrors()
  ];

  const allPassed = checks.every(check => check === true);

  // Summary
  log('\n=== VALIDATION SUMMARY ===', 'info');
  log(`Total checks: ${validationResults.totalChecks}`, 'info');
  log(`Passed: ${validationResults.passedChecks}`, 'success');
  log(`Failed: ${validationResults.failedChecks}`, validationResults.failedChecks > 0 ? 'error' : 'success');

  if (validationResults.errors.length > 0) {
    log('\nErrors found:', 'error');
    validationResults.errors.forEach((error, index) => {
      log(`  ${index + 1}. ${error}`, 'error');
    });
  }

  // Clean up build log
  if (fs.existsSync('build.log')) {
    fs.unlinkSync('build.log');
  }

  // Exit with appropriate code
  process.exit(allPassed && validationResults.failedChecks === 0 ? 0 : 1);
}

// Run validation
runValidation().catch(error => {
  log(`Validation script error: ${error.message}`, 'error');
  process.exit(1);
});