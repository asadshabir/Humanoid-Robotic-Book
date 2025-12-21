import React, { useEffect, useState } from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import type { Props } from '@theme/DocItem/Content';
import styles from './contentStyles.module.css';

// Custom DocItem content component with enhanced animations
export default function DocItemContent({ children }: Props): JSX.Element {
  const { metadata } = useDoc();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Set loaded state after content is rendered
    setHasLoaded(true);
  }, []);

  return (
    <div className={styles.docItemContent}>
      <article
        className={styles.docArticle}
        itemProp="articleBody"
        style={{
          opacity: hasLoaded ? 1 : 0,
          transform: hasLoaded ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        {children}
      </article>
    </div>
  );
}