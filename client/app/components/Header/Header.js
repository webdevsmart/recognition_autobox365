import React from 'react';

import { Link } from 'react-router-dom';
import { Container, Row, Col} from 'react-bootstrap';
// import './Header.scss';

const Header = () => (
  <header className="pt-5 mb-5">
    <Container>
      <Row>
        <Col>
        <Link to="/">
          <img
            src="/assets/img/logo.png"
            width="200"
            className="d-inline-block align-top"
          />
        </Link>
        </Col>
      </Row>
    </Container>
  </header>
);

export default Header;
