import React from 'react';
import Layout from '@theme/Layout';
import HeroSection from '../components/Homepage/HeroSection';
import CoreModulesSection from '../components/Homepage/CoreModulesSection';
import AuthorSection from '../components/Homepage/AuthorSection';
import BookJourneySection from '../components/Homepage/BookJourneySection';

function Homepage(): JSX.Element {
  return (
    <Layout
      title="Physical AI & Humanoid Robotics"
      description="Premium Technical Book on Advanced Robotics">
      <HeroSection
        title="Physical AI & Humanoid Robotics"
        subtitle="Premium Technical Book on Advanced Robotics"
        description="This comprehensive guide is structured in four progressive modules that will take you from fundamental concepts to advanced implementations in humanoid robotics, covering everything from ROS 2 fundamentals to Vision-Language-Action systems."
      />
      <AuthorSection />
      <BookJourneySection />
      <CoreModulesSection />
    </Layout>
  );
}

export default Homepage;