import React, { useState, useEffect } from 'react';
import { validateAccessibility, createAccessibilityReport, AccessibilityResult } from '../../utils/accessibilityValidation';

interface AccessibilityValidatorProps {
  initialContent?: string;
  onValidationComplete?: (results: AccessibilityResult[], report: string) => void;
}

const AccessibilityValidator: React.FC<AccessibilityValidatorProps> = ({
  initialContent = '',
  onValidationComplete
}) => {
  const [content, setContent] = useState<string>(initialContent);
  const [results, setResults] = useState<AccessibilityResult[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'input' | 'results' | 'report'>('input');
  const [validationOptions, setValidationOptions] = useState({
    includeColorContrast: true,
    includeAltText: true,
    includeHeadings: true,
    includeLinks: true,
    includeForms: true,
    includeAria: true,
    includeKeyboard: true
  });

  const handleValidate = async () => {
    setIsChecking(true);
    try {
      const validationResults = await validateAccessibility(content, validationOptions);
      setResults(validationResults);

      const report = createAccessibilityReport(validationResults);

      if (onValidationComplete) {
        onValidationComplete(validationResults, report);
      }
    } catch (error) {
      console.error('Error validating accessibility:', error);
      alert('Error occurred during accessibility validation');
    } finally {
      setIsChecking(false);
      setActiveTab('results');
    }
  };

  const handleOptionChange = (option: keyof typeof validationOptions) => {
    setValidationOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical': return 'severity-critical';
      case 'serious': return 'severity-serious';
      case 'moderate': return 'severity-moderate';
      case 'minor': return 'severity-minor';
      default: return '';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'serious': return '🟠';
      case 'moderate': return '🟡';
      case 'minor': return '🟢';
      default: return '⚪';
    }
  };

  const criticalCount = results.filter(r => r.severity === 'critical').length;
  const seriousCount = results.filter(r => r.severity === 'serious').length;
  const moderateCount = results.filter(r => r.severity === 'moderate').length;
  const minorCount = results.filter(r => r.severity === 'minor').length;
  const compliantCount = results.filter(r => r.compliant).length;
  const nonCompliantCount = results.length - compliantCount;

  return (
    <div className="accessibility-validator-container">
      <div className="accessibility-validator-header">
        <h3>Accessibility Validator</h3>
        <div className="validation-summary">
          <div className="summary-item total">
            <span className="summary-label">Total Issues:</span>
            <span className="summary-value">{results.length}</span>
          </div>
          <div className="summary-item critical">
            <span className="summary-label">Critical:</span>
            <span className="summary-value">{criticalCount}</span>
          </div>
          <div className="summary-item serious">
            <span className="summary-label">Serious:</span>
            <span className="summary-value">{seriousCount}</span>
          </div>
          <div className="summary-item non-compliant">
            <span className="summary-label">Non-compliant:</span>
            <span className="summary-value">{nonCompliantCount}</span>
          </div>
        </div>
      </div>

      <div className="validation-tabs">
        <button
          className={activeTab === 'input' ? 'active' : ''}
          onClick={() => setActiveTab('input')}
        >
          Input Content
        </button>
        <button
          className={activeTab === 'results' ? 'active' : ''}
          onClick={() => setActiveTab('results')}
          disabled={results.length === 0}
        >
          Validation Results
        </button>
        <button
          className={activeTab === 'report' ? 'active' : ''}
          onClick={() => setActiveTab('report')}
          disabled={results.length === 0}
        >
          Accessibility Report
        </button>
      </div>

      {activeTab === 'input' && (
        <div className="input-section">
          <div className="input-controls">
            <button
              onClick={handleValidate}
              disabled={isChecking}
              className="validate-btn"
            >
              {isChecking ? 'Validating...' : 'Validate Accessibility'}
            </button>
          </div>

          <div className="content-input">
            <label htmlFor="accessibility-content-input">Enter HTML content to validate accessibility:</label>
            <textarea
              id="accessibility-content-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your HTML content here to validate accessibility..."
              rows={12}
            />
          </div>

          <div className="validation-options">
            <h4>Validation Options:</h4>
            <div className="options-grid">
              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={validationOptions.includeAltText}
                  onChange={() => handleOptionChange('includeAltText')}
                />
                <span>Alt Text Validation</span>
              </label>

              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={validationOptions.includeHeadings}
                  onChange={() => handleOptionChange('includeHeadings')}
                />
                <span>Heading Structure</span>
              </label>

              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={validationOptions.includeLinks}
                  onChange={() => handleOptionChange('includeLinks')}
                />
                <span>Link Accessibility</span>
              </label>

              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={validationOptions.includeForms}
                  onChange={() => handleOptionChange('includeForms')}
                />
                <span>Form Fields</span>
              </label>

              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={validationOptions.includeAria}
                  onChange={() => handleOptionChange('includeAria')}
                />
                <span>ARIA Attributes</span>
              </label>

              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={validationOptions.includeKeyboard}
                  onChange={() => handleOptionChange('includeKeyboard')}
                />
                <span>Keyboard Navigation</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="results-section">
          <div className="results-controls">
            <button
              onClick={handleValidate}
              disabled={isChecking}
              className="validate-btn"
            >
              {isChecking ? 'Validating...' : 'Revalidate'}
            </button>
          </div>

          <div className="results-summary">
            <div className="result-stat total">
              <span className="stat-label">Total Issues:</span>
              <span className="stat-value">{results.length}</span>
            </div>
            <div className="result-stat critical">
              <span className="stat-label">Critical:</span>
              <span className="stat-value">{criticalCount}</span>
            </div>
            <div className="result-stat serious">
              <span className="stat-label">Serious:</span>
              <span className="stat-value">{seriousCount}</span>
            </div>
            <div className="result-stat non-compliant">
              <span className="stat-label">Non-compliant:</span>
              <span className="stat-value">{nonCompliantCount}</span>
            </div>
          </div>

          <div className="validation-results">
            {results.length === 0 ? (
              <div className="no-results">
                <p>No accessibility issues found! 🎉</p>
                <p>The content appears to be accessible.</p>
              </div>
            ) : (
              results.map((result, index) => (
                <div
                  key={result.id || index}
                  className={`result-item ${getSeverityClass(result.severity)} ${result.compliant ? 'compliant' : 'non-compliant'}`}
                >
                  <div className="result-header">
                    <span className="result-severity-icon">
                      {getSeverityIcon(result.severity)}
                    </span>
                    <span className="result-issue">{result.issue}</span>
                    <span className={`result-compliance ${result.compliant ? 'compliant' : 'non-compliant'}`}>
                      {result.compliant ? 'Best Practice' : 'Issue'}
                    </span>
                  </div>

                  <div className="result-details">
                    <div className="result-description">
                      <strong>Description:</strong> {result.description}
                    </div>

                    <div className="result-element">
                      <strong>Element:</strong> {result.element}
                    </div>

                    <div className="result-suggestions">
                      <strong>Suggestions:</strong>
                      <ul>
                        {result.suggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="report-section">
          <div className="report-content">
            <pre className="accessibility-report">
              {createAccessibilityReport(results)}
            </pre>
          </div>

          <div className="report-actions">
            <button
              onClick={() => navigator.clipboard.writeText(createAccessibilityReport(results))}
              className="copy-report-btn"
            >
              Copy Report to Clipboard
            </button>

            <button
              onClick={handleValidate}
              disabled={isChecking}
              className="validate-btn"
            >
              {isChecking ? 'Validating...' : 'Revalidate'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityValidator;