import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { useLocation } from '@docusaurus/router';
import { useActivePlugin, useDoc } from '@docusaurus/plugin-content-docs/client';
import DocItemMetadata from '@theme/DocItem/Metadata';
import DocItemContent from '@theme/DocItem/Content';
import DocItemFooter from '@theme/DocItem/Footer';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import type { Props } from '@theme/DocItem/Layout';

import AnimatedSection from '@site/src/components/AnimatedSection';
import styles from './styles.module.css';

// Custom DocItem layout with enhanced page transition animations
export default function DocItemLayout({ children }: Props): JSX.Element {
  const { metadata, frontMatter } = useDoc();
  const { pluginId } = useActivePlugin({ failfast: true });
  const { breadcrumbs } = frontMatter;
  const location = useLocation();
  const [pageState, setPageState] = useState<'entering' | 'entered' | 'exiting'>('entering');
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const prevLocation = useRef(location.pathname);

  // Handle page transitions with proper timing
  useEffect(() => {
    // Check if this is a navigation from another page (not initial load)
    const isNavigation = prevLocation.current !== location.pathname;

    if (isNavigation) {
      // Set exiting state for previous page
      setPageState('exiting');

      // Wait for exit animation to complete before showing new content
      const exitTimer = setTimeout(() => {
        setPageState('entering');
        setShouldAnimate(true);

        // Scroll to top when page changes
        window.scrollTo(0, 0);

        // Set entered state after a brief delay to trigger entrance animation
        const enterTimer = setTimeout(() => {
          setPageState('entered');
        }, 50);

        return () => clearTimeout(enterTimer);
      }, 200); // Exit animation duration

      return () => clearTimeout(exitTimer);
    } else {
      // Initial page load
      setShouldAnimate(true);
      setPageState('entered');
    }

    prevLocation.current = location.pathname;
  }, [location.pathname]);

  const {
    hide_table_of_contents: hideTableOfContents,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
  } = frontMatter;

  // Check if we should show breadcrumbs
  const shouldShowBreadcrumbs = breadcrumbs !== false;

  return (
    <>
      <DocItemMetadata />
      <div
        className={clsx(
          styles.docItemWrapper,
          pageState === 'exiting' && styles.pageExiting,
          pageState === 'entering' && styles.pageEntering,
          pageState === 'entered' && styles.pageEntered
        )}
      >
        <div className={clsx('row', styles.docItemRow)}>
          <div className={clsx('col', styles.docItemContainer)}>
            {shouldShowBreadcrumbs && (
              <div className={styles.breadcrumbsContainer}>
                <AnimatedSection
                  animationType="slide-up"
                  delay={150}
                  duration={400}
                  className={styles.breadcrumbAnimation}
                >
                  <DocBreadcrumbs />
                </AnimatedSection>
              </div>
            )}

            <div className={styles.docItemBody}>
              <AnimatedSection
                animationType="fade"
                delay={200}
                duration={500}
                className={styles.contentAnimation}
              >
                <DocItemContent>{children}</DocItemContent>
              </AnimatedSection>
            </div>

            <div className={styles.docItemFooter}>
              <AnimatedSection
                animationType="slide-up"
                delay={250}
                duration={400}
                className={styles.footerAnimation}
              >
                <DocItemFooter />
              </AnimatedSection>
            </div>
          </div>

          {!hideTableOfContents && (
            <div className="col col--3">
              <AnimatedSection
                animationType="slide-right"
                delay={300}
                duration={400}
                className={styles.tocAnimation}
              >
                <div className={styles.tableOfContents}>
                  <div className="table-of-contents">
                    <div className="table-of-contents__left-border"></div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          )}
        </div>
      </div>
    </>
  );
}