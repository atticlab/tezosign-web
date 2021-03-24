import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { Green, Red, Bold } from '../../styled/Text';
import { FlexCenter } from '../../styled/Flex';
import Stepper from '../../Stepper';
import Address from './Address';
import ContractChanges from './ContractChanges';
import BtnCopy from '../../BtnCopy';
import { useContractStateContext } from '../../../store/contractContext';
import { requestSignPayload, sendTx } from '../../../plugins/beacon';
import useAPI from '../../../hooks/useApi';
import { useUserStateContext } from '../../../store/userContext';
import { useOperationsDispatchContext } from '../../../store/operationsContext';
import { useAssetsStateContext } from '../../../store/assetsContext';

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

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
`;

const BadgeOutline = styled(Badge)`
  background-color: transparent;
  text-transform: uppercase;
  padding-top: 0.5em;
  border: 1px solid
    ${({ variant, theme }) =>
      // eslint-disable-next-line no-nested-ternary
      variant === 'danger'
        ? theme.red
        : // eslint-disable-next-line no-nested-ternary
        variant === 'secondary'
        ? theme.black
        : variant === 'warning'
        ? theme.yellow
        : theme.green};
  color: ${({ variant, theme }) =>
    // eslint-disable-next-line no-nested-ternary
    variant === 'danger'
      ? theme.red
      : // eslint-disable-next-line no-nested-ternary
      variant === 'secondary'
      ? theme.black
      : variant === 'warning'
      ? theme.yellow
      : theme.green};
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

const checkOwnersIndices = (
  userAddress,
  signatures,
  owners,
  signatureType = 'approve',
) => {
  if (!signatures) return null;

  return signatures.some((signature) => {
    const owner = owners[signature.index];
    return owner.address === userAddress && signature.type === signatureType;
  });
};

const initialSignaturesCount = {
  approved: 0,
  rejected: 0,
};

