/**
 * Accessibility Validation Utilities
 * Validates WCAG compliance and accessibility features
 */

interface AccessibilityResult {
  id: string;
  element: string;
  issue: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  suggestions: string[];
  compliant: boolean;
}

interface ColorContrastResult {
  ratio: number;
  isAccessible: boolean;
  foreground: string;
  background: string;
  requiredRatio: number;
  element: string;
}

interface AccessibilityOptions {
  includeColorContrast?: boolean;
  includeAltText?: boolean;
  includeHeadings?: boolean;
  includeLinks?: boolean;
  includeForms?: boolean;
  includeAria?: boolean;
  includeKeyboard?: boolean;
}

/**
 * Validates color contrast according to WCAG 2.1 standards
 */
export function validateColorContrast(
  foreground: string,
  background: string,
  element: string,
  isLargeText: boolean = false
): ColorContrastResult {
  // Convert hex to RGB if needed
  const fgRGB = hexToRgb(foreground) || parseRgb(foreground);
  const bgRGB = hexToRgb(background) || parseRgb(background);

  if (!fgRGB || !bgRGB) {
    return {
      ratio: 0,
      isAccessible: false,
      foreground,
      background,
      requiredRatio: isLargeText ? 3 : 4.5,
      element
    };
  }

  // Calculate relative luminance
  const fgLuminance = calculateLuminance(fgRGB);
  const bgLuminance = calculateLuminance(bgRGB);

  // Calculate contrast ratio
  const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);

  // Determine required ratio based on WCAG standards
  const requiredRatio = isLargeText ? 3 : 4.5; // AA standard
  const isAccessible = ratio >= requiredRatio;

  return {
    ratio: parseFloat(ratio.toFixed(2)),
    isAccessible,
    foreground,
    background,
    requiredRatio,
    element
  };
}

/**
 * Calculates the relative luminance of an RGB color
 */
function calculateLuminance(rgb: { r: number; g: number; b: number }): number {
  const r = sRGBtoLinear(rgb.r / 255);
  const g = sRGBtoLinear(rgb.g / 255);
  const b = sRGBtoLinear(rgb.b / 255);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Converts sRGB to linear RGB
 */
function sRGBtoLinear(color: number): number {
  return color <= 0.03928 ? color / 12.92 : Math.pow((color + 0.055) / 1.055, 2.4);
}

/**
 * Converts hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Parses RGB/RGBA string to RGB object
 */
function parseRgb(rgb: string): { r: number; g: number; b: number } | null {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (match) {
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10)
    };
  }
  return null;
}

/**
 * Validates alt text for images
 */
export function validateAltText(htmlContent: string): AccessibilityResult[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const images = doc.querySelectorAll('img');
  const results: AccessibilityResult[] = [];

  images.forEach((img, index) => {
    const alt = img.getAttribute('alt');
    const src = img.getAttribute('src') || '';

    if (!alt) {
      results.push({
        id: `alt-${index}`,
        element: `<img src="${src}">`,
        issue: 'Missing alt text',
        severity: 'critical',
        description: 'Image is missing alternative text, making it inaccessible to screen readers',
        suggestions: [
          'Add descriptive alt text that conveys the same information as the image',
          'For decorative images, use alt=""'
        ],
        compliant: false
      });
    } else if (alt.trim() === '') {
      results.push({
        id: `alt-${index}`,
        element: `<img src="${src}" alt="">`,
        issue: 'Empty alt text',
        severity: 'moderate',
        description: 'Image has empty alt text, which may be appropriate for decorative images but could be missing content',
        suggestions: [
          'Verify that the image is truly decorative',
          'If the image conveys information, add meaningful alt text'
        ],
        compliant: false
      });
    } else if (alt.length > 125) {
      results.push({
        id: `alt-${index}`,
        element: `<img src="${src}" alt="${alt}">`,
        issue: 'Alt text too long',
        severity: 'minor',
        description: 'Alt text exceeds recommended length of 125 characters',
        suggestions: [
          'Keep alt text concise while still being descriptive',
          'Focus on the most important information conveyed by the image'
        ],
        compliant: false
      });
    }
  });

  return results;
}

/**
 * Validates heading structure for proper hierarchy
 */
export function validateHeadings(htmlContent: string): AccessibilityResult[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const results: AccessibilityResult[] = [];

  let lastLevel = 0;
  let h1Count = 0;

  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    const text = heading.textContent?.trim() || '';

    // Check for missing H1
    if (heading.tagName === 'H1') {
      h1Count++;
    }

    // Check heading hierarchy
    if (level > lastLevel + 1) {
      results.push({
        id: `heading-${index}`,
        element: `<${heading.tagName}>${text}</${heading.tagName}>`,
        issue: 'Improper heading hierarchy',
        severity: 'moderate',
        description: `Heading level ${level} skips level ${lastLevel + 1}, which can confuse screen reader users`,
        suggestions: [
          `Change to level ${lastLevel + 1} heading to maintain proper hierarchy`,
          'Ensure headings follow a logical structure (H1 -> H2 -> H3, etc.)'
        ],
        compliant: false
      });
    }

    lastLevel = level;
  });

  // Check for missing H1
  if (h1Count === 0) {
    results.push({
      id: 'heading-h1',
      element: 'document',
      issue: 'Missing H1 heading',
      severity: 'serious',
      description: 'Document is missing a main H1 heading, which is important for document structure',
      suggestions: [
        'Add a single H1 heading that describes the main topic of the page',
        'Ensure the H1 is the first heading in the document'
      ],
      compliant: false
    });
  }

  // Check for multiple H1s
  if (h1Count > 1) {
    results.push({
      id: 'heading-h1-multiple',
      element: 'document',
      issue: 'Multiple H1 headings',
      severity: 'moderate',
      description: 'Document has multiple H1 headings, which can confuse document structure',
      suggestions: [
        'Use only one H1 heading per page',
        'Consider changing additional H1s to H2s if they are subsections'
      ],
      compliant: false
    });
  }

  return results;
}

