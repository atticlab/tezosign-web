import React from 'react';
import Title from '../components/styled/Title';
import { Text } from '../components/styled/Text';

const NotFound = () => (
  <section style={{ textAlign: 'center' }}>
    <Title>404: Not Found</Title>
    <Text>The page you are looking for is not found.</Text>
  </section>
);

export default NotFound;
