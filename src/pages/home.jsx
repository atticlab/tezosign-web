import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import Title from '../components/styled/Title';
import Text from '../components/styled/Text';
// import { useUserStateContext } from '../store/userContext';
import {
  useUserStateContext,
  useUserDispatchContext,
} from '../store/userContext';

const HomeStyled = styled.section`
  text-align: center;
  max-width: 732px;
  margin: 0 auto;
`;

const Home = () => {
  // const { isPermissionsLoading } = useUserStateContext();
  const history = useHistory();
  const { connect } = useUserDispatchContext();
  const { isLoggedIn } = useUserStateContext();

  useEffect(() => {
    if (isLoggedIn) {
      history.push('/select-multisig');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    <HomeStyled>
      <Title style={{ marginBottom: '15px' }}>
        Create, Deploy, and Manage Multisig Wallets
      </Title>
      <Text style={{ marginBottom: '30px' }}>
        TzSign allows you to collectively manage a multisig wallet with
        collaborators with an easy-to-use interface. Connect your wallet in
        order to continue.
      </Text>
      <Button
        size="lg"
        // disabled={isPermissionsLoading}
        onClick={() => connect()}
      >
        Connect
      </Button>
    </HomeStyled>
  );
};

export default Home;
