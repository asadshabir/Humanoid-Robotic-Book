import React from 'react';
import { ThemeProvider } from '@site/src/theme/ThemeContext';
import Header from './Header';
import Footer from './Footer';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  title,
  description
}) => {
  return (
    <ThemeProvider>
      <div className="custom-layout">
        <Header />
        <main className="main-content">
          {title && <h1 className="page-title">{title}</h1>}
          {description && <p className="page-description">{description}</p>}
          <div className="content-wrapper">{children}</div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default ResponsiveLayout;