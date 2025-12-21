#!/usr/bin/env node

/**
 * Docusaurus Build Testing Script
 * Validates the build process and ensures all functionality works correctly
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Configuration
const BUILD_DIR = 'build';
const TIMEOUT = 300000; // 5 minutes timeout for build

// Test results
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}]`;

  switch (type) {
    case 'success':
      console.log(`${prefix} ${chalk.green('✓')} ${message}`);
      break;
    case 'error':
      console.log(`${prefix} ${chalk.red('✗')} ${message}`);
      break;
    case 'warn':
      console.log(`${prefix} ${chalk.yellow('⚠')} ${message}`);
      break;
    case 'info':
    default:
      console.log(`${prefix} ${chalk.blue('-')} ${message}`);
      break;
  }
}

function runTest(name, testFn) {
  testResults.total++;
  log(`Running test: ${name}`, 'info');

  try {
    testFn();
    testResults.passed++;
    log(`Test passed: ${name}`, 'success');
  } catch (error) {
    testResults.failed++;
    testResults.errors.push({ name, error: error.message });
    log(`Test failed: ${name} - ${error.message}`, 'error');
  }
}

function cleanupBuild() {
  log('Cleaning up build directory...', 'info');
  try {
    if (fs.existsSync(BUILD_DIR)) {
      fs.rmSync(BUILD_DIR, { recursive: true, force: true });
      log('Build directory cleaned up', 'success');
    }
  } catch (error) {
    log(`Failed to clean up build directory: ${error.message}`, 'error');
  }
}

function buildSite() {
  log('Starting Docusaurus build process...', 'info');

  const buildProcess = spawnSync('npm', ['run', 'build'], {
    stdio: 'pipe',
    encoding: 'utf-8',
    timeout: TIMEOUT
  });

  if (buildProcess.error) {
    throw new Error(`Build process failed: ${buildProcess.error.message}`);
  }

  if (buildProcess.status !== 0) {
    throw new Error(`Build failed with exit code ${buildProcess.status}\n${buildProcess.stderr}`);
  }

  log('Build completed successfully', 'success');
  return buildProcess.stdout;
}

function checkBuildOutput(output) {
  // Check for build success indicators
  if (!output.includes('Success') && !output.includes('Generated static files')) {
    throw new Error('Build output does not contain success indicators');
  }

  // Check for common build errors
  if (output.includes('Error') || output.includes('error')) {
    // Filter out false positives like "error" in URLs
    const errorLines = output.split('\n').filter(line =>
      line.toLowerCase().includes('error') &&
      !line.includes('https://') &&
      !line.includes('http://')
    );

    if (errorLines.length > 0) {
      throw new Error(`Build contains error messages: ${errorLines.join(', ')}`);
    }
  }

  log('Build output validation passed', 'success');
}

function validateBuildDirectory() {
  if (!fs.existsSync(BUILD_DIR)) {
    throw new Error(`Build directory '${BUILD_DIR}' does not exist`);
  }

  log(`Build directory exists at ${BUILD_DIR}`, 'success');

  // Check for essential files
  const essentialFiles = [
    'index.html',
    '404.html',
    'sitemap.xml',
    'manifest.json'
  ];

  essentialFiles.forEach(file => {
    const filePath = path.join(BUILD_DIR, file);
    if (!fs.existsSync(filePath)) {
      log(`Warning: Essential file ${file} not found`, 'warn');
    } else {
      log(`Essential file found: ${file}`, 'success');
    }
  });

  // Check for docs directory
  const docsDir = path.join(BUILD_DIR, 'docs');
  if (!fs.existsSync(docsDir)) {
    log('Warning: docs directory not found in build', 'warn');
  } else {
    log('Docs directory found in build', 'success');
  }
}

function validateHTMLFiles() {
  const htmlFiles = [];
  const walkSync = (dir, filelist = []) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkSync(filePath, filelist);
      } else if (file.endsWith('.html')) {
        filelist.push(filePath);
      }
    });
    return filelist;
  };

  const allHtmlFiles = walkSync(BUILD_DIR);
  log(`Found ${allHtmlFiles.length} HTML files in build`, 'info');

  // Validate a sample of HTML files
  const sampleSize = Math.min(5, allHtmlFiles.length);
  for (let i = 0; i < sampleSize; i++) {
    const htmlFile = allHtmlFiles[i];
    const content = fs.readFileSync(htmlFile, 'utf8');

    // Check for basic HTML structure
    if (!content.includes('<html') || !content.includes('</html>')) {
      throw new Error(`HTML file ${htmlFile} is missing basic HTML structure`);
    }

    if (!content.includes('<head') || !content.includes('</head>')) {
      throw new Error(`HTML file ${htmlFile} is missing head section`);
    }

    if (!content.includes('<body') || !content.includes('</body>')) {
      throw new Error(`HTML file ${htmlFile} is missing body section`);
    }

    // Check for common issues
    if (content.includes('ReferenceError') || content.includes('TypeError')) {
      throw new Error(`HTML file ${htmlFile} contains JavaScript errors`);
    }

    log(`HTML file validated: ${path.relative(BUILD_DIR, htmlFile)}`, 'success');
  }
}

function validateAssets() {
  const assetDirs = ['assets', 'img', 'static'];
  let assetsFound = false;

  assetDirs.forEach(dir => {
    const assetDirPath = path.join(BUILD_DIR, dir);
    if (fs.existsSync(assetDirPath)) {
      const files = fs.readdirSync(assetDirPath);
      log(`Found ${files.length} files in ${dir} directory`, 'info');
      assetsFound = true;
    }
  });

  if (!assetsFound) {
    log('Warning: No asset directories found', 'warn');
  } else {
    log('Asset validation completed', 'success');
  }
}

function validateSitemap() {
  const sitemapPath = path.join(BUILD_DIR, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    log('Warning: sitemap.xml not found', 'warn');
    return;
  }

  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  if (!sitemapContent.includes('<urlset') || !sitemapContent.includes('</urlset>')) {
    throw new Error('Sitemap.xml does not have proper XML structure');
  }

  // Check for at least one URL
  if (!sitemapContent.includes('<url>') || !sitemapContent.includes('</url>')) {
    throw new Error('Sitemap.xml does not contain any URLs');
  }

  log('Sitemap validation passed', 'success');
}

function validateRobotsTxt() {
  const robotsPath = path.join(BUILD_DIR, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    log('robots.txt not found (this might be okay)', 'info');
    return;
  }

  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  if (!robotsContent.includes('User-agent') || !robotsContent.includes('Disallow')) {
    log('robots.txt exists but might not be properly formatted', 'warn');
  } else {
    log('robots.txt validation passed', 'success');
  }
}

function checkBundleSize() {
  const walkSync = (dir) => {
    const files = fs.readdirSync(dir);
    let size = 0;

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        size += walkSync(filePath);
      } else {
        size += stat.size;
      }
    });

    return size;
  };

  const totalSize = walkSync(BUILD_DIR);
  const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

  log(`Total build size: ${sizeInMB} MB`, 'info');

  // Warning if build is too large (over 50MB)
  if (totalSize > 50 * 1024 * 1024) {
    log(`Warning: Build size is quite large (${sizeInMB} MB)`, 'warn');
  } else {
    log('Build size is reasonable', 'success');
  }
}

function validateLinksInBuild() {
  // This would be a more complex validation
  // For now, we'll just check that the build contains internal links
  const indexFile = path.join(BUILD_DIR, 'index.html');
  if (!fs.existsSync(indexFile)) {
    log('Warning: index.html not found for link validation', 'warn');
    return;
  }

  const content = fs.readFileSync(indexFile, 'utf8');
  const internalLinkCount = (content.match(/href="\/[^"]*"/g) || []).length;
  const navLinkCount = (content.match(/href="\/docs\/[^"]*"/g) || []).length;

  log(`Found ${internalLinkCount} internal links and ${navLinkCount} documentation links`, 'info');

  if (internalLinkCount === 0) {
    log('Warning: No internal links found in index.html', 'warn');
  } else {
    log('Internal links validation passed', 'success');
  }
}

function runAllTests() {
  log('Starting Docusaurus build validation tests...', 'info');

  // Clean up any previous build
  cleanupBuild();

  // Run build process
  const buildOutput = buildSite();

  // Run validation tests
  runTest('Build Output Validation', () => checkBuildOutput(buildOutput));
  runTest('Build Directory Validation', validateBuildDirectory);
  runTest('HTML Files Validation', validateHTMLFiles);
  runTest('Assets Validation', validateAssets);
  runTest('Sitemap Validation', validateSitemap);
  runTest('Robots.txt Validation', validateRobotsTxt);
  runTest('Bundle Size Validation', checkBundleSize);
  runTest('Links Validation', validateLinksInBuild);

  log('Build validation tests completed', 'info');

  // Summary
  log(`\nTest Results Summary:`, 'info');
  log(`Total tests: ${testResults.total}`, 'info');
  log(`Passed: ${testResults.passed}`, 'success');
  log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'error' : 'success');

  if (testResults.failed > 0) {
    log(`Failed tests:`, 'error');
    testResults.errors.forEach(error => {
      log(`  - ${error.name}: ${error.error}`, 'error');
    });

    process.exit(1);
  } else {
    log('All tests passed! Build is valid.', 'success');
    process.exit(0);
  }
}

// Run the tests when the script is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testResults
};