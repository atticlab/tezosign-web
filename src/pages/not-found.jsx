import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Title, Text } from '../components/styled/Text';
import Card from '../components/styled/Card';

const NotFound = () => {
  const history = useHistory();

  return (
    <section>
      <Card style={{ maxWidth: '732px', margin: '0 auto' }}>
        <Card.Body>
          <Title>404: Not Found</Title>
          <Text>The page you are looking for is not found.</Text>
          <Button as={Link} to="/" style={{ marginRight: '10px' }}>
            Home
          </Button>

          <Button onClick={() => history.goBack()}>Go back</Button>
        </Card.Body>
      </Card>
    </section>
  );
};

export default NotFound;
