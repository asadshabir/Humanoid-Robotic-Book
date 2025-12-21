import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from '../../pages/index.module.css';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description
}) => {
  return (
    <section className={clsx(styles.heroSection, 'fade-in-up')}>
      <div className={styles.heroContainer}>
        <div className={clsx(styles.heroContent, 'animated', 'delay-1')}>
          <div className={clsx(styles.logoContainer, 'fade-in')}>
            <img
              src="/img/hero/robotics-book-logo.png"
              alt="Physical AI & Humanoid Robotics Logo"
              className={styles.logoImage}
              loading="eager"
            />
          </div>
          <h1 className="fade-in-up delay-1">{title}</h1>
          <h2 className="fade-in-up delay-2">{subtitle}</h2>
          <p className="fade-in-up delay-3">{description}</p>
          <div className={clsx(styles.ctaContainer, 'fade-in-up delay-4')}>
            <Link
              to="/docs/"
              className={clsx(styles.ctaButton, styles.primaryButton, 'hover-scale')}
            >
              Explore the Book
            </Link>
            <Link
              to="/docs/robotic-nervous-system"
              className={clsx(styles.ctaButton, styles.secondaryButton, 'hover-scale')}
            >
              Start Reading
            </Link>
            <Link
              to="/docs/intro"
              className={clsx(styles.ctaButton, styles.readMeButton, 'hover-glow')}
            >
              Read Me
            </Link>
          </div>
        </div>
        <div className={clsx(styles.heroImage, 'animated', 'float', 'delay-2')}>
          <img
            src="/img/hero/landing-page-hero-image.png"
            alt="Physical AI & Humanoid Robotics Book Cover"
            loading="eager"
            className="hover-scale"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;