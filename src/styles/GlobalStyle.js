import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

  :root {
    --primary-color: #0095A9; /* Le bleu/vert d'Agiscom */
    --background-color: #1a202c; /* Un bleu nuit très sombre */
    --card-background: #2d3748; /* Un gris-bleu pour les cartes */
    --text-primary: #edf2f7; /* Un blanc cassé pour le texte */
    --text-secondary: #a0aec0; /* Un gris clair pour les détails */
    --border-color: #4a5568;
  }

  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: var(--background-color);
    color: var(--text-primary);
    height: 100vh;
    width: 100vw;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
  }
`;

export default GlobalStyle;
