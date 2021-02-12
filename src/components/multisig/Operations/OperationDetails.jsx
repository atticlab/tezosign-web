import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Stepper from '../../Stepper';
import Address from './Address';
import { useContractStateContext } from '../../../store/contractContext';

const Bold = styled.span`
  font-weight: bold;
`;

const Approved = styled.span`
  color: ${({ theme }) => theme.lightGreen};
`;

const Rejected = styled.span`
  color: ${({ theme }) => theme.red};
`;

const OperationGeneralInfo = styled.div`
  display: flex;
  border: ${({ theme }) => theme.border};
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
`;

OperationGeneralInfo.Item = styled.div`
  text-align: left;

  &:not(:last-child) {
    margin-right: 30px;
  }
`;

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

const initialSignaturesCount = {
  approved: 0,
  rejected: 0,
};

const OperationDetails = ({ operation }) => {
  const { contractInfo } = useContractStateContext();
  const [signaturesCount, setSignaturesCount] = useState(
    initialSignaturesCount,
  );

  const signatures = useMemo(() => {
    if (!operation.signatures) return [];
    setSignaturesCount(initialSignaturesCount);

    return operation.signatures.map((signature, index) => {
      const owner = contractInfo.owners[signature.index];

      switch (signature.type) {
        case 'approve':
          setSignaturesCount((prev) => ({
            ...prev,
            approved: prev.approved + 1,
          }));
          break;
        default:
          setSignaturesCount((prev) => ({
            ...prev,
            rejected: prev.rejected + 1,
          }));
          break;
      }

      return {
        id: index,
        variant: defineOperationStepVariant(signature.type),
        content: owner && <Address address={owner.address} />,
      };
    });
  }, [contractInfo, operation]);

  return (
    <div>
      <OperationGeneralInfo>
        <OperationGeneralInfo.Item>
          <div>
            <Bold>Total owners:</Bold> {contractInfo.owners.length}
          </div>
          <div>
            <Bold>Approved:</Bold>{' '}
            <Approved>{signaturesCount.approved}</Approved>
          </div>
        </OperationGeneralInfo.Item>
        <OperationGeneralInfo.Item>
          <div>
            <Bold>Threshold:</Bold>{' '}
            {`${contractInfo.threshold}/${contractInfo.owners.length}`}
          </div>
          <div>
            <Bold>Rejected:</Bold>{' '}
            <Rejected>{signaturesCount.rejected}</Rejected>
          </div>
        </OperationGeneralInfo.Item>
      </OperationGeneralInfo>

      <div>
        {signatures.length ? (
          <Stepper steps={signatures} style={{ marginTop: '30px' }} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

OperationDetails.propTypes = {
  operation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OperationDetails;
