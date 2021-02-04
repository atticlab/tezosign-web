import React from 'react';
import styled from 'styled-components';
import BtnBack from '../components/BtnBack';
import Text from '../components/styled/Text';

const DeployedStyle = styled.div`
  text-align: center;
`;

const Deployed = () => {
  return (
    <>
      <BtnBack pageName="Create a New Multisig" />

      <DeployedStyle>
        <Text>
          Your transaction has been sent. Please wait until it is added to the
          network, it may take a few minutes.
        </Text>
      </DeployedStyle>
    </>
  );
};

export default Deployed;
