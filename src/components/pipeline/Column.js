import React from 'react';
import styled from 'styled-components';
import { Droppable } from '@hello-pangea/dnd';
import CandidateCard from './CandidateCard';

const ColumnContainer = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 220px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  padding: 8px;
`;

const CandidateList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'white')};
  flex-grow: 1;
  min-height: 100px;
`;

const Column = ({ column, candidates }) => {
  if (!Array.isArray(candidates)) {
    // Si les candidats ne sont pas un tableau (par ex. en cours de chargement ou erreur),
    // on affiche un message d'attente pour éviter le crash.
    return <p>Chargement des candidats...</p>;
  }

  return (
    <ColumnContainer>
      <Title>{column.title}</Title>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <CandidateList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {candidates.length === 0 ? (
              <p>Aucun candidat dans cette colonne.</p>
            ) : (
              candidates.map((candidate, index) => (
                <CandidateCard key={candidate.id} candidate={candidate} index={index} />
              ))
            )}
            {provided.placeholder}
          </CandidateList>
        )}
      </Droppable>
    </ColumnContainer>
  );
};

export default Column;