import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Accordion } from 'react-bootstrap';
import BtnBack from '../components/BtnBack';
import Card from '../components/styled/Card';
import Title from '../components/styled/Title';
import IconGreen from '../components/styled/IconGreen';
import Owners from '../components/create-multisig/Owners';
import Thresholds from '../components/create-multisig/Thresholds';
import Deploy from '../components/create-multisig/Deploy';

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
      <BtnBack pageName="Create a New Multisig" />

      <div>
        <Accordion activeKey={activeKey}>
          <Card style={{ marginBottom: '10px' }}>
            <Accordion.Toggle eventKey="0" as={Card.Header}>
              <AccordionToggleInner>
                <Title as="h2" modifier="md" style={{ marginBottom: '0' }}>
                  Owners
                </Title>
                {addresses && addresses.length !== 0 && (
                  <IconGreen icon="check-circle" />
                )}
              </AccordionToggleInner>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Owners
                style={{ marginBottom: '15px' }}
                onSubmit={(payload) => setAddresses(payload)}
              />
            </Accordion.Collapse>
          </Card>

          <Card style={{ marginBottom: '10px' }}>
            <Accordion.Toggle eventKey="1" as={Card.Header}>
              <AccordionToggleInner>
                <Title as="h2" modifier="md" style={{ marginBottom: '0' }}>
                  Signature Thresholds
                </Title>

                {Boolean(signatures) && <IconGreen icon="check-circle" />}
              </AccordionToggleInner>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Thresholds
                addresses={addresses}
                onSubmit={(payload) => setSignatures(payload)}
                onBack={() => setAddresses([])}
              />
            </Accordion.Collapse>
          </Card>

          <Card>
            <Accordion.Toggle eventKey="2" as={Card.Header}>
              <Title as="h2" modifier="md" style={{ marginBottom: '0' }}>
                Deploy
              </Title>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
              <Deploy
                addresses={addresses}
                signatures={signatures}
                onBack={() => setSignatures(0)}
              />
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    </section>
  );
};

export default CreateMultisig;
