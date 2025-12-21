#!/usr/bin/env node

/**
 * Automated Docusaurus Build Testing
 * Comprehensive testing suite for Docusaurus build process
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { promisify } = require('util');

const fsAccess = promisify(fs.access);

// Configuration
const BUILD_DIR = 'build';
const DOCUSAURUS_CONFIG = 'docusaurus.config.js';
const SIDEBARS_FILE = 'sidebars.js';
const DOCS_DIR = 'docs';
const TIMEOUT = 300000; // 5 minutes timeout

// Test results
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: [],
  warnings: []
};

class BuildTester {
  constructor() {
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
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

  async runTest(name, testFn) {
    this.log(`Running test: ${name}`, 'info');
    testResults.total++;

    try {
      await testFn();
      testResults.passed++;
      this.log(`Test passed: ${name}`, 'success');
    } catch (error) {
      testResults.failed++;
      testResults.errors.push({ name, error: error.message });
      this.log(`Test failed: ${name} - ${error.message}`, 'error');
    }
  }

  checkPrerequisites() {
    this.log('Checking prerequisites...', 'info');

    // Check if package.json exists
    if (!fs.existsSync('package.json')) {
      throw new Error('package.json not found in current directory');
    }

    // Check if Docusaurus config exists
    if (!fs.existsSync(DOCUSAURUS_CONFIG)) {
      throw new Error(`${DOCUSAURUS_CONFIG} not found`);
    }

    // Check if node_modules exists
    if (!fs.existsSync('node_modules')) {
      this.log('Warning: node_modules not found, you may need to run npm install', 'warn');
      testResults.warnings.push('node_modules not found');
    }

    this.log('Prerequisites check passed', 'success');
  }

  async cleanBuild() {
    this.log('Cleaning up previous build...', 'info');

    try {
      if (fs.existsSync(BUILD_DIR)) {
        fs.rmSync(BUILD_DIR, { recursive: true, force: true });
        this.log('Previous build directory removed', 'success');
      }
    } catch (error) {
      throw new Error(`Failed to clean build directory: ${error.message}`);
    }
  }

  async buildSite() {
    this.log('Starting Docusaurus build process...', 'info');

    const buildProcess = spawnSync('npx', ['docusaurus', 'build'], {
      stdio: 'pipe',
      encoding: 'utf-8',
      timeout: TIMEOUT,
      env: { ...process.env, NODE_ENV: 'production' }
    });

    if (buildProcess.error) {
      throw new Error(`Build process failed: ${buildProcess.error.message}`);
    }

    if (buildProcess.status !== 0) {
      throw new Error(`Build failed with exit code ${buildProcess.status}\n${buildProcess.stderr || buildProcess.stdout}`);
    }

    this.log('Build completed successfully', 'success');
    return buildProcess.stdout;
  }

  async validateBuildOutput(output) {
    this.log('Validating build output...', 'info');

    // Check for build success indicators
    const successIndicators = [
      'success', 'Success', 'Generated static files', 'Packed', 'Compiled'
    ];

    const hasSuccessIndicator = successIndicators.some(indicator =>
      output.includes(indicator)
    );

    if (!hasSuccessIndicator) {
      throw new Error('Build output does not contain success indicators');
    }

    // Check for build time
    const buildTimeMatch = output.match(/Build completed in ([\d.]+)s/);
    if (buildTimeMatch) {
      const buildTime = parseFloat(buildTimeMatch[1]);
      this.log(`Build time: ${buildTime}s`, 'info');

      if (buildTime > 120) { // More than 2 minutes
        this.log(`Warning: Build time is quite long (${buildTime}s)`, 'warn');
        testResults.warnings.push(`Long build time: ${buildTime}s`);
      }
    }

    // Check for common build errors
    const errorPatterns = [
      /error:/i,
      /Error:/,
      /Failed to compile/,
      /Module build failed/,
      /Cannot resolve/
    ];

    for (const pattern of errorPatterns) {
      if (pattern.test(output)) {
        // Check if it's a false positive (like in URLs)
        const lines = output.split('\n');
        const errorLines = lines.filter(line =>
          pattern.test(line) &&
          !line.includes('https://') &&
          !line.includes('http://') &&
          !line.includes('Error loading') // Ignore preloading errors
        );

        if (errorLines.length > 0) {
          throw new Error(`Build contains error messages: ${errorLines.join(', ')}`);
        }
      }
    }

    this.log('Build output validation passed', 'success');
  }

  async validateBuildStructure() {
    this.log('Validating build structure...', 'info');

    if (!fs.existsSync(BUILD_DIR)) {
      throw new Error(`Build directory '${BUILD_DIR}' does not exist`);
    }

    // Check for essential files and directories
    const essentialFiles = [
      'index.html',
      '404.html',
      'sitemap.xml',
      'manifest.json'
    ];

    const essentialDirs = [
      'docs',
      'assets'
    ];

    // Check files
    for (const file of essentialFiles) {
      const filePath = path.join(BUILD_DIR, file);
      if (!fs.existsSync(filePath)) {
        this.log(`Warning: Essential file ${file} not found`, 'warn');
        testResults.warnings.push(`Missing essential file: ${file}`);
      } else {
        this.log(`Essential file found: ${file}`, 'success');
      }
    }

    // Check directories
    for (const dir of essentialDirs) {
      const dirPath = path.join(BUILD_DIR, dir);
      if (!fs.existsSync(dirPath)) {
        this.log(`Warning: Essential directory ${dir} not found`, 'warn');
        testResults.warnings.push(`Missing essential directory: ${dir}`);
      } else {
        this.log(`Essential directory found: ${dir}`, 'success');
      }
    }

    this.log('Build structure validation passed', 'success');
  }

  async validateHTMLFiles() {
    this.log('Validating HTML files...', 'info');

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
    this.log(`Found ${allHtmlFiles.length} HTML files to validate`, 'info');

    // Validate all HTML files
    let validFiles = 0;
    let invalidFiles = 0;

    for (const htmlFile of allHtmlFiles) {
      try {
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

        // Check for broken asset references
        if (content.includes('404') && (content.includes('asset') || content.includes('static'))) {
          throw new Error(`HTML file ${htmlFile} contains broken asset references`);
        }

        validFiles++;
      } catch (error) {
        invalidFiles++;
        this.log(`HTML validation failed for ${path.relative(BUILD_DIR, htmlFile)}: ${error.message}`, 'error');
      }
    }

    this.log(`HTML validation: ${validFiles} valid, ${invalidFiles} invalid`, 'info');

    if (invalidFiles > 0) {
      throw new Error(`${invalidFiles} HTML files failed validation`);
    }

    this.log('HTML files validation passed', 'success');
  }

  async validateDocumentationStructure() {
    this.log('Validating documentation structure...', 'info');

    const docsPath = path.join(BUILD_DIR, 'docs');
    if (!fs.existsSync(docsPath)) {
      this.log('Documentation directory not found in build', 'warn');
      testResults.warnings.push('Documentation directory not found in build');
      return;
    }

    // Check for module directories
    const moduleDirs = fs.readdirSync(docsPath).filter(file => {
      const filePath = path.join(docsPath, file);
      return fs.statSync(filePath).isDirectory();
    });

    this.log(`Found ${moduleDirs.length} module directories`, 'info');

    // Check for essential module pages
    const essentialModules = [
      'robotic-nervous-system',
      'digital-twin',
      'ai-robot-brain',
      'vla-capstone'
    ];

    for (const module of essentialModules) {
      const modulePath = path.join(docsPath, module);
      if (!fs.existsSync(modulePath)) {
        this.log(`Warning: Module directory ${module} not found`, 'warn');
        testResults.warnings.push(`Missing module: ${module}`);
      } else {
        // Check for index file in module
        const indexPath = path.join(modulePath, 'index.html');
        if (!fs.existsSync(indexPath)) {
          const htmlFiles = fs.readdirSync(modulePath).filter(f => f.endsWith('.html'));
          if (htmlFiles.length === 0) {
            this.log(`Warning: No HTML files found in ${module} directory`, 'warn');
            testResults.warnings.push(`No HTML files in ${module}`);
          } else {
            this.log(`Module ${module} has ${htmlFiles.length} HTML files`, 'info');
          }
        } else {
          this.log(`Module ${module} has index page`, 'success');
        }
      }
    }

    this.log('Documentation structure validation passed', 'success');
  }

  async validateAssets() {
    this.log('Validating assets...', 'info');

    const assetDirs = ['assets', 'img', 'static'];
    let assetsFound = false;

    for (const dir of assetDirs) {
      const assetDirPath = path.join(BUILD_DIR, dir);
      if (fs.existsSync(assetDirPath)) {
        const files = fs.readdirSync(assetDirPath);
        this.log(`Found ${files.length} files in ${dir} directory`, 'info');
        assetsFound = true;
      }
    }

    if (!assetsFound) {
      this.log('Warning: No asset directories found', 'warn');
      testResults.warnings.push('No asset directories found');
    } else {
      this.log('Asset validation passed', 'success');
    }
  }

  async validateSitemap() {
    this.log('Validating sitemap...', 'info');

    const sitemapPath = path.join(BUILD_DIR, 'sitemap.xml');
    if (!fs.existsSync(sitemapPath)) {
      this.log('Warning: sitemap.xml not found', 'warn');
      testResults.warnings.push('sitemap.xml not found');
      return;
    }

    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

    if (!sitemapContent.includes('<urlset') || !sitemapContent.includes('</urlset>')) {
      throw new Error('Sitemap.xml does not have proper XML structure');
    }

    // Count URLs
    const urlCount = (sitemapContent.match(/<url>/g) || []).length;
    this.log(`Sitemap contains ${urlCount} URLs`, 'info');

    if (urlCount < 10) { // Expect at least some pages
      this.log(`Warning: Sitemap has only ${urlCount} URLs`, 'warn');
      testResults.warnings.push(`Low URL count in sitemap: ${urlCount}`);
    }

    this.log('Sitemap validation passed', 'success');
  }

  async validateBundleSize() {
    this.log('Validating bundle size...', 'info');

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
    const sizeInKB = (totalSize / 1024).toFixed(2);

    this.log(`Total build size: ${sizeInKB} KB (${sizeInMB} MB)`, 'info');

    // Check if build is too large (over 100MB)
    if (totalSize > 100 * 1024 * 1024) {
      throw new Error(`Build size is too large: ${sizeInMB} MB`);
    } else if (totalSize > 50 * 1024 * 1024) {
      this.log(`Warning: Build size is quite large (${sizeInMB} MB)`, 'warn');
      testResults.warnings.push(`Large build size: ${sizeInMB} MB`);
    }

    this.log('Bundle size validation passed', 'success');
  }

  async validateLinks() {
    this.log('Validating internal links...', 'info');

    const indexFile = path.join(BUILD_DIR, 'index.html');
    if (!fs.existsSync(indexFile)) {
      this.log('Warning: index.html not found for link validation', 'warn');
      testResults.warnings.push('index.html not found for link validation');
      return;
    }

    const content = fs.readFileSync(indexFile, 'utf8');
    const internalLinkCount = (content.match(/href="\/[^"]*"/g) || []).length;
    const docLinkCount = (content.match(/href="\/docs\/[^"]*"/g) || []).length;
    const staticLinkCount = (content.match(/href="\/assets\/[^"]*"/g) || []).length;

    this.log(`Found ${internalLinkCount} internal links, ${docLinkCount} documentation links, ${staticLinkCount} static links`, 'info');

    if (internalLinkCount === 0) {
      this.log('Warning: No internal links found in index.html', 'warn');
      testResults.warnings.push('No internal links found');
    } else {
      this.log('Links validation passed', 'success');
    }
  }

  async validateJavaScript() {
    this.log('Validating JavaScript files...', 'info');

    const jsFiles = [];
    const walkSync = (dir, filelist = []) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walkSync(filePath, filelist);
        } else if (file.endsWith('.js')) {
          filelist.push(filePath);
        }
      });
      return filelist;
    };

    const allJsFiles = walkSync(path.join(BUILD_DIR, 'assets'));
    this.log(`Found ${allJsFiles.length} JavaScript files`, 'info');

    // For now, just check that JS files exist and aren't empty
    const emptyJsFiles = allJsFiles.filter(file => fs.statSync(file).size === 0);
    if (emptyJsFiles.length > 0) {
      throw new Error(`Found ${emptyJsFiles.length} empty JavaScript files`);
    }

    this.log('JavaScript validation passed', 'success');
  }

  async runAllTests() {
    this.log('Starting automated Docusaurus build testing...', 'info');

    try {
      // Run all tests
      await this.runTest('Prerequisites Check', () => this.checkPrerequisites());
      await this.runTest('Clean Build', () => this.cleanBuild());
      const buildOutput = await this.buildSite();
      await this.runTest('Build Output Validation', () => this.validateBuildOutput(buildOutput));
      await this.runTest('Build Structure Validation', () => this.validateBuildStructure());
      await this.runTest('HTML Files Validation', () => this.validateHTMLFiles());
      await this.runTest('Documentation Structure Validation', () => this.validateDocumentationStructure());
      await this.runTest('Assets Validation', () => this.validateAssets());
      await this.runTest('Sitemap Validation', () => this.validateSitemap());
      await this.runTest('Bundle Size Validation', () => this.validateBundleSize());
      await this.runTest('Links Validation', () => this.validateLinks());
      await this.runTest('JavaScript Validation', () => this.validateJavaScript());

      // Calculate duration
      const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);

      // Summary
      this.log('\n' + '='.repeat(50), 'info');
      this.log('AUTOMATED BUILD TEST SUMMARY', 'info');
      this.log('=' .repeat(50), 'info');
      this.log(`Total tests: ${testResults.total}`, 'info');
      this.log(`Passed: ${testResults.passed}`, 'success');
      this.log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'error' : 'success');
      this.log(`Warnings: ${testResults.warnings.length}`, testResults.warnings.length > 0 ? 'warn' : 'info');
      this.log(`Duration: ${duration}s`, 'info');
      this.log('=' .repeat(50), 'info');

      if (testResults.warnings.length > 0) {
        this.log('\nWarnings:', 'warn');
        testResults.warnings.forEach(warning => {
          this.log(`  - ${warning}`, 'warn');
        });
      }

      if (testResults.failed > 0) {
        this.log('\nFailed tests:', 'error');
        testResults.errors.forEach(error => {
          this.log(`  - ${error.name}: ${error.error}`, 'error');
        });

        process.exit(1);
      } else {
        this.log('\n🎉 All tests passed! Build is valid.', 'success');
        process.exit(0);
      }
    } catch (error) {
      this.log(`\nUnexpected error during testing: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Run the tests when the script is executed directly
if (require.main === module) {
  const tester = new BuildTester();
  tester.runAllTests().catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
  });
}

module.exports = {
  BuildTester,
  testResults
};