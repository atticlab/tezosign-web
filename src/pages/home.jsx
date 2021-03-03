import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Helmet from 'react-helmet';
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
      <Helmet>
        <title>
          Tezos wallet for XTZ: multisig, open-source, web-based. It’s TzSign.
        </title>
        <meta
          name="description"
          content="TzSign – get your secure multisig open-source wallet for Tezos ecosystem! Create, deploy & manage your XTZ-wallet contracts with a click of a button on the web."
        />
        <meta
          itemProp="name"
          content=" Tezos wallet for XTZ: multisig, open-source, web-based. It’s TzSign."
        />
        <meta
          itemProp="description"
          content="TzSign – get your secure multisig open-source wallet for Tezos ecosystem! Create, deploy & manage your XTZ-wallet contracts with a click of a button on the web."
        />
        <meta
          property="og:title"
          content="Tezos wallet for XTZ: multisig, open-source, web-based. It’s TzSign."
        />
        <meta
          property="og:description"
          content="TzSign – get your secure multisig open-source wallet for Tezos ecosystem! Create, deploy & manage your XTZ-wallet contracts with a click of a button on the web."
        />
        <meta
          name="twitter:title"
          content="Tezos wallet for XTZ: multisig, open-source, web-based. It’s TzSign."
        />
        <meta
          name="twitter:description"
          content="TzSign – get your secure multisig open-source wallet for Tezos ecosystem! Create, deploy & manage your XTZ-wallet contracts with a click of a button on the web."
        />
        <meta
          name="keywords"
          content="multisig Tezos wallet, multisig XTZ wallet, Tezos wallet, XTZ wallet, XTZ web wallet, Tezos web wallet"
        />
      </Helmet>

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
