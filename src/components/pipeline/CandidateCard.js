import React from 'react';
import styled from 'styled-components';
import { Draggable } from '@hello-pangea/dnd';

const CardContainer = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
`;

const CandidateCard = ({ candidate, index }) => {
  return (
    <Draggable draggableId={candidate.id} index={index}>
      {(provided, snapshot) => (
        <CardContainer
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {candidate.name}
        </CardContainer>
      )}
    </Draggable>
  );
};

export default CandidateCard;