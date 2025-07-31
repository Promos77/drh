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
        throw new Error(errorResult.error || 'Échec de l'enregistrement du candidat');
      }
      
      alert('Candidat ajouté au pipeline !');
      window.location.href = '/'; 

    } catch (error) {
      // Voici la syntaxe correcte pour console.error avec plusieurs arguments
      console.error('Erreur lors de l'ajout du candidat:', error);
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
        {skills && typeof skills === 'string' && ( // Ajout d'une sécurité
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