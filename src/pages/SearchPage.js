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
  // Les états pour les champs du formulaire restent les mêmes
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

    // --- DÉBUT DE LA CORRECTION ---

    // 1. On combine les champs de texte en une seule chaîne de recherche puissante.
    //    Le .filter(Boolean) supprime les champs vides.
    const searchParts = [keywords, skills, location].filter(Boolean);
    const fullQuery = searchParts.join(' '); // ex: "électricien react paris"

    // 2. On construit les paramètres de l'URL.
    //    On utilise 'query' comme nom de paramètre, comme le backend l'attend.
    const queryParams = new URLSearchParams({
      query: fullQuery,
      // On pourrait ajouter minExperience et maxExperience ici si le backend les gérait
    }).toString();

    // --- FIN DE LA CORRECTION ---

    try {
      // On utilise l'URL construite correctement
      const response = await fetch(`/api/search?${queryParams}`);
      if (!response.ok) {
        // On essaie de lire le message d'erreur du serveur pour plus de détails
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch search results.');
      }
      const data = await response.json();
      // On s'assure que data.jobs_results existe avant de le mettre dans le state
      setSearchResults(data.jobs_results || []);
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
        {/* Le reste du formulaire est parfait et n'a pas besoin de changer */}
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

      {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}

      {/* J'ai aussi corrigé ici pour mapper sur searchResults, qui est un tableau */}
      {searchResults.length > 0 && (
        <div>
          <h3>Résultats de Recherche</h3>
          {searchResults.map((candidate, index) => (
            <CandidateResultCard 
              key={candidate.job_id || index} // Utilise un ID unique si disponible
              title={candidate.title} 
              company={candidate.company_name} 
              location={candidate.location} 
              url={candidate.related_links?.[0]?.link} // Prend le premier lien pertinent
            />
          ))}
        </div>
      )}
    </SearchContainer>
  );
};

export default SearchPage;