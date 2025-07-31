import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Pipeline from '../components/pipeline/Pipeline'; // Assurez-vous que le chemin est correct

const PipelineContainer = styled.div`
  padding: 20px;
`;

const PipelinePage = () => {
  const [candidates, setCandidates] = useState(null); // Initialiser à null pour gérer le chargement
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('/api/get-candidates');
        if (!response.ok) {
          throw new Error('Impossible de charger les candidats.');
        }
        const data = await response.json();
        setCandidates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []); // Le tableau vide [] assure que cet effet ne se lance qu'une seule fois

  // --- DÉBUT DE LA CORRECTION ---

  // 1. On affiche un message de chargement tant que l'API n'a pas répondu.
  if (isLoading) {
    return <PipelineContainer><h2>Chargement des candidats...</h2></PipelineContainer>;
  }

  // 2. On affiche un message d'erreur si l'appel API a échoué.
  if (error) {
    return <PipelineContainer><h2 style={{ color: 'red' }}>Erreur : {error}</h2></PipelineContainer>;
  }

  // 3. On affiche un message si tout a bien fonctionné mais qu'il n'y a pas encore de candidat.
  if (!candidates || candidates.length === 0) {
    return (
      <PipelineContainer>
        <h2>Pipeline de Recrutement</h2>
        <p>Aucun candidat dans le pipeline pour le moment. Commencez par en ajouter un depuis la page de recherche !</p>
      </PipelineContainer>
    );
  }

  // --- FIN DE LA CORRECTION ---

  // 4. Si tout va bien et qu'il y a des candidats, on affiche le pipeline.
  return (
    <PipelineContainer>
      <Pipeline candidates={candidates} />
    </PipelineContainer>
  );
};

export default PipelinePage;