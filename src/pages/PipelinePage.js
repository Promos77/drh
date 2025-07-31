import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Pipeline from '../components/pipeline/Pipeline';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const initialColumns = {
  'sourced': { id: 'sourced', title: 'Sourced', candidates: [] },
  'screening': { id: 'screening', title: 'Screening', candidates: [] },
  'interview': { id: 'interview', title: 'Interview', candidates: [] },
  'offer': { id: 'offer', title: 'Offer', candidates: [] },
  'hired': { id: 'hired', title: 'Hired', candidates: [] }
};

const PageContainer = styled.div`
  padding: 20px;
`;

const PipelinePage = () => {
  const [columns, setColumns] = useState(initialColumns);

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
        
        // Structure les candidats dans les colonnes appropriées
        const newColumns = {
          ...columns,
          'sourced': { ...columns.sourced, candidates: data.filter(c => c.status === 'sourced') },
          'screening': { ...columns.screening, candidates: data.filter(c => c.status === 'screening') },
          'interview': { ...columns.interview, candidates: data.filter(c => c.status === 'interview') },
          'offer': { ...columns.offer, candidates: data.filter(c => c.status === 'offer') },
          'hired': { ...columns.hired, candidates: data.filter(c => c.status === 'hired') }
        };
        
        setColumns(newColumns);
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
    return <PageContainer>Chargement des candidats...</PageContainer>;
  }

  if (error) {
    return <PageContainer>Erreur : {error}</PageContainer>;
  }

  return (
    <PageContainer>
      <Pipeline columns={columns} />
    </PageContainer>
  );
};

export default PipelinePage;
