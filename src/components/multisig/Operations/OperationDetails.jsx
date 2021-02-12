import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Stepper from '../../Stepper';
import Address from './Address';
import { useContractStateContext } from '../../../store/contractContext';

const defineOperationStepVariant = (operationType) => {
  switch (operationType) {
    case 'approve':
      return 'success';
    case 'reject':
      return 'danger';
    default:
      return 'default';
  }
};

const OperationDetails = ({ operation }) => {
  const { contractInfo } = useContractStateContext();

  const signatures = useMemo(() => {
    if (!operation.signatures) return [];

    return operation.signatures.map((signature, index) => {
      const owner = contractInfo.owners[signature.index];

      return {
        id: index,
        variant: defineOperationStepVariant(signature.type),
        content: owner && <Address address={owner.address} />,
      };
    });
  }, [contractInfo, operation]);

  return (
    <div>
      {/* <div>{operation.status}</div> */}
      {signatures.length ? <Stepper steps={signatures} /> : ''}
    </div>
  );
};

OperationDetails.propTypes = {
  operation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OperationDetails;
