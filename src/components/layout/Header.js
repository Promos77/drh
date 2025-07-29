import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: var(--primary-color);
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.8rem;
`;

const NavLinks = styled.nav`
  margin-top: 10px;

  a {
    color: white;
    margin: 0 15px;
    text-decoration: none;
    font-size: 1.1rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Title>Agiscom RH - Pipeline de Recrutement</Title>
      <NavLinks>
        <Link to="/">Pipeline</Link>
        <Link to="/search">Recherche</Link>
      </NavLinks>
    </HeaderContainer>
  );
};

export default Header;