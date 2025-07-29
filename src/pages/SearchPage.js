import React, { useState } from 'react';
import styled from 'styled-components';
import Card from '../components/common/Card';
import CandidateResultCard from '../components/CandidateResultCard';
import Button from '../components/common/Button';

const SearchContainer = styled(Card)`
  margin-bottom: 20px;
  padding: 20px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const ButtonContainer = styled.div`
  grid-column: span 2;
  text-align: center;
`;

const SearchPage = () => {
  const [keywords, setKeywords] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [maxExperience, setMaxExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSearchResults([]);

    const queryParams = new URLSearchParams({
      keywords,
      skills,
      location,
      minExperience,
      maxExperience,
    }).toString();

    try {
      const response = await fetch(`/api/search?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results.');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SearchContainer>
      <h2>Recherche de Candidats</h2>
      <Form onSubmit={handleSearch}>
        <FormGroup>
          <Label htmlFor="keywords">Mots-clés / Métier</Label>
          <Input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="ex: Développeur, Chef de projet"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="skills">Compétences</Label>
          <Input
            type="text"
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="ex: Python, React, Gestion de projet"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="location">Localisation</Label>
          <Input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="ex: Paris, Lyon"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="minExperience">Années d'expérience (Min)</Label>
          <Input
            type="number"
            id="minExperience"
            value={minExperience}
            onChange={(e) => setMinExperience(e.target.value)}
            min="0"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="maxExperience">Années d'expérience (Max)</Label>
          <Input
            type="number"
            id="maxExperience"
            value={maxExperience}
            onChange={(e) => setMaxExperience(e.target.value)}
            min="0"
          />
        </FormGroup>
        <ButtonContainer>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Recherche en cours...' : 'Rechercher'}
          </Button>
        </ButtonContainer>
      </Form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {searchResults.length > 0 && (
        <div>
          <h3>Résultats de Recherche</h3>
          {searchResults.map((candidate) => (
            <CandidateResultCard 
              key={candidate.id} 
              title={candidate.jobTitle} 
              company={candidate.company} 
              location={candidate.location} 
              url={candidate.url} 
            />
          ))}
        </div>
      )}
    </SearchContainer>
  );
};

export default SearchPage;