import React, { useState, useEffect } from 'react';
import { validateAPACitation, validateInTextCitation, validateCitationList, generateAPACitationString } from '../../utils/citationValidation';

interface CitationValidatorProps {
  initialCitations?: any[];
  onValidationComplete?: (isValid: boolean, errors: string[]) => void;
}

const CitationValidator: React.FC<CitationValidatorProps> = ({
  initialCitations = [],
  onValidationComplete
}) => {
  const [citations, setCitations] = useState<any[]>(initialCitations);
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [overallValidation, setOverallValidation] = useState<{ isValid: boolean; errors: string[] } | null>(null);
  const [activeTab, setActiveTab] = useState<'results' | 'format'>('results');

  useEffect(() => {
    if (citations.length > 0) {
      // Validate each citation individually
      const results = citations.map(citation => validateAPACitation(citation));
      setValidationResults(results);

      // Validate the entire list
      const listValidation = validateCitationList(citations);
      setOverallValidation(listValidation);

      // Call the callback if provided
      if (onValidationComplete) {
        onValidationComplete(listValidation.isValid, listValidation.errors);
      }
    }
  }, [citations, onValidationComplete]);

  const handleCitationChange = (index: number, field: string, value: any) => {
    const updatedCitations = [...citations];
    updatedCitations[index] = { ...updatedCitations[index], [field]: value };
    setCitations(updatedCitations);
  };

  const addCitation = () => {
    setCitations([
      ...citations,
      {
        type: 'book',
        title: '',
        authors: [{ firstName: '', lastName: '', middleInitial: '' }],
        year: new Date().getFullYear(),
      }
    ]);
  };

  const removeCitation = (index: number) => {
    const updatedCitations = citations.filter((_, i) => i !== index);
    setCitations(updatedCitations);
  };

  const addAuthor = (citationIndex: number) => {
    const updatedCitations = [...citations];
    updatedCitations[citationIndex].authors = [
      ...updatedCitations[citationIndex].authors,
      { firstName: '', lastName: '', middleInitial: '' }
    ];
    setCitations(updatedCitations);
  };

  const updateAuthor = (citationIndex: number, authorIndex: number, field: string, value: string) => {
    const updatedCitations = [...citations];
    updatedCitations[citationIndex].authors[authorIndex] = {
      ...updatedCitations[citationIndex].authors[authorIndex],
      [field]: value
    };
    setCitations(updatedCitations);
  };

  return (
    <div className="citation-validator-container">
      <div className="citation-validator-header">
        <h3>Citation Validator</h3>
        <div className="validation-summary">
          {overallValidation && (
            <div className={`validation-status ${overallValidation.isValid ? 'valid' : 'invalid'}`}>
              <strong>Status:</strong> {overallValidation.isValid ? '✓ Valid' : '✗ Invalid'}
              {!overallValidation.isValid && (
                <span> ({overallValidation.errors.length} error{overallValidation.errors.length !== 1 ? 's' : ''})</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="citation-validator-controls">
        <button onClick={addCitation} className="add-citation-btn">
          Add Citation
        </button>

        <div className="validation-tabs">
          <button
            className={activeTab === 'results' ? 'active' : ''}
            onClick={() => setActiveTab('results')}
          >
            Validation Results
          </button>
          <button
            className={activeTab === 'format' ? 'active' : ''}
            onClick={() => setActiveTab('format')}
          >
            APA Format
          </button>
        </div>
      </div>

      <div className="citation-entries">
        {citations.map((citation, citationIndex) => (
          <div key={citationIndex} className="citation-entry">
            <div className="citation-header">
              <h4>Citation {citationIndex + 1}</h4>
              <button
                onClick={() => removeCitation(citationIndex)}
                className="remove-citation-btn"
                title="Remove citation"
              >
                ×
              </button>
            </div>

            <div className="citation-form">
              <div className="form-row">
                <label>
                  Type:
                  <select
                    value={citation.type}
                    onChange={(e) => handleCitationChange(citationIndex, 'type', e.target.value)}
                  >
                    <option value="book">Book</option>
                    <option value="journal">Journal Article</option>
                    <option value="webpage">Web Page</option>
                    <option value="conference">Conference Paper</option>
                    <option value="thesis">Thesis/Dissertation</option>
                    <option value="report">Report</option>
                    <option value="video">Video</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label>
                  Year:
                  <input
                    type="number"
                    value={citation.year}
                    onChange={(e) => handleCitationChange(citationIndex, 'year', parseInt(e.target.value))}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                </label>
              </div>

              <label>
                Title:
                <input
                  type="text"
                  value={citation.title || ''}
                  onChange={(e) => handleCitationChange(citationIndex, 'title', e.target.value)}
                  placeholder="Enter title"
                />
              </label>

              <div className="authors-section">
                <div className="section-header">
                  <h5>Authors</h5>
                  <button
                    onClick={() => addAuthor(citationIndex)}
                    className="add-author-btn"
                  >
                    Add Author
                  </button>
                </div>

                {citation.authors.map((author: any, authorIndex: number) => (
                  <div key={authorIndex} className="author-entry">
                    <label>
                      First Name:
                      <input
                        type="text"
                        value={author.firstName || ''}
                        onChange={(e) => updateAuthor(citationIndex, authorIndex, 'firstName', e.target.value)}
                        placeholder="First"
                      />
                    </label>

                    <label>
                      Middle Initial:
                      <input
                        type="text"
                        value={author.middleInitial || ''}
                        onChange={(e) => updateAuthor(citationIndex, authorIndex, 'middleInitial', e.target.value)}
                        placeholder="MI"
                        maxLength={1}
                      />
                    </label>

                    <label>
                      Last Name:
                      <input
                        type="text"
                        value={author.lastName || ''}
                        onChange={(e) => updateAuthor(citationIndex, authorIndex, 'lastName', e.target.value)}
                        placeholder="Last"
                      />
                    </label>
                  </div>
                ))}
              </div>

              {(citation.type === 'journal' || citation.type === 'conference') && (
                <>
                  <label>
                    Journal/Conference Name:
                    <input
                      type="text"
                      value={citation.journal || ''}
                      onChange={(e) => handleCitationChange(citationIndex, 'journal', e.target.value)}
                      placeholder="Journal or conference name"
                    />
                  </label>

                  <div className="form-row">
                    <label>
                      Volume:
                      <input
                        type="text"
                        value={citation.volume || ''}
                        onChange={(e) => handleCitationChange(citationIndex, 'volume', e.target.value)}
                        placeholder="Volume"
                      />
                    </label>

                    <label>
                      Issue:
                      <input
                        type="text"
                        value={citation.issue || ''}
                        onChange={(e) => handleCitationChange(citationIndex, 'issue', e.target.value)}
                        placeholder="Issue"
                      />
                    </label>

                    <label>
                      Pages:
                      <input
                        type="text"
                        value={citation.pages || ''}
                        onChange={(e) => handleCitationChange(citationIndex, 'pages', e.target.value)}
                        placeholder="e.g., 123-145"
                      />
                    </label>
                  </div>
                </>
              )}

              {citation.type === 'webpage' && (
                <>
                  <label>
                    URL:
                    <input
                      type="text"
                      value={citation.url || ''}
                      onChange={(e) => handleCitationChange(citationIndex, 'url', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </label>

                  <label>
                    Accessed Date (YYYY-MM-DD):
                    <input
                      type="text"
                      value={citation.accessedDate || ''}
                      onChange={(e) => handleCitationChange(citationIndex, 'accessedDate', e.target.value)}
                      placeholder="YYYY-MM-DD"
                    />
                  </label>
                </>
              )}

              {(citation.type === 'book' || citation.type === 'thesis' || citation.type === 'report') && (
                <label>
                  Publisher/Institution:
                  <input
                    type="text"
                    value={citation.publisher || citation.institution || ''}
                    onChange={(e) => {
                      if (citation.type === 'thesis' || citation.type === 'report') {
                        handleCitationChange(citationIndex, 'institution', e.target.value);
                      } else {
                        handleCitationChange(citationIndex, 'publisher', e.target.value);
                      }
                    }}
                    placeholder="Publisher or institution"
                  />
                </label>
              )}

              <label>
                DOI:
                <input
                  type="text"
                  value={citation.doi || ''}
                  onChange={(e) => handleCitationChange(citationIndex, 'doi', e.target.value)}
                  placeholder="10.xxxx/xxxxx"
                />
              </label>
            </div>

            {validationResults[citationIndex] && (
              <div className={`validation-result ${validationResults[citationIndex].isValid ? 'valid' : 'invalid'}`}>
                <h5>Validation Result:</h5>
                {validationResults[citationIndex].isValid ? (
                  <div className="validation-success">✓ Citation is valid</div>
                ) : (
                  <div className="validation-errors">
                    <div className="validation-error-count">
                      {validationResults[citationIndex].errors.length} error{validationResults[citationIndex].errors.length !== 1 ? 's' : ''}:
                    </div>
                    <ul>
                      {validationResults[citationIndex].errors.map((error, idx) => (
                        <li key={idx} className="validation-error-item">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'format' && (
              <div className="apa-format-preview">
                <h5>APA 7 Format Preview:</h5>
                <div className="apa-citation">
                  {generateAPACitationString(citation)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {overallValidation && overallValidation.errors.length > 0 && activeTab === 'results' && (
        <div className="overall-validation-errors">
          <h4>Overall Validation Errors:</h4>
          <ul>
            {overallValidation.errors.map((error, idx) => (
              <li key={idx} className="overall-error-item">{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CitationValidator;