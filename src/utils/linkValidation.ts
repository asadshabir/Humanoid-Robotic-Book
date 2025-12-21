/**
 * Link Validation Utilities
 * Validates internal and external links in the documentation
 */

interface LinkValidationResult {
  url: string;
  isValid: boolean;
  status?: number;
  error?: string;
  isExternal: boolean;
  lastChecked: Date;
}

interface LinkValidationOptions {
  timeout?: number; // Timeout in milliseconds for external links
  maxConcurrent?: number; // Maximum number of concurrent requests
  excludePatterns?: string[]; // Patterns to exclude from validation
}

/**
 * Validates a single link
 */
export async function validateLink(
  url: string,
  options: LinkValidationOptions = {}
): Promise<LinkValidationResult> {
  const { timeout = 10000, excludePatterns = [] } = options;

  // Check if URL should be excluded
  if (excludePatterns.some(pattern => url.includes(pattern))) {
    return {
      url,
      isValid: true,
      isExternal: !url.startsWith('/') && !url.startsWith('#') && !url.startsWith('.'),
      lastChecked: new Date(),
      status: 200,
      error: 'Excluded from validation'
    };
  }

  // Determine if it's an external link
  const isExternal = !url.startsWith('/') && !url.startsWith('#') && !url.startsWith('.');

  try {
    if (isExternal) {
      // For external links, try to fetch them
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Humanoid-Robotics-Book-Bot/1.0)'
        }
      });

      clearTimeout(timeoutId);

      const isValid = response.status >= 200 && response.status < 400;

      return {
        url,
        isValid,
        status: response.status,
        isExternal,
        lastChecked: new Date(),
        error: isValid ? undefined : `HTTP ${response.status}`
      };
    } else {
      // For internal links, we can't easily validate without a full path
      // In a Docusaurus context, we'll return a result indicating it needs manual validation
      // or validation through build process
      return {
        url,
        isValid: true, // Assume valid for internal links, as build process will catch issues
        isExternal,
        lastChecked: new Date(),
        error: 'Internal link - validated at build time'
      };
    }
  } catch (error: any) {
    return {
      url,
      isValid: false,
      isExternal,
      lastChecked: new Date(),
      error: error.message || 'Unknown error'
    };
  }
}

/**
 * Validates multiple links concurrently with rate limiting
 */
export async function validateLinks(
  urls: string[],
  options: LinkValidationOptions = {}
): Promise<LinkValidationResult[]> {
  const { maxConcurrent = 5 } = options;
  const results: LinkValidationResult[] = [];

  // Process links in batches to avoid overwhelming servers
  for (let i = 0; i < urls.length; i += maxConcurrent) {
    const batch = urls.slice(i, i + maxConcurrent);
    const batchPromises = batch.map(url => validateLink(url, options));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Small delay between batches to be respectful to servers
    if (i + maxConcurrent < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}

/**
 * Extracts all links from a given text content
 */
export function extractLinks(content: string): string[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links: string[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2];
    links.push(url);
  }

  // Also check for standalone URLs
  const urlRegex = /https?:\/\/[^\s"'<>]+/g;
  let urlMatch;

  while ((urlMatch = urlRegex.exec(content)) !== null) {
    const url = urlMatch[0];
    if (!links.includes(url)) {
      links.push(url);
    }
  }

  return [...new Set(links)]; // Remove duplicates
}

/**
 * Validates links within a specific document
 */
export async function validateDocumentLinks(
  content: string,
  options: LinkValidationOptions = {}
): Promise<LinkValidationResult[]> {
  const links = extractLinks(content);
  return await validateLinks(links, options);
}

/**
 * Creates a validation report for a set of links
 */
export function createValidationReport(results: LinkValidationResult[]): string {
  const total = results.length;
  const valid = results.filter(r => r.isValid).length;
  const invalid = total - valid;

  let report = `Link Validation Report\n`;
  report += `=====================\n`;
  report += `Total links: ${total}\n`;
  report += `Valid links: ${valid}\n`;
  report += `Invalid links: ${invalid}\n`;
  report += `Success rate: ${total > 0 ? ((valid / total) * 100).toFixed(1) : 0}%\n\n`;

  if (invalid > 0) {
    report += `Invalid Links:\n`;
    report += `-------------\n`;
    results
      .filter(r => !r.isValid)
      .forEach(r => {
        report += `- ${r.url}: ${r.error || 'Unknown error'}\n`;
      });
    report += `\n`;
  }

  const externalCount = results.filter(r => r.isExternal).length;
  const internalCount = total - externalCount;

  report += `Link Types:\n`;
  report += `-----------\n`;
  report += `External links: ${externalCount}\n`;
  report += `Internal links: ${internalCount}\n`;

  return report;
}

/**
 * Validates if a link is a valid URL format
 */
export function isValidUrlFormat(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Normalizes a URL for comparison
 */
export function normalizeUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const urlObj = new URL(url);
      // Remove trailing slash for consistency
      const normalized = urlObj.href.replace(/\/$/, '');
      return normalized;
    } catch {
      return url;
    }
  }
  return url;
}