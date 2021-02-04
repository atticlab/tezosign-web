import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import Text from '../styled/Text';
import Card from '../styled/Card';
import BreakTxt from '../styled/BreakTxt';
import AccentText from '../styled/AccentText';
import useAPI from '../../hooks/useApi';
import { sendOrigination } from '../../plugins/beacon';

const onSubmit = async (
  getContractCode,
  initStorage,
  addresses,
  threshold,
  history,
) => {
  try {
    // eslint-disable-next-line no-unreachable
    const resCode = await getContractCode();
    const code = resCode.data;

    const payload = {
      addresses,
      threshold: Number(threshold),
    };
    const resStorage = await initStorage(payload);
    const storage = resStorage.data;
    const script = { code, storage };

    await sendOrigination('0', script);

    history.push('/deployed');
  } catch (e) {
    console.error();
  }
};

const Deploy = ({ addresses, signatures, onBack }) => {
  const { getContractCode, initStorage } = useAPI();
  const history = useHistory();

  return (
    <Card.Body>
      <Text modifier="md">
        Please review the following multisig before deploying it on mainnet.
        <br />
        The creation of a multisig will incur a fee.
        <br />
      </Text>
      <Text modifier="md">
        Your multisig will be deployed with the following attributes:
      </Text>

      <div>
        <Text modifier="md">
          Owners: <br />
          {addresses.map((address, index) => (
            <AccentText key={address}>
              <BreakTxt>
                {address}
                {index !== addresses.length - 1 ? ', ' : ''}
              </BreakTxt>
              <br />
            </AccentText>
          ))}
        </Text>

        <Text modifier="md">
          Number of confirmations required:{' '}
          <AccentText>{signatures}</AccentText>
        </Text>
      </div>

      <div style={{ textAlign: 'right' }}>
        <Button
          variant="outline-primary"
          size="lg"
          style={{ marginRight: '24px' }}
          onClick={onBack}
        >
          Back
        </Button>
        {/* disabled={isSubmitting} */}
        <Button
          type="submit"
          size="lg"
          onClick={() => {
            onSubmit(
              getContractCode,
              initStorage,
              addresses,
              signatures,
              history,
            );
          }}
        >
          Submit
        </Button>
      </div>
    </Card.Body>
  );
};

Deploy.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.string).isRequired,
  signatures: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default Deploy;
