import React, { useCallback } from 'react';
import styled from 'styled-components';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import CVUpload from './CVUpload';
import { v4 as uuidv4 } from 'uuid';


const PipelineContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const Pipeline = ({ columns, setColumns }) => {

  const handleAddCandidate = useCallback(async (candidateData) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const newCandidate = { id: uuidv4(), ...candidateData };
    
    try {
      const response = await fetch('/api/save-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCandidate),
      });
      
      if (!response.ok) {
throw new Error("Échec de l'enregistrement du candidat");
      }
      
      setColumns((prevColumns) => ({
        ...prevColumns,
        'sourced': {
          ...prevColumns['sourced'],
          candidates: [...prevColumns['sourced'].candidates, newCandidate],
        },
      }));
    } catch (err) {
console.error("Erreur lors de l'enregistrement:", err);
      // Gestion de l'erreur (notification utilisateur, rollback, etc.)
    }
  }, [setColumns]);

  const onDragEnd = async (result) => {
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

      // Envoie la mise à jour au backend
      try {
        const response = await fetch('/api/save-candidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: removed.id,
            status: destination.droppableId
          }),
        });

        if (!response.ok) {
          throw new Error('Échec de la mise à jour du candidat');
        }
      } catch (err) {
        console.error('Erreur lors de la mise à jour:', err);
        // Réinitialise l'état en cas d'échec
        setColumns({
          ...columns,
          [startColumn.id]: startColumn,
          [endColumn.id]: endColumn,
        });
      }
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
