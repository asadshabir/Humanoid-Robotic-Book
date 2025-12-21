import React from 'react';

interface Author {
  firstName: string;
  lastName: string;
  middleInitial?: string;
}

interface CitationProps {
  type: 'book' | 'journal' | 'webpage' | 'conference' | 'thesis' | 'report' | 'video' | 'other';
  title: string;
  authors: Author[];
  year: number;
  publisher?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  accessedDate?: string; // For webpages
  institution?: string; // For reports/thesis
  location?: string;
  className?: string;
}

const Citation: React.FC<CitationProps> = ({
  type,
  title,
  authors,
  year,
  publisher,
  journal,
  volume,
  issue,
  pages,
  doi,
  url,
  accessedDate,
  institution,
  location,
  className = ''
}) => {
  // Format authors according to APA style
  const formatAuthors = (authors: Author[]): string => {
    if (authors.length === 0) return '';

    if (authors.length === 1) {
      const author = authors[0];
      return `${author.lastName}, ${author.firstName.charAt(0)}.` +
        (author.middleInitial ? `${author.middleInitial.charAt(0)}.` : '');
    }

    if (authors.length === 2) {
      const author1 = authors[0];
      const author2 = authors[1];
      return `${author1.lastName}, ${author1.firstName.charAt(0)}.` +
        (author1.middleInitial ? `${author1.middleInitial.charAt(0)}.` : '') +
        `, & ${author2.lastName}, ${author2.firstName.charAt(0)}.` +
        (author2.middleInitial ? `${author2.middleInitial.charAt(0)}.` : '');
    }

    // For 3+ authors, use et al. after first author in in-text citations
    // But for reference list, we'll show all authors (simplified here)
    const formattedAuthors = authors.map((author, index) => {
      let authorStr = `${author.lastName}, ${author.firstName.charAt(0)}.`;
      if (author.middleInitial) {
        authorStr += `${author.middleInitial.charAt(0)}.`;
      }
      if (index < authors.length - 1) {
        authorStr += ', ';
      }
      return authorStr;
    }).join('');

    return formattedAuthors;
  };

  // Generate APA 7 formatted citation based on type
  const generateCitation = (): string => {
    let citation = `${formatAuthors(authors)} (${year}). `;
    citation += `${title}. `;

    switch (type) {
      case 'book':
        citation += `${publisher}`;
        break;

      case 'journal':
        citation += `${journal}, ${volume ? volume + (issue ? `(${issue})` : '') : ''}${pages ? `, ${pages}` : ''}`;
        if (doi) citation += ` https://doi.org/${doi}`;
        break;

      case 'webpage':
        citation += `${location ? location + ': ' : ''}${publisher ? publisher : ''}`;
        if (url) {
          citation += `. Retrieved from ${url}`;
          if (accessedDate) citation += ` (Accessed: ${accessedDate})`;
        }
        break;

      case 'conference':
        citation += `In ${journal ? journal + ' ' : ''}${location ? location + ', ' : ''}${publisher ? publisher + ', ' : ''}${pages ? `pp. ${pages}.` : ''}`;
        if (doi) citation += ` https://doi.org/${doi}`;
        break;

      case 'thesis':
        citation += `${institution ? institution + '. ' : ''}${publisher ? publisher + '. ' : ''}`;
        break;

      case 'report':
        citation += `${institution ? institution + '. ' : ''}${publisher ? publisher + '. ' : ''}`;
        break;

      case 'video':
        citation += `[Video]. ${publisher ? publisher + '. ' : ''}`;
        if (url) citation += `Available at: ${url}`;
        break;

      default:
        citation += `${publisher ? publisher + '. ' : ''}${url ? `Available at: ${url}` : ''}`;
    }

    return citation;
  };

  const citationText = generateCitation();
  const citationId = `citation-${year}-${authors[0]?.lastName.toLowerCase()}`;

  return (
    <div className={`citation-container ${className}`}>
      <div
        className="citation-content"
        id={citationId}
        itemScope
        itemType="https://schema.org/CreativeWork"
      >
        <p className="citation-text">{citationText}</p>
      </div>

      {/* Hidden structured data for academic indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "author": authors.map(author => ({
              "@type": "Person",
              "givenName": author.firstName,
              "familyName": author.lastName,
              "additionalName": author.middleInitial
            })),
            "datePublished": `${year}-01-01`,
            "headline": title,
            "publisher": publisher ? {
              "@type": "Organization",
              "name": publisher
            } : undefined,
            "isPartOf": journal ? {
              "@type": "Periodical",
              "name": journal
            } : undefined,
            "url": url,
            "identifier": doi ? `https://doi.org/${doi}` : undefined
          })
        }}
      />
    </div>
  );
};

// Component for in-text citations
interface InTextCitationProps {
  authors: string | string[]; // Last name(s) of author(s)
  year: number;
  page?: string;
  className?: string;
}

const InTextCitation: React.FC<InTextCitationProps> = ({
  authors,
  year,
  page,
  className = ''
}) => {
  let authorText = '';
  if (typeof authors === 'string') {
    authorText = authors;
  } else if (Array.isArray(authors)) {
    if (authors.length === 1) {
      authorText = authors[0];
    } else if (authors.length === 2) {
      authorText = `${authors[0]} & ${authors[1]}`;
    } else {
      authorText = `${authors[0]}, et al.`;
    }
  }

  const citationText = page
    ? `(${authorText}, ${year}, p. ${page})`
    : `(${authorText}, ${year})`;

  return (
    <span
      className={`in-text-citation ${className}`}
      itemProp="citation"
    >
      {citationText}
    </span>
  );
};

// Component for citation list
interface CitationListProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const CitationList: React.FC<CitationListProps> = ({
  children,
  title = 'References',
  className = ''
}) => {
  return (
    <section className={`citation-list-container ${className}`}>
      <h2 className="citation-list-title">{title}</h2>
      <div className="citation-list-content">
        {children}
      </div>
    </section>
  );
};

export { Citation, InTextCitation, CitationList };