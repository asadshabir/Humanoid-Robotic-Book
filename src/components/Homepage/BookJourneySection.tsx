import React from 'react';
import clsx from 'clsx';
import styles from '../../pages/index.module.css';

const BookJourneySection: React.FC = () => {
  const journeySteps = [
    {
      title: "Research Phase",
      description: "Extensive research into current state of humanoid robotics and Physical AI technologies",
      icon: "🔍"
    },
    {
      title: "Conceptualization",
      description: "Developing the structure and approach to make complex topics accessible",
      icon: "💡"
    },
    {
      title: "Technical Writing",
      description: "Detailed documentation of ROS 2, simulation environments, and AI integration",
      icon: "✍️"
    },
    {
      title: "Testing & Validation",
      description: "Real-world testing of all examples and code snippets for accuracy",
      icon: "🧪"
    }
  ];

  return (
    <section className={clsx(styles.bookJourneySection, 'fade-in-up')}>
      <div className={styles.bookJourneyContainer}>
        <h2 className="fade-in-up">The Book Creation Journey</h2>
        <p className="fade-in-up delay-1">
          This book was created through a meticulous process combining academic rigor with practical implementation.
          Each chapter was carefully researched, written, and tested to ensure the highest quality and accuracy.
        </p>

        <div className={styles.journeySteps}>
          {journeySteps.map((step, index) => (
            <div
              key={index}
              className={clsx(styles.journeyStep, 'animated', `delay-${index + 2}`)}
            >
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>

        <div className={clsx(styles.journeySummary, 'fade-in-up delay-6')}>
          <p>
            The entire process took 18 months from initial concept to final publication,
            with continuous feedback from robotics professionals and AI researchers.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BookJourneySection;