import React from 'react';
import styled from 'styled-components';
import Card from './common/Card';
import Button from './common/Button';

const ResultCardContainer = styled(Card)`
  margin-bottom: 15px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoContainer = styled.div`
  flex-grow: 1;
`;

const Title = styled.h4`
  margin: 0 0 5px 0;
`;

const Details = styled.p`
  margin: 0;
  color: #555;
`;

const SkillsContainer = styled.div`
  margin-top: 8px;
`;

const SkillTag = styled.span`
  display: inline-block;
  background: #e0e0e0;
  border-radius: 4px;
  padding: 2px 6px;
  margin-right: 4px;
  font-size: 0.8rem;
`;

const Experience = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 0.9rem;
`;

const CandidateResultCard = ({ title, company, location, url, skills, experience }) => {
  // --- DÉBUT DE LA CORRECTION ---

  const handleSaveCandidate = async () => {
    // 1. On prépare les données à envoyer au backend.
    //    On s'assure que les noms correspondent à ce que l'API '/api/save-candidate' attend.
    const candidateData = {
      title: title, // Le backend attend 'title'
      company: company || 'Non spécifié', // SÉCURITÉ : Si 'company' est vide, on met une valeur par défaut.
      location: location || null, // On envoie null si la localisation est vide
      url: url || null // On envoie null si l'URL est vide
    };

    try {
      const response = await fetch('/api/save-candidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(candidateData)
      });
      
      // 2. On améliore la gestion des erreurs pour afficher le message du backend.
      if (!response.ok) {
        const errorResult = await response.json();
        // On lance une erreur avec le message précis renvoyé par l'API
        throw new Error(errorResult.error || 'Échec de l\'enregistrement du candidat');
      }
      
      alert('Candidat ajouté au pipeline !');

    } catch (error) {
      console.error('Erreur lors de l\'ajout du candidat:', error);
      // On affiche l'erreur précise à l'utilisateur
      alert(`Erreur : ${error.message}`);
    }
  };

  // --- FIN DE LA CORRECTION ---

  return (
    <ResultCardContainer>
      <InfoContainer>
        <Title>{title}</Title>
        <Details>
          {company} - {location}
        </Details>
        {experience && <Experience>{experience} ans d'expérience</Experience>}
        {skills && (
          <SkillsContainer>
            {skills.split(',').map((skill, index) => (
              <SkillTag key={index}>{skill.trim()}</SkillTag>
            ))}
          </SkillsContainer>
        )}
      </InfoContainer>
      {/* On s'assure que le bouton appelle bien la nouvelle fonction corrigée */}
      <Button onClick={handleSaveCandidate}>Analyser et Ajouter</Button>
    </ResultCardContainer>
  );
};

export default CandidateResultCard;