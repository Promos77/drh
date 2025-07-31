import React, { useState } from 'react';
import styled from 'styled-components';
import { Draggable } from '@hello-pangea/dnd';
import Modal from '../common/Modal'; // Importez le composant Modal

const CardContainer = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
  color: #333; /* AJOUTE CETTE LIGNE POUR UN TEXTE SOMBRE */
  cursor: pointer; /* Indique que la carte est cliquable */

  h4,
  p {
    color: #333; /* Assure que les titres et paragraphes sont sombres */
  }
`;

const CandidateCard = ({ candidate, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [notes, setNotes] = useState(candidate.notes || '');

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    // Réinitialiser les résultats de l'analyse et le fichier sélectionné à la fermeture de la modale
    if (isModalOpen) {
      setSelectedFile(null);
      setAnalysisResult(null);
      setNotes(candidate.notes || ''); // Réinitialiser les notes
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAnalyzeCV = async () => {
    if (!selectedFile) {
      alert('Veuillez sélectionner un fichier CV (PDF).');
      return;
    }

    const formData = new FormData();
    formData.append('cv', selectedFile);

    try {
      const response = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Échec de l\'analyse du CV.');
      }

      const result = await response.json();
      setAnalysisResult(result);
      alert('Analyse du CV terminée !');
    } catch (error) {
      console.error('Erreur lors de l\'analyse du CV:', error);
      alert(`Erreur: ${error.message}`);
      setAnalysisResult(null);
    }
  };

  const handleSaveDetails = async () => {
    try {
      const response = await fetch('/api/update-candidate-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: candidate.id,
          summary: analysisResult ? analysisResult.summary : candidate.summary,
          parsed_data: analysisResult || candidate.parsed_data, // Sauvegarde les données analysées
          notes: notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Échec de la sauvegarde des détails.');
      }

      alert('Détails du candidat sauvegardés avec succès !');
      // Optionnel: Mettre à jour l'état du candidat dans le pipeline si nécessaire
      // setCandidates(prevCandidates => prevCandidates.map(c => c.id === candidate.id ? { ...c, summary: analysisResult.summary, notes: notes } : c));
      toggleModal(); // Ferme la modale après sauvegarde
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des détails:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  return (
    <>
      <Draggable draggableId={candidate.id} index={index}>
        {(provided, snapshot) => (
          <CardContainer
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            onClick={toggleModal} // Ouvre la modale au clic
          >
            <h4>{candidate.title}</h4>
            <p>{candidate.company} - {candidate.location}</p>
            {candidate.skills && <p>Compétences: {candidate.skills}</p>}
            {candidate.experience && <p>Expérience: {candidate.experience} ans</p>}
          </CardContainer>
        )}
      </Draggable>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <h2>Détails du Candidat</h2>
        <p><strong>Titre:</strong> {candidate.title}</p>
        <p><strong>Entreprise:</strong> {candidate.company}</p>
        <p><strong>Localisation:</strong> {candidate.location}</p>
        {candidate.url && <p><strong>URL:</strong> <a href={candidate.url} target="_blank" rel="noopener noreferrer">{candidate.url}</a></p>}
        {candidate.skills && <p><strong>Compétences:</strong> {candidate.skills}</p>}
        {candidate.experience && <p><strong>Expérience:</strong> {candidate.experience} ans</p>}

        {/* Section Analyse de CV */}
        <h3>Analyse de CV</h3>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button onClick={handleAnalyzeCV}>Lancer l'analyse</button>

        {analysisResult && (
          <div>
            <h4>Résultat de l'analyse Gemini:</h4>
            <p><strong>Nom:</strong> {analysisResult.name}</p>
            <p><strong>Email:</strong> {analysisResult.email}</p>
            <p><strong>Téléphone:</strong> {analysisResult.phone}</p>
            <p><strong>Résumé:</strong> {analysisResult.summary}</p>
            <p><strong>Compétences:</strong> {analysisResult.skills ? analysisResult.skills.join(', ') : 'N/A'}</p>
            <p><strong>Années d'expérience:</strong> {analysisResult.experience_years}</p>
            <p><strong>Éducation:</strong> {analysisResult.education}</p>
          </div>
        )}

        {/* Section Notes */}
        <h3>Notes</h3>
        <textarea
          rows="5"
          cols="50"
          placeholder="Ajouter des notes ici..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
        <button onClick={handleSaveDetails}>Sauvegarder les détails</button>
      </Modal>
    </>
  );
};

export default CandidateCard;
