import React, { useEffect, useRef, useState } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animationType?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale';
  delay?: number;
  duration?: number;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animationType = 'fade',
  delay = 0,
  duration = 500,
  className = '',
  tag: Tag = 'div',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimationDisabled, setIsAnimationDisabled] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Check if user prefers reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsAnimationDisabled(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsAnimationDisabled(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle intersection observer for animations
  useEffect(() => {
    if (isAnimationDisabled) {
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [delay, isAnimationDisabled]);

  // Animation classes based on type
  const getAnimationClass = () => {
    if (isAnimationDisabled || !isVisible) return '';

    const baseClass = 'animated-section--visible';
    let animationClass = '';

    switch (animationType) {
      case 'fade':
        animationClass = 'animated-section--fade';
        break;
      case 'slide-up':
        animationClass = 'animated-section--slide-up';
        break;
      case 'slide-down':
        animationClass = 'animated-section--slide-down';
        break;
      case 'slide-left':
        animationClass = 'animated-section--slide-left';
        break;
      case 'slide-right':
        animationClass = 'animated-section--slide-right';
        break;
      case 'scale':
        animationClass = 'animated-section--scale';
        break;
      default:
        animationClass = 'animated-section--fade';
    }

    return `${animationClass} ${baseClass}`;
  };

  const combinedClassName = `animated-section ${getAnimationClass()} ${className}`.trim();

  return (
    <Tag
      ref={elementRef}
      className={combinedClassName}
      style={{
        transition: isAnimationDisabled ? 'none' : `all ${duration}ms ease`,
        opacity: isAnimationDisabled || isVisible ? 1 : 0,
        ...(!isAnimationDisabled && isVisible ? {} : { transform: getInitialTransform(animationType) })
      }}
    >
      {children}
    </Tag>
  );
};

// Helper function to get initial transform based on animation type
const getInitialTransform = (animationType: string) => {
  switch (animationType) {
    case 'slide-up':
      return 'translateY(20px)';
    case 'slide-down':
      return 'translateY(-20px)';
    case 'slide-left':
      return 'translateX(20px)';
    case 'slide-right':
      return 'translateX(-20px)';
    case 'scale':
      return 'scale(0.95)';
    default:
      return '';
  }
};

export default AnimatedSection;