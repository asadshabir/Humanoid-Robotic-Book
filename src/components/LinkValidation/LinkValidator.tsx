import React, { useState, useEffect } from 'react';
import { validateLinks, extractLinks, createValidationReport, LinkValidationResult } from '../../utils/linkValidation';

interface LinkValidatorProps {
  initialContent?: string;
  onValidationComplete?: (results: LinkValidationResult[], report: string) => void;
}

const LinkValidator: React.FC<LinkValidatorProps> = ({
  initialContent = '',
  onValidationComplete
}) => {
  const [content, setContent] = useState<string>(initialContent);
  const [links, setLinks] = useState<string[]>([]);
  const [results, setResults] = useState<LinkValidationResult[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'input' | 'results' | 'report'>('input');
  const [validationOptions, setValidationOptions] = useState({
    timeout: 10000,
    maxConcurrent: 5,
    excludePatterns: [] as string[]
  });

  useEffect(() => {
    const extracted = extractLinks(content);
    setLinks(extracted);
  }, [content]);

  const handleValidate = async () => {
    if (links.length === 0) {
      alert('No links found to validate');
      return;
    }

    setIsChecking(true);
    try {
      const validationResults = await validateLinks(links, validationOptions);
      setResults(validationResults);

      const report = createValidationReport(validationResults);

      if (onValidationComplete) {
        onValidationComplete(validationResults, report);
      }
    } catch (error) {
      console.error('Error validating links:', error);
      alert('Error occurred during link validation');
    } finally {
      setIsChecking(false);
      setActiveTab('results');
    }
  };

  const handleAddExcludePattern = () => {
    setValidationOptions({
      ...validationOptions,
      excludePatterns: [...validationOptions.excludePatterns, '']
    });
  };

  const handleExcludePatternChange = (index: number, value: string) => {
    const newPatterns = [...validationOptions.excludePatterns];
    newPatterns[index] = value;
    setValidationOptions({
      ...validationOptions,
      excludePatterns: newPatterns
    });
  };

  const handleRemoveExcludePattern = (index: number) => {
    const newPatterns = validationOptions.excludePatterns.filter((_, i) => i !== index);
    setValidationOptions({
      ...validationOptions,
      excludePatterns: newPatterns
    });
  };

  const validCount = results.filter(r => r.isValid).length;
  const invalidCount = results.length - validCount;

  return (
    <div className="link-validator-container">
      <div className="link-validator-header">
        <h3>Link Validator</h3>
        <div className="validation-summary">
          <div className="summary-item">
            <span className="summary-label">Total:</span>
            <span className="summary-value">{links.length}</span>
          </div>
          <div className="summary-item valid">
            <span className="summary-label">Valid:</span>
            <span className="summary-value">{validCount}</span>
          </div>
          <div className="summary-item invalid">
            <span className="summary-label">Invalid:</span>
            <span className="summary-value">{invalidCount}</span>
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
          Validation Report
        </button>
      </div>

      {activeTab === 'input' && (
        <div className="input-section">
          <div className="input-controls">
            <button
              onClick={handleValidate}
              disabled={isChecking || links.length === 0}
              className="validate-btn"
            >
              {isChecking ? 'Validating...' : 'Validate Links'}
            </button>
          </div>

          <div className="content-input">
            <label htmlFor="content-input">Enter content to extract and validate links:</label>
            <textarea
              id="content-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your markdown content here to extract and validate links..."
              rows={10}
            />
          </div>

          <div className="validation-options">
            <h4>Validation Options:</h4>

            <div className="option-group">
              <label>
                Timeout (ms):
                <input
                  type="number"
                  value={validationOptions.timeout}
                  onChange={(e) => setValidationOptions({
                    ...validationOptions,
                    timeout: parseInt(e.target.value) || 10000
                  })}
                  min="1000"
                  max="30000"
                />
              </label>
            </div>

            <div className="option-group">
              <label>
                Max Concurrent Requests:
                <input
                  type="number"
                  value={validationOptions.maxConcurrent}
                  onChange={(e) => setValidationOptions({
                    ...validationOptions,
                    maxConcurrent: parseInt(e.target.value) || 5
                  })}
                  min="1"
                  max="20"
                />
              </label>
            </div>

            <div className="option-group">
              <div className="exclude-patterns-header">
                <h5>Exclude Patterns:</h5>
                <button onClick={handleAddExcludePattern} className="add-pattern-btn">
                  Add Pattern
                </button>
              </div>

              {validationOptions.excludePatterns.map((pattern, index) => (
                <div key={index} className="exclude-pattern-row">
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => handleExcludePatternChange(index, e.target.value)}
                    placeholder="URL pattern to exclude"
                  />
                  <button
                    onClick={() => handleRemoveExcludePattern(index)}
                    className="remove-pattern-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {links.length > 0 && (
            <div className="extracted-links">
              <h4>Extracted Links ({links.length}):</h4>
              <div className="links-list">
                {links.map((link, index) => (
                  <div key={index} className="link-item">
                    <span className="link-url">{link}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              {isChecking ? 'Validating...' : 'Revalidate Links'}
            </button>
          </div>

          <div className="results-summary">
            <div className="result-stat">
              <span className="stat-label">Total Checked:</span>
              <span className="stat-value">{results.length}</span>
            </div>
            <div className="result-stat valid">
              <span className="stat-label">Valid:</span>
              <span className="stat-value">{validCount}</span>
            </div>
            <div className="result-stat invalid">
              <span className="stat-label">Invalid:</span>
              <span className="stat-value">{invalidCount}</span>
            </div>
          </div>

          <div className="validation-results">
            {results.map((result, index) => (
              <div
                key={index}
                className={`result-item ${result.isValid ? 'valid' : 'invalid'}`}
              >
                <div className="result-header">
                  <span className={`result-status ${result.isValid ? 'valid' : 'invalid'}`}>
                    {result.isValid ? '✓' : '✗'}
                  </span>
                  <span className="result-url">{result.url}</span>
                  <span className={`result-type ${result.isExternal ? 'external' : 'internal'}`}>
                    {result.isExternal ? 'External' : 'Internal'}
                  </span>
                </div>

                <div className="result-details">
                  {result.status && (
                    <div className="result-status-code">
                      Status: {result.status}
                    </div>
                  )}

                  {result.error && (
                    <div className="result-error">
                      Error: {result.error}
                    </div>
                  )}

                  <div className="result-timestamp">
                    Checked: {result.lastChecked.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="report-section">
          <div className="report-content">
            <pre className="validation-report">
              {createValidationReport(results)}
            </pre>
          </div>

          <div className="report-actions">
            <button
              onClick={() => navigator.clipboard.writeText(createValidationReport(results))}
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

export default LinkValidator;