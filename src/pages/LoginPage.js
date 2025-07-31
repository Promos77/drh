import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: var(--background-color);
`;

const LoginCard = styled.form`
  background-color: var(--card-background);
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--border-color);
`;

const Title = styled.h2`
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  color: var(--text-primary);
  font-size: 16px;

  &::placeholder {
    color: var(--text-secondary);
  }
`;

const Button = styled.button`
  padding: 12px;
  border-radius: 4px;
  border: none;
  background-color: var(--primary-color);
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const ErrorMessage = styled.p`
  color: #e53e3e; /* Un rouge pour les erreurs */
  text-align: center;
  font-size: 14px;
`;

const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      navigate('/');
    } else {
      setError('Mot de passe incorrect');
    }
  };

  return (
    <LoginContainer>
      <LoginCard onSubmit={handleSubmit}>
        <Title>Accès Recruteur</Title>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
        />
        <Button type="submit">Connexion</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
