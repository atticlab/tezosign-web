import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { css } from 'styled-components';
import { Accordion } from 'react-bootstrap';
import BtnBack from '../components/BtnBack';
import Card from '../components/styled/Card';
import { Title } from '../components/styled/Text';
import IconGreen from '../components/styled/IconGreen';
import { FlexAlignItemsCenter } from '../components/styled/Flex';
import Owners from '../components/create-multisig/Owners';
import Thresholds from '../components/create-multisig/Thresholds';
import Deploy from '../components/create-multisig/Deploy';

const AccordionCard = styled(Card)`
  &:not(las-child) {
    margin-bottom: 20px;
  }
  transition: background-color 0.15s;
  ${({ isActive }) =>
    isActive
      ? css`
          background-color: white;
        `
      : ''};
`;

AccordionCard.Header = styled(Card.Header)`
  padding: 15px 38px;

  @media (${({ theme }) => theme.smDown}) {
    padding: 15px;
  }
`;

AccordionCard.Body = styled(Card.Body)`
  padding: 0 38px 30px;

  @media (${({ theme }) => theme.smDown}) {
    padding: 0 15px 30px;
  }
`;

const AccordionToggleInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CreateMultisig = () => {
  const [addresses, setAddresses] = useState([]);
  const [signatures, setSignatures] = useState(0);
  const [activeKey, setActiveKey] = useState('0');
  useEffect(() => {
    if (addresses && addresses.length && signatures) {
      return setActiveKey('2');
    }
    if (addresses && addresses.length) {
      return setActiveKey('1');
    }
    return setActiveKey('0');
  }, [addresses, signatures]);

  return (
    <section>
      <Helmet>
        <title>
          TzSign - DIY kit to launch a custom multisig XTZ wallet in seconds.
        </title>
        <meta
          name="description"
          content="TzSign is the tool to develop your custom multisig XTZ wallets following your needs: set owners and signature thresholds individually per each wallet, boss."
        />
        <meta
          itemProp="name"
          content="TzSign - DIY kit to launch a custom multisig XTZ wallet in seconds."
        />
        <meta
          itemProp="description"
          content="TzSign is the tool to develop your custom multisig XTZ wallets following your needs: set owners and signature thresholds individually per each wallet, boss."
        />
        <meta
          property="og:title"
          content="TzSign - DIY kit to launch a custom multisig XTZ wallet in seconds."
        />
        <meta
          property="og:description"
          content="TzSign is the tool to develop your custom multisig XTZ wallets following your needs: set owners and signature thresholds individually per each wallet, boss."
        />
        <meta
          name="twitter:title"
          content="TzSign - DIY kit to launch a custom multisig XTZ wallet in seconds."
        />
        <meta
          name="twitter:description"
          content="TzSign is the tool to develop your custom multisig XTZ wallets following your needs: set owners and signature thresholds individually per each wallet, boss."
        />
        <meta
          name="keywords"
          content="create Tezos wallet, create XTZ wallet, create multisig Tezos wallet, create multisig XTZ wallet"
        />
      </Helmet>

      <BtnBack />

      <Title fs="30px" fw={400}>
        Create a New Multisig
      </Title>

      <div>
        <Accordion activeKey={activeKey}>
          <AccordionCard isActive={activeKey === '0'}>
            <Accordion.Toggle eventKey="0" as={AccordionCard.Header}>
              <AccordionToggleInner>
                <FlexAlignItemsCenter>
                  {addresses && addresses.length !== 0 && (
                    <IconGreen
                      icon="check-circle"
                      style={{ marginRight: '10px' }}
                    />
                  )}
                  <Title as="h2" style={{ marginBottom: '0' }}>
                    Owners
                  </Title>
                </FlexAlignItemsCenter>

                <FontAwesomeIcon
                  icon="chevron-down"
                  rotation={activeKey === '0' ? 180 : 0}
                  style={{ transition: 'transform 0.15s ease' }}
                />
              </AccordionToggleInner>
            </Accordion.Toggle>

            <Accordion.Collapse eventKey="0">
              <AccordionCard.Body>
                <Owners
                  style={{ marginBottom: '15px' }}
                  onSubmit={(payload) => setAddresses(payload)}
                />
              </AccordionCard.Body>
            </Accordion.Collapse>
          </AccordionCard>

          <AccordionCard isActive={activeKey === '1'}>
            <Accordion.Toggle eventKey="1" as={AccordionCard.Header}>
              <AccordionToggleInner>
                <FlexAlignItemsCenter>
                  {Boolean(signatures) && (
                    <IconGreen
                      icon="check-circle"
                      style={{ marginRight: '10px' }}
                    />
                  )}
                  <Title as="h2" style={{ marginBottom: '0' }}>
                    Signature Thresholds
                  </Title>
                </FlexAlignItemsCenter>

                <FontAwesomeIcon
                  icon="chevron-down"
                  rotation={activeKey === '1' ? 180 : 0}
                  style={{ transition: 'transform 0.15s ease' }}
                />
              </AccordionToggleInner>
            </Accordion.Toggle>

            <Accordion.Collapse eventKey="1">
              <AccordionCard.Body>
                <Thresholds
                  addresses={addresses}
                  onSubmit={(payload) => setSignatures(payload)}
                  onBack={() => setAddresses([])}
                />
              </AccordionCard.Body>
            </Accordion.Collapse>
          </AccordionCard>

          <AccordionCard isActive={activeKey === '2'}>
            <Accordion.Toggle eventKey="2" as={AccordionCard.Header}>
              <AccordionToggleInner>
                <Title as="h2" style={{ marginBottom: '0' }}>
                  Deploy
                </Title>

                <FontAwesomeIcon
                  icon="chevron-down"
                  rotation={activeKey === '2' ? 180 : 0}
                  style={{ transition: 'transform 0.15s ease' }}
                />
              </AccordionToggleInner>
            </Accordion.Toggle>

            <Accordion.Collapse eventKey="2">
              <AccordionCard.Body>
                <Deploy
                  entities={addresses}
                  signatures={signatures}
                  onBack={() => setSignatures(0)}
                />
              </AccordionCard.Body>
            </Accordion.Collapse>
          </AccordionCard>
        </Accordion>
      </div>
    </section>
  );
};

export default CreateMultisig;
