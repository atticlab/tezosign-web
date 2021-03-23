import React from 'react';
// eslint-disable-next-line no-unused-vars
import { useLocation, Redirect } from 'react-router-dom';
import BtnBack from '../components/BtnBack';
import { Text } from '../components/styled/Text';
import Card from '../components/styled/Card';

const Deployed = () => {
  const location = useLocation();

  if (!location.state) {
    // return <Redirect to="/not-found" />;
  }

  return (
    <>
      <BtnBack pageName="Create a New Multisig" />

      <Card>
        <Card.Body>
          <Text>
            Your transaction has been sent. Please wait until it is added to the
            network, it may take a few minutes.
          </Text>
          <Text>
            Transaction hash:{' '}
            <a
              href={`https://edo2net.tzkt.io/${location.state?.transactionHash}`}
              target="_blank"
              rel="noreferrer"
            >
              {location.state?.transactionHash}
            </a>
          </Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default Deployed;
