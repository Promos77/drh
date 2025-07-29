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
  const handleAnalyze = () => {
    console.log('Analyse demandée pour :', url);
    // Envoyer les données du candidat au pipeline Kanban
    const candidateData = {
      id: `candidate-${Date.now()}`,
      name: title,
      company,
      location,
      skills,
      experience
    };
    
    // TODO: Implémenter l'appel API pour ajouter au pipeline
    console.log('Données du candidat à ajouter:', candidateData);
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
      <Button onClick={handleAnalyze}>Analyser et Ajouter</Button>
    </ResultCardContainer>
  );
};

export default CandidateResultCard;