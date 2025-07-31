import React from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import styled from 'styled-components';
import Column from './Column';
import axios from 'axios'; // Importez axios

const PipelineContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  gap: 20px;
`;

const Pipeline = ({ candidates, setCandidates }) => {

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

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Si l'élément est déposé en dehors d'une zone de dépôt
    if (!destination) {
      return;
    }

    // Si l'élément est déposé à la même position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumnId = source.droppableId;
    const finishColumnId = destination.droppableId;

    // Trouver le candidat déplacé
    const movedCandidate = candidates.find(c => c.id === draggableId);
    if (!movedCandidate) return;

    // Mise à jour optimiste de l'état local
    const originalCandidates = [...candidates]; // Sauvegarde l'état original pour la réversion
    const newCandidates = candidates.map(candidate =>
      candidate.id === draggableId ? { ...candidate, status: finishColumnId } : candidate
    );
    setCandidates(newCandidates);

    // Appel à l'API pour sauvegarder le changement
    try {
      await axios.put('/api/update-candidate-status', {
        id: draggableId,
        status: finishColumnId,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut du candidat:', error);
      alert('Échec de la mise à jour du statut. Annulation de l\'opération.');
      setCandidates(originalCandidates); // Revert en cas d'erreur
    }
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
