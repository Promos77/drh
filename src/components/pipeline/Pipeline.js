import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import CVUpload from './CVUpload';
import { v4 as uuidv4 } from 'uuid';

const initialColumns = {
  'sourced': {
    id: 'sourced',
    title: 'Sourced',
    candidates: [],
  },
  'screening': {
    id: 'screening',
    title: 'Screening',
    candidates: [],
  },
  'interview': {
    id: 'interview',
    title: 'Interview',
    candidates: [],
  },
  'offer': {
    id: 'offer',
    title: 'Offer',
    candidates: [],
  },
  'hired': {
    id: 'hired',
    title: 'Hired',
    candidates: [],
  },
};

const PipelineContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const Pipeline = () => {
  const [columns, setColumns] = useState(initialColumns);

  const handleAddCandidate = useCallback((candidateData) => {
    const newCandidate = { id: uuidv4(), ...candidateData };
    setColumns((prevColumns) => ({
      ...prevColumns,
      'sourced': {
        ...prevColumns['sourced'],
        candidates: [...prevColumns['sourced'].candidates, newCandidate],
      },
    }));
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const startColumn = columns[source.droppableId];
    const endColumn = columns[destination.droppableId];

    if (startColumn === endColumn) {
      const newCandidates = Array.from(startColumn.candidates);
      const [removed] = newCandidates.splice(source.index, 1);
      newCandidates.splice(destination.index, 0, removed);

      const newColumn = {
        ...startColumn,
        candidates: newCandidates,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
    } else {
      const startCandidates = Array.from(startColumn.candidates);
      const [removed] = startCandidates.splice(source.index, 1);
      const newStartColumn = {
        ...startColumn,
        candidates: startCandidates,
      };

      const endCandidates = Array.from(endColumn.candidates);
      endCandidates.splice(destination.index, 0, removed);
      const newEndColumn = {
        ...endColumn,
        candidates: endCandidates,
      };

      setColumns({
        ...columns,
        [newStartColumn.id]: newStartColumn,
        [newEndColumn.id]: newEndColumn,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <CVUpload onAddCandidate={handleAddCandidate} />
      <PipelineContainer>
        {Object.values(columns).map((column) => (
          <Column key={column.id} column={column} candidates={column.candidates} />
        ))}
      </PipelineContainer>
    </DragDropContext>
  );
};

export default Pipeline;