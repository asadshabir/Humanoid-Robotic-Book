import React, { ReactNode } from 'react';

interface SemanticSectionProps {
  children: ReactNode;
  title: string;
  id: string;
  type?: 'concept' | 'procedure' | 'example' | 'principle' | 'definition' | 'overview';
  tags?: string[];
  relatedTopics?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadingTime?: number; // in minutes
  className?: string;
}

const SemanticSection: React.FC<SemanticSectionProps> = ({
  children,
  title,
  id,
  type = 'concept',
  tags = [],
  relatedTopics = [],
  difficulty = 'intermediate',
  estimatedReadingTime,
  className = ''
}) => {
  const sectionClasses = `semantic-section semantic-section--type-${type} ${className}`.trim();

  // Generate semantic metadata for RAG systems
  const semanticMetadata = {
    title,
    id,
    type,
    tags,
    relatedTopics,
    difficulty,
    estimatedReadingTime,
    timestamp: new Date().toISOString()
  };

  return (
    <section
      className={sectionClasses}
      id={id}
      itemScope
      itemType="https://schema.org/LearningResource"
      data-semantic-metadata={JSON.stringify(semanticMetadata)}
    >
      <header className="semantic-section-header">
        <h2
          className="semantic-section-title"
          itemProp="name"
        >
          {title}
        </h2>

        <div className="semantic-section-meta">
          {difficulty && (
            <span
              className={`semantic-section-difficulty semantic-section-difficulty--${difficulty}`}
              itemProp="difficulty"
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          )}

          {estimatedReadingTime && (
            <span className="semantic-section-reading-time" itemProp="timeRequired">
              {estimatedReadingTime} min read
            </span>
          )}
        </div>

        {tags.length > 0 && (
          <div className="semantic-section-tags">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="semantic-section-tag"
                itemProp="keywords"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className="semantic-section-content"
        itemProp="description"
      >
        {children}
      </div>

      {relatedTopics.length > 0 && (
        <aside className="semantic-section-related" itemProp="isRelatedTo">
          <h3 className="semantic-section-related-title">Related Topics</h3>
          <ul className="semantic-section-related-list">
            {relatedTopics.map((topic, index) => (
              <li key={index} className="semantic-section-related-item">
                {topic}
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* Hidden metadata for RAG systems */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            "name": title,
            "description": `Content section about ${title} in Physical AI & Humanoid Robotics`,
            "about": tags,
            "educationalLevel": difficulty,
            "learningResourceType": type,
            "timeRequired": estimatedReadingTime ? `PT${estimatedReadingTime}M` : undefined,
            "url": typeof window !== 'undefined' ? window.location.href + '#' + id : ''
          })
        }}
      />
    </section>
  );
};

export default SemanticSection;