const OperationDetails = ({ operation }) => {
  const {
    contractInfo,
    isUserOwner,
    contractAddress,
  } = useContractStateContext();
  const { assets } = useAssetsStateContext();
  const { publicKey, address } = useUserStateContext();
  const [signaturesCount, setSignaturesCount] = useState(
    initialSignaturesCount,
  );
  const { sendSignature, getOperationPayload, buildOperation } = useAPI();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { getOps, setOps } = useOperationsDispatchContext();

  const acceptOperation = async (operationID) => {
    try {
      setIsActionLoading(true);
      const payload = await getOperationPayload(operationID, {
        type: 'approve',
      });
      const resSignature = await requestSignPayload(payload.data.payload);
      await sendSignature(operationID, {
        type: 'approve',
        contract_id: contractAddress,
        pub_key: publicKey,
        signature: resSignature.signature,
      });
      await setOps(() => null);
      await getOps();
    } catch (e) {
      console.error(e);
    } finally {
      setIsActionLoading(false);
    }
  };

  const rejectOperation = async (operationID) => {
    try {
      setIsActionLoading(true);
      const payload = await getOperationPayload(operationID, {
        type: 'reject',
      });
      const resSignature = await requestSignPayload(payload.data.payload);
      await sendSignature(operationID, {
        type: 'reject',
        contract_id: contractAddress,
        pub_key: publicKey,
        signature: resSignature.signature,
      });
      await setOps(() => null);
      await getOps();
    } catch (e) {
      console.error(e);
    } finally {
      setIsActionLoading(false);
    }
  };

  const sendOperation = async (operationID, opDecision) => {
    try {
      setIsActionLoading(true);
      const res = await buildOperation(operationID, opDecision);
      const params = {
        ...res.data,
        value: JSON.parse(res.data.value),
      };
      await sendTx(0, contractAddress, params);
      await setOps(() => null);
      await getOps();
    } catch (e) {
      console.error(e);
    } finally {
      setIsActionLoading(false);
    }
  };

  const signatures = useMemo(() => {
    if (!operation.signatures) return [];
    setSignaturesCount(initialSignaturesCount);

    return operation.signatures.reduce((acc, signature) => {
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

      const signatureInAcc = acc.find(
        (accSig) => accSig.id === signature.index,
      );

      if (signatureInAcc) {
        acc[acc.indexOf(signatureInAcc)].variant = 'halved';
      } else {
        acc.push({
          id: signature.index,
          variant: defineOperationStepVariant(signature.type),
          content: owner && <Address address={owner.address} />,
        });
      }

      return acc;
    }, []);
  }, [contractInfo, operation]);

  return (
    <div>
      <OperationGeneralInfo>
        <OperationGeneralInfo.Item>
          <div>
            <Bold>Total owners:</Bold> {contractInfo.owners.length}
          </div>
          <div>
            <Bold>Approved:</Bold> <Green>{signaturesCount.approved}</Green>
          </div>
        </OperationGeneralInfo.Item>
        <OperationGeneralInfo.Item>
          <div>
            <Bold>Threshold:</Bold>{' '}
            {`${contractInfo.threshold}/${contractInfo.owners.length}`}
          </div>
          <div>
            <Bold>Rejected:</Bold> <Red>{signaturesCount.rejected}</Red>
          </div>
        </OperationGeneralInfo.Item>
        {(() => {
          const {
            operation_info: { type, asset_id: assetID },
          } = operation;

          return type === 'fa_transfer' || type === 'fa2_transfer' ? (
            <OperationGeneralInfo.Item>
              <FlexCenter>
                <Bold style={{ marginRight: '5px' }}>Asset address:</Bold>
                {assetID}
                <BtnCopy
                  textToCopy={operation.operation_info.asset_id}
                  style={{ paddingTop: 0, paddingBottom: 0 }}
                />
              </FlexCenter>
              {assets && assets.length > 0 && (
                <div>
                  <Bold>Asset name:</Bold>{' '}
                  {assets.find((asset) => asset.address === assetID)?.name}
                </div>
              )}
            </OperationGeneralInfo.Item>
          ) : (
            ''
          );
        })()}
        {operation.operation_info.type === 'storage_update' ? (
          <OperationGeneralInfo.Item style={{ flex: '1 0 50%' }}>
            <ContractChanges
              newKeys={operation.operation_info.keys}
              newThreshold={operation.operation_info.threshold}
            />
          </OperationGeneralInfo.Item>
        ) : (
          ''
        )}
      </OperationGeneralInfo>

      <div>
        {signatures.length ? (
          <Stepper steps={signatures} style={{ marginTop: '30px' }} />
        ) : (
          ''
        )}
      </div>

      {operation.status === 'pending' && isUserOwner && (
        <Actions>
          <div>
            <Button
              size="sm"
              style={{ marginRight: '10px' }}
              variant="info"
              disabled={
                isActionLoading ||
                checkOwnersIndices(
                  address,
                  operation.signatures,
                  contractInfo.owners,
                  'approve',
                )
              }
              onClick={() => acceptOperation(operation.operation_id)}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="danger"
              disabled={
                isActionLoading ||
                checkOwnersIndices(
                  address,
                  operation.signatures,
                  contractInfo.owners,
                  'reject',
                )
              }
              onClick={() => rejectOperation(operation.operation_id)}
            >
              Reject
            </Button>
          </div>

          {operation.nonce === contractInfo.counter && (
            <div>
              {/* TODO: Address balance check  */}
              {!contractInfo.balance ? (
                <BadgeOutline variant="danger">
                  Insufficient wallet funds
                </BadgeOutline>
              ) : (
                <>
                  {signaturesCount.approved >= contractInfo.threshold && (
                    <Button
                      size="sm"
                      style={{ marginRight: '10px' }}
                      variant="info"
                      disabled={isActionLoading}
                      onClick={() =>
                        sendOperation(operation.operation_id, {
                          type: 'approve',
                        })
                      }
                    >
                      Send approve
                    </Button>
                  )}
                  {signaturesCount.rejected >= contractInfo.threshold && (
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={isActionLoading}
                      onClick={() =>
                        sendOperation(operation.operation_id, {
                          type: 'reject',
                        })
                      }
                    >
                      Send reject
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </Actions>
      )}
    </div>
  );
};

OperationDetails.propTypes = {
  operation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OperationDetails;
