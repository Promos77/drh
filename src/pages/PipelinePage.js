import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Pipeline from '../components/pipeline/Pipeline';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  padding: 20px;
`;

const PipelinePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('/api/get-candidates');
        if (!response.ok) {
          throw new Error('Échec du chargement des candidats');
        }
        const data = await response.json();
        setCandidates(data);
      } catch (err) {
        setError(err.message);
        navigate('/error');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [navigate]);

  if (loading) {
    return <PageContainer>Chargement du pipeline...</PageContainer>;
  }

  if (error) {
    return <PageContainer>Erreur : {error}</PageContainer>;
  }

  return (
    <PageContainer>
      <Pipeline candidates={candidates} />
    </PageContainer>
  );
};

export default PipelinePage;