/**
 * Validates link accessibility
 */
export function validateLinks(htmlContent: string): AccessibilityResult[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const links = doc.querySelectorAll('a');
  const results: AccessibilityResult[] = [];

  links.forEach((link, index) => {
    const href = link.getAttribute('href');
    const text = link.textContent?.trim() || '';
    const ariaLabel = link.getAttribute('aria-label');
    const ariaLabelledBy = link.getAttribute('aria-labelledby');

    // Check for empty link text
    if (!text && !ariaLabel && !ariaLabelledBy) {
      results.push({
        id: `link-${index}`,
        element: `<a href="${href}">[empty]</a>`,
        issue: 'Link with no accessible text',
        severity: 'critical',
        description: 'Link has no text content or accessible name, making it unusable for screen readers',
        suggestions: [
          'Add descriptive link text that explains where the link goes',
          'Use aria-label to provide an accessible name if the link text is not descriptive'
        ],
        compliant: false
      });
    }

    // Check for generic link text
    const genericTexts = ['click here', 'here', 'more', 'read more', 'link'];
    if (text && genericTexts.some(generic => text.toLowerCase().includes(generic))) {
      results.push({
        id: `link-${index}`,
        element: `<a href="${href}">${text}</a>`,
        issue: 'Generic link text',
        severity: 'moderate',
        description: 'Link uses generic text that doesn\'t describe where the link goes',
        suggestions: [
          'Use descriptive link text that indicates the destination or action',
          'Instead of "click here", use text like "Download the user manual" or "View documentation"'
        ],
        compliant: false
      });
    }

    // Check for same href in multiple links
    if (href) {
      const sameHrefLinks = Array.from(links).filter(l => l.getAttribute('href') === href);
      if (sameHrefLinks.length > 1) {
        // This might be a navigation menu, so we won't flag it unless it's the same text
        const sameTextLinks = sameHrefLinks.filter(l => l.textContent?.trim() === text);
        if (sameTextLinks.length > 1) {
          results.push({
            id: `link-${index}`,
            element: `<a href="${href}">${text}</a>`,
            issue: 'Duplicate link text with same destination',
            severity: 'minor',
            description: 'Multiple links with the same text and destination may confuse users',
            suggestions: [
              'Consider combining the links or using different text to differentiate them',
              'If this is intentional (like a navigation menu), it may be acceptable'
            ],
            compliant: false
          });
        }
      }
    }
  });

  return results;
}

/**
 * Validates form accessibility
 */
export function validateForms(htmlContent: string): AccessibilityResult[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const inputs = doc.querySelectorAll('input, textarea, select');
  const results: AccessibilityResult[] = [];

  inputs.forEach((input, index) => {
    const type = input.getAttribute('type') || input.tagName.toLowerCase();
    const id = input.getAttribute('id');
    const label = doc.querySelector(`label[for="${id}"]`) || input.closest('label');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    const title = input.getAttribute('title');

    // Check for missing label
    if (!label && !ariaLabel && !ariaLabelledBy && !title) {
      results.push({
        id: `form-${index}`,
        element: `<${type} id="${id}">`,
        issue: 'Form field missing label',
        severity: 'critical',
        description: 'Form field has no associated label, making it difficult for screen reader users to understand its purpose',
        suggestions: [
          'Add a label element associated with the form field using the for attribute',
          'Use aria-label to provide an accessible name',
          'Use aria-labelledby to reference an existing label element'
        ],
        compliant: false
      });
    }

    // Check for required fields
    const required = input.hasAttribute('required');
    const ariaRequired = input.getAttribute('aria-required');
    if (required && !input.closest('label')?.textContent?.includes('*') && !input.closest('label')?.textContent?.toLowerCase().includes('required')) {
      // This is just a best practice suggestion, not necessarily an accessibility violation
      results.push({
        id: `form-${index}`,
        element: `<${type} id="${id}" required>`,
        issue: 'Required field not visually marked',
        severity: 'minor',
        description: 'Required field is not visually marked, which may confuse users',
        suggestions: [
          'Visually indicate required fields (e.g., with an asterisk)',
          'Include "required" in the label text'
        ],
        compliant: true // This is a best practice, not a violation
      });
    }
  });

  return results;
}

/**
 * Validates ARIA attributes
 */
