import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import Card from '../common/Card';

const UploadContainer = styled(Card)`
  margin-bottom: 20px;
  text-align: center;
`;

const Input = styled.input`
  display: block;
  margin: 10px auto;
`;

const CVUpload = ({ onAddCandidate }) => {
  const [cvFile, setCvFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setCvFile(event.target.files[0]);
  };

  const handleUpload = useCallback(async () => {
    if (!cvFile) {
      setError('Please select a CV file to upload.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('cv', cvFile);

    try {
      const response = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse CV. Please try again.');
      }

      const candidateData = await response.json();
      onAddCandidate(candidateData);
      setCvFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [cvFile, onAddCandidate]);

  return (
    <UploadContainer>
      <h2>Upload CV</h2>
      <Input type="file" accept=".pdf" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={isLoading || !cvFile}>
        {isLoading ? 'Parsing...' : 'Add Candidate'}
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </UploadContainer>
  );
};

export default CVUpload;