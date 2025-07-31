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

  const handleSaveCandidate = async () => {
    // 1. On prépare les données à envoyer au backend, en s'assurant qu'elles sont valides.
    const candidateData = {
      title: title,
      company: company || 'Non spécifié',
      location: location || null,
      url: url || null
    };

    try {
      const response = await fetch('/api/save-candidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(candidateData)
      });
      
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || 'Échec de l\'enregistrement du candidat');
      }
      
      alert('Candidat ajouté au pipeline !');

      // --- LA MODIFICATION FINALE ---
      // 2. Une fois le candidat sauvegardé avec succès, on redirige l'utilisateur
      //    vers la page du pipeline pour qu'il voie le résultat immédiatement.
      window.location.href = '/'; 
      // --- FIN DE LA MODIFICATION ---

    } catch (error) {
      console.error('Erreur lors de l\'ajout du candidat:', error);
      alert(`Erreur : ${error.message}`);
    }
  };

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
      <Button onClick={handleSaveCandidate}>Analyser et Ajouter</Button>
    </ResultCardContainer>
  );
};

export default CandidateResultCard;