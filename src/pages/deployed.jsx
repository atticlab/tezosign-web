import React from 'react';
import styled from 'styled-components';
import { Redirect, useLocation } from 'react-router-dom';
import BtnBack from '../components/BtnBack';
import { Text } from '../components/styled/Text';

const DeployedStyle = styled.div`
  text-align: center;
`;

const Deployed = () => {
  const location = useLocation();

  if (!location.state) {
    return <Redirect to="/not-found" />;
  }

  return (
    <>
      <BtnBack pageName="Create a New Multisig" />

      <DeployedStyle>
        <Text>
          Your transaction has been sent. Please wait until it is added to the
          network, it may take a few minutes.
        </Text>
        <Text>
          Transaction hash:{' '}
          <a
            href={`https://edo2net.tzkt.io/${location.state.transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {location.state.transactionHash}
          </a>
        </Text>
      </DeployedStyle>
    </>
  );
};

export default Deployed;
