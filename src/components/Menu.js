import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <Navbar expand="lg" className="bg-primary text-white">
      <Container>
        
        <Navbar.Brand as={Link} to="/" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>

          <img 
            src="https://logosandtypes.com/wp-content/uploads/2020/07/grupo-mateus.svg" 
            alt="Logo" 
            style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '30px' }}
          />
          <span style={{ marginLeft: '40px', fontWeight:700 }}>Fabrica Mateus</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Fabricantes</Nav.Link>
            <Nav.Link as={Link} to="/produto">Produto</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Menu;
