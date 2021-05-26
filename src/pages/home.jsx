import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import { Title, Text } from '../components/styled/Text';
import Card from '../components/styled/Card';
import ModalAuth from '../components/ModalAuth';
import {
  useUserStateContext,
  useUserDispatchContext,
} from '../store/userContext';
import useModal from '../hooks/useModal';

const HomeStyled = styled.section`
  max-width: 732px;
  margin: 0 auto;
`;

const Home = () => {
  const history = useHistory();
  const { connect } = useUserDispatchContext();
  const { isLoggedIn } = useUserStateContext();
  const { show, handleClose, handleShow } = useModal();

  useEffect(() => {
    if (isLoggedIn) {
      history.push('/select-multisig');
    }

    return () => null;
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

      <Card>
        <Card.Body padding="38px">
          <Title fs="20px" style={{ marginBottom: '15px' }}>
            Create, deploy and manage multisig wallets
          </Title>
          <Text style={{ marginBottom: '30px' }}>
            TzSign allows you to collectively manage a multisig wallet with
            collaborators with an easy-to-use interface. Connect your wallet in
            order to continue.
          </Text>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => connect(handleShow, handleClose)}>
              Connect
            </Button>
          </div>
        </Card.Body>
      </Card>

      <ModalAuth show={show} handleClose={handleClose} />
    </HomeStyled>
  );
};

export default Home;
