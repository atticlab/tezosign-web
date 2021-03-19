import React from 'react';
import { Title, Text } from '../components/styled/Text';
import Card from '../components/styled/Card';

const NotFound = () => (
  <section>
    <Card style={{ maxWidth: '732px', margin: '0 auto' }}>
      <Card.Body>
        <Title>404: Not Found</Title>
        <Text>The page you are looking for is not found.</Text>
      </Card.Body>
    </Card>
  </section>
);

export default NotFound;
