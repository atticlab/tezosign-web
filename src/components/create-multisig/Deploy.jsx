import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Text } from '../styled/Text';
import BreakTxt from '../styled/BreakTxt';
import AccentText from '../styled/AccentText';
import useAPI from '../../hooks/useApi';
import { sendOrigination } from '../../plugins/beacon';
import { handleError } from '../../utils/errorsHandler';
import { isHex, convertHexToPrefixedBase58 } from '../../utils/helpers';

const onSubmit = async (
  getContractCode,
  initStorage,
  entities,
  threshold,
  history,
) => {
  try {
    // eslint-disable-next-line no-unreachable
    const resCode = await getContractCode();
    const code = resCode.data;

    const payload = {
      entities: entities.map((entity) =>
        isHex(entity) ? convertHexToPrefixedBase58(entity) : entity,
      ),
      threshold: Number(threshold),
    };
    const resStorage = await initStorage(payload);
    const storage = resStorage.data;
    const script = { code, storage };

    const resContract = await sendOrigination('0', script);

    history.replace({
      pathname: '/deployed',
      state: resContract,
    });
  } catch (e) {
    handleError(e);
  }
};

const Deploy = ({ entities, signatures, onBack }) => {
  const { getContractCode, initStorage } = useAPI();
  const history = useHistory();

  return (
    <>
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
          {entities.map((entity, index) => (
            <AccentText key={entity}>
              <BreakTxt>
                {entity}
                {index !== entities.length - 1 ? ', ' : ''}
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
          style={{ marginRight: '10px' }}
          onClick={onBack}
        >
          Back
        </Button>
        {/* disabled={isSubmitting} */}
        <Button
          type="submit"
          onClick={() => {
            onSubmit(
              getContractCode,
              initStorage,
              entities,
              signatures,
              history,
            );
          }}
        >
          Submit
        </Button>
      </div>
    </>
  );
};

Deploy.propTypes = {
  entities: PropTypes.arrayOf(PropTypes.string).isRequired,
  signatures: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default Deploy;
