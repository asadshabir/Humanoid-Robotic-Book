/**
 * Citation Validation Utilities
 * Validates APA 7 format citations and reference integrity
 */

interface CitationData {
  type: 'book' | 'journal' | 'webpage' | 'conference' | 'thesis' | 'report' | 'video' | 'other';
  title: string;
  authors: Array<{
    firstName: string;
    lastName: string;
    middleInitial?: string;
  }>;
  year: number;
  publisher?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  accessedDate?: string;
  institution?: string;
  location?: string;
}

/**
 * Validates if a citation follows APA 7 format requirements
 */
export function validateAPACitation(citation: CitationData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate required fields
  if (!citation.title || citation.title.trim() === '') {
    errors.push('Title is required');
  }

  if (!citation.authors || citation.authors.length === 0) {
    errors.push('At least one author is required');
  } else {
    citation.authors.forEach((author, index) => {
      if (!author.firstName || author.firstName.trim() === '') {
        errors.push(`Author ${index + 1} must have a first name`);
      }
      if (!author.lastName || author.lastName.trim() === '') {
        errors.push(`Author ${index + 1} must have a last name`);
      }
    });
  }

  if (!citation.year) {
    errors.push('Year is required');
  } else {
    const currentYear = new Date().getFullYear();
    if (citation.year > currentYear + 1 || citation.year < 1900) {
      errors.push(`Year ${citation.year} appears to be invalid`);
    }
  }

  // Validate type-specific requirements
  switch (citation.type) {
    case 'journal':
      if (!citation.journal || citation.journal.trim() === '') {
        errors.push('Journal type requires a journal name');
      }
      if (!citation.volume && !citation.pages) {
        errors.push('Journal type requires either volume or page information');
      }
      break;

    case 'webpage':
      if (!citation.url || citation.url.trim() === '') {
        errors.push('Webpage type requires a URL');
      }
      if (citation.accessedDate) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(citation.accessedDate)) {
          errors.push('Accessed date must be in YYYY-MM-DD format');
        } else {
          // Validate that the date is not in the future
          const accessDate = new Date(citation.accessedDate);
          const today = new Date();
          if (accessDate > today) {
            errors.push('Accessed date cannot be in the future');
          }
        }
      }
      break;

    case 'book':
      if (!citation.publisher || citation.publisher.trim() === '') {
        errors.push('Book type requires a publisher');
      }
      break;

    case 'thesis':
      if (!citation.institution || citation.institution.trim() === '') {
        errors.push('Thesis type requires an institution');
      }
      break;

    case 'report':
      if (!citation.institution && !citation.publisher) {
        errors.push('Report type requires either an institution or publisher');
      }
      break;
  }

  // Validate DOI format if present
  if (citation.doi) {
    const doiRegex = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
    if (!doiRegex.test(citation.doi)) {
      errors.push('DOI format is invalid');
    }
  }

  // Validate URL format if present
  if (citation.url) {
    try {
      new URL(citation.url);
    } catch {
      errors.push('URL format is invalid');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates in-text citations against reference list
 */
export function validateInTextCitation(
  inTextCitation: string,
  referenceList: CitationData[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Extract author and year from in-text citation
  const citationMatch = inTextCitation.match(/\(([^,]+),\s*(\d{4})(?:,\s*p\.\s*(\d+))?\)/);

  if (!citationMatch) {
    errors.push('In-text citation format is invalid. Expected format: (Author, Year) or (Author, Year, p. Page)');
    return {
      isValid: false,
      errors
    };
  }

  const [, authorText, yearText] = citationMatch;
  const year = parseInt(yearText, 10);

  // Check if there's a matching reference
  const matchingReferences = referenceList.filter(ref => {
    // Check if any author matches
    const hasMatchingAuthor = ref.authors.some(author =>
      author.lastName.toLowerCase().includes(authorText.toLowerCase().replace('&', '').trim())
    );

    // Check if year matches
    return hasMatchingAuthor && ref.year === year;
  });

  if (matchingReferences.length === 0) {
    errors.push(`No matching reference found for citation: ${inTextCitation}`);
  } else if (matchingReferences.length > 1) {
    errors.push(`Multiple matching references found for citation: ${inTextCitation}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates the completeness of a citation list
 */
export function validateCitationList(citations: CitationData[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  citations.forEach((citation, index) => {
    const validation = validateAPACitation(citation);
    if (!validation.isValid) {
      errors.push(`Citation ${index + 1}: ${validation.errors.join(', ')}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generates an APA 7 compliant citation string for validation display
 */
export function generateAPACitationString(citation: CitationData): string {
  let citationStr = '';

  // Format authors
  if (citation.authors && citation.authors.length > 0) {
    if (citation.authors.length === 1) {
      const author = citation.authors[0];
      citationStr += `${author.lastName}, ${author.firstName.charAt(0)}.`;
      if (author.middleInitial) {
        citationStr += `${author.middleInitial.charAt(0)}.`;
      }
      citationStr += ' ';
    } else if (citation.authors.length === 2) {
      const author1 = citation.authors[0];
      const author2 = citation.authors[1];
      citationStr += `${author1.lastName}, ${author1.firstName.charAt(0)}.`;
      if (author1.middleInitial) citationStr += `${author1.middleInitial.charAt(0)}.`;
      citationStr += `, & ${author2.lastName}, ${author2.firstName.charAt(0)}.`;
      if (author2.middleInitial) citationStr += `${author2.middleInitial.charAt(0)}.`;
      citationStr += ' ';
    } else {
      // For 3+ authors, show first then et al.
      const firstAuthor = citation.authors[0];
      citationStr += `${firstAuthor.lastName}, ${firstAuthor.firstName.charAt(0)}.`;
      if (firstAuthor.middleInitial) citationStr += `${firstAuthor.middleInitial.charAt(0)}.`;
      citationStr += ', et al. ';
    }
  }

  // Add year
  citationStr += `(${citation.year}). `;

  // Add title
  citationStr += `${citation.title}. `;

  // Add type-specific information
  switch (citation.type) {
    case 'book':
      citationStr += `${citation.publisher}`;
      break;

    case 'journal':
      citationStr += `${citation.journal}, ${citation.volume ? citation.volume + (citation.issue ? `(${citation.issue})` : '') : ''}${citation.pages ? `, ${citation.pages}` : ''}`;
      if (citation.doi) citationStr += ` https://doi.org/${citation.doi}`;
      break;

    case 'webpage':
      citationStr += `${citation.location ? citation.location + ': ' : ''}${citation.publisher ? citation.publisher : ''}`;
      if (citation.url) {
        citationStr += `. Retrieved from ${citation.url}`;
        if (citation.accessedDate) citationStr += ` (Accessed: ${citation.accessedDate})`;
      }
      break;

    case 'conference':
      citationStr += `In ${citation.journal ? citation.journal + ' ' : ''}${citation.location ? citation.location + ', ' : ''}${citation.publisher ? citation.publisher + ', ' : ''}${citation.pages ? `pp. ${citation.pages}.` : ''}`;
      if (citation.doi) citationStr += ` https://doi.org/${citation.doi}`;
      break;

    case 'thesis':
      citationStr += `${citation.institution ? citation.institution + '. ' : ''}${citation.publisher ? citation.publisher + '. ' : ''}`;
      break;

    case 'report':
      citationStr += `${citation.institution ? citation.institution + '. ' : ''}${citation.publisher ? citation.publisher + '. ' : ''}`;
      break;

    case 'video':
      citationStr += `[Video]. ${citation.publisher ? citation.publisher + '. ' : ''}`;
      if (citation.url) citationStr += `Available at: ${citation.url}`;
      break;

    default:
      citationStr += `${citation.publisher ? citation.publisher + '. ' : ''}${citation.url ? `Available at: ${citation.url}` : ''}`;
  }

  return citationStr;
}