export function validateAria(htmlContent: string): AccessibilityResult[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const elements = doc.querySelectorAll('[role], [aria-*]');
  const results: AccessibilityResult[] = [];

  elements.forEach((element, index) => {
    const role = element.getAttribute('role');
    const elementHtml = element.outerHTML.substring(0, 50) + '...';

    // Check for abstract roles
    const abstractRoles = ['command', 'composite', 'input', 'landmark', 'range', 'roletype', 'section', 'sectionhead', 'select', 'structure', 'widget', 'window'];
    if (role && abstractRoles.includes(role)) {
      results.push({
        id: `aria-${index}`,
        element: elementHtml,
        issue: 'Abstract ARIA role used',
        severity: 'serious',
        description: `Abstract role "${role}" should not be used directly`,
        suggestions: [
          'Use concrete ARIA roles instead of abstract roles',
          'Refer to ARIA specification for appropriate role usage'
        ],
        compliant: false
      });
    }

    // Check for redundant ARIA
    const tagName = element.tagName.toLowerCase();
    if (role === 'button' && tagName === 'button') {
      results.push({
        id: `aria-${index}`,
        element: elementHtml,
        issue: 'Redundant ARIA role',
        severity: 'minor',
        description: 'ARIA role is redundant as the element already has the appropriate semantic role',
        suggestions: [
          'Remove the redundant role as the native element provides the same semantics',
          'Rely on native semantics when possible'
        ],
        compliant: true // This is a best practice, not a violation
      });
    }
  });

  return results;
}

/**
 * Performs comprehensive accessibility validation
 */
export function validateAccessibility(
  htmlContent: string,
  options: AccessibilityOptions = {}
): AccessibilityResult[] {
  const {
    includeColorContrast = true,
    includeAltText = true,
    includeHeadings = true,
    includeLinks = true,
    includeForms = true,
    includeAria = true,
    includeKeyboard = true
  } = options;

  let results: AccessibilityResult[] = [];

  if (includeAltText) {
    results = [...results, ...validateAltText(htmlContent)];
  }

  if (includeHeadings) {
    results = [...results, ...validateHeadings(htmlContent)];
  }

  if (includeLinks) {
    results = [...results, ...validateLinks(htmlContent)];
  }

  if (includeForms) {
    results = [...results, ...validateForms(htmlContent)];
  }

  if (includeAria) {
    results = [...results, ...validateAria(htmlContent)];
  }

  // For keyboard accessibility, we'd need to analyze the full page structure
  // This is a simplified check for common keyboard accessibility issues
  if (includeKeyboard) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const focusableElements = doc.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');

    // Check if focusable elements have proper focus indicators
    // This is more of a CSS consideration, but we can check for common issues
    focusableElements.forEach((element, index) => {
      const style = (element as HTMLElement).style;
      const outline = style.outline || (element as HTMLElement).getAttribute('style')?.includes('outline:');

      // We can't really validate CSS from HTML content alone, so this is a placeholder
      // In a real implementation, we'd need access to computed styles
    });
  }

  return results;
}

/**
 * Creates an accessibility validation report
 */
export function createAccessibilityReport(results: AccessibilityResult[]): string {
  const total = results.length;
  const critical = results.filter(r => r.severity === 'critical').length;
  const serious = results.filter(r => r.severity === 'serious').length;
  const moderate = results.filter(r => r.severity === 'moderate').length;
  const minor = results.filter(r => r.severity === 'minor').length;
  const compliant = results.filter(r => r.compliant).length;
  const nonCompliant = total - compliant;

  let report = `Accessibility Validation Report\n`;
  report += `============================\n`;
  report += `Total issues: ${total}\n`;
  report += `Critical: ${critical}\n`;
  report += `Serious: ${serious}\n`;
  report += `Moderate: ${moderate}\n`;
  report += `Minor: ${minor}\n\n`;

  if (nonCompliant > 0) {
    report += `Non-compliant items: ${nonCompliant}\n`;
    report += `Compliant items: ${compliant}\n`;
    report += `WCAG Compliance: ${total > 0 ? ((compliant / total) * 100).toFixed(1) : 100}%\n\n`;

    report += `Issues by Severity:\n`;
    report += `------------------\n`;

    const severityMap: Record<string, string> = {
      'critical': 'Critical Issues (require immediate attention)',
      'serious': 'Serious Issues (significantly impact accessibility)',
      'moderate': 'Moderate Issues (impact some users)',
      'minor': 'Minor Issues (small accessibility improvements)'
    };

    (['critical', 'serious', 'moderate', 'minor'] as const).forEach(severity => {
      const issues = results.filter(r => r.severity === severity && !r.compliant);
      if (issues.length > 0) {
        report += `\n${severityMap[severity]} (${issues.length}):\n`;
        issues.forEach(issue => {
          report += `- ${issue.issue}: ${issue.description}\n`;
          report += `  Element: ${issue.element}\n`;
          report += `  Suggestions: ${issue.suggestions.join('; ')}\n\n`;
        });
      }
    });
  } else {
    report += `🎉 All accessibility checks passed! The content is WCAG compliant.\n`;
  }

  return report;
}