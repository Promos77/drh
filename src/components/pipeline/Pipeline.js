import React from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import styled from 'styled-components';
import Column from './Column';

const PipelineContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  gap: 20px;
`;

const Pipeline = ({ candidates, setCandidates }) => { // Assurez-vous de recevoir setCandidates si vous gérez le drag-and-drop

  // --- DÉBUT DE LA CORRECTION FINALE ---

  // CLAUSE DE SÉCURITÉ : C'est la ligne la plus importante.
  // Si 'candidates' n'est pas un tableau (parce qu'il est en cours de chargement ou qu'il y a eu une erreur),
  // on n'affiche rien du tout pour éviter le crash.
  if (!Array.isArray(candidates)) {
    return null; // ou <p>Chargement...</p>
  }

  // --- FIN DE LA CORRECTION FINALE ---

  // On organise les candidats par statut
  const columns = {
    Sourced: { id: 'Sourced', title: 'Sourced', candidateIds: [] },
    Screening: { id: 'Screening', title: 'Screening', candidateIds: [] },
    Interview: { id: 'Interview', title: 'Interview', candidateIds: [] },
    Offer: { id: 'Offer', title: 'Offer', candidateIds: [] },
    Hired: { id: 'Hired', title: 'Hired', candidateIds: [] },
  };

  // On remplit les colonnes avec les candidats
  candidates.forEach(candidate => {
    if (columns[candidate.status]) {
      columns[candidate.status].candidateIds.push(candidate);
    }
  });

  const onDragEnd = (result) => {
    // Logique pour gérer le déplacement des cartes (à implémenter plus tard si besoin)
    console.log('Drag ended:', result);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <PipelineContainer>
        {Object.values(columns).map(column => (
          <Column key={column.id} column={column} candidates={column.candidateIds} />
        ))}
      </PipelineContainer>
    </DragDropContext>
  );
};

export default Pipeline;
