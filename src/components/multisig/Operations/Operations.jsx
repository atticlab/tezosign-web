import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Badge, Button } from 'react-bootstrap';
import Card from '../../styled/Card';
import Table from '../../Table';
import BtnCopy from '../../BtnCopy';
import Spinner from '../../Spinner';
import OperationDetails from './OperationDetails';
import useAPI from '../../../hooks/useApi';
import { requestSignPayload, sendTx } from '../../../plugins/beacon';
import { useUserStateContext } from '../../../store/userContext';
import { useContractStateContext } from '../../../store/contractContext';
import {
  useOperationsDispatchContext,
  useOperationsStateContext,
} from '../../../store/operationsContext';
import { convertMutezToXTZ, capitalize } from '../../../utils/helpers';
import { dateFormat } from '../../../utils/constants';

dayjs.extend(utc);

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
        : theme.lightGreen};
  color: ${({ variant, theme }) =>
    // eslint-disable-next-line no-nested-ternary
    variant === 'danger'
      ? theme.red
      : // eslint-disable-next-line no-nested-ternary
      variant === 'secondary'
      ? theme.black
      : variant === 'warning'
      ? theme.yellow
      : theme.lightGreen};
`;

const TblGenInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

TblGenInfo.Item = styled.span`
  margin: 0 30px 20px;
  text-transform: capitalize;
  font-size: 16px;
`;

const Status = styled.span`
  text-transform: uppercase;
  color: ${({ status, theme }) => {
    switch (status) {
      case 'rejected':
        return theme.red;
      case 'pending':
        return theme.yellow;
      default:
        return theme.lightGreen;
    }
  }};
`;

const Ellipsis = styled.span`
  display: inline-block;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FlexCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const countSignatures = (signatures) =>
  signatures.reduce(
    (acc, signature) => {
      if (signature.type === 'approve') {
        acc.approve += 1;
      }
      if (signature.type === 'reject') {
        acc.reject += 1;
      }
      return acc;
    },
    {
      approve: 0,
      reject: 0,
    },
  );

const checkOwnersIndices = (signatures, owners, signatureType = 'approve') => {
  if (!signatures) return null;

  return signatures.some(
    (signature) => owners[signature.index] && signature.type === signatureType,
  );
};

const initialOpsCounts = {
  pending: 0,
  rejected: 0,
  approved: 0,
};

const Operations = () => {
  const {
    contractAddress,
    contractInfo,
    isUserOwner,
  } = useContractStateContext();
  const { publicKey } = useUserStateContext();
  const { sendSignature, getOperationPayload, buildOperation } = useAPI();
  const [pageNumber, setPageNumber] = useState(1);
  const hasMore = false;
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { ops, isOpsLoading } = useOperationsStateContext();
  const { getOps, setOps } = useOperationsDispatchContext();

  useEffect(() => {
    getOps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  const observer = useRef();
  const lastItem = useCallback(
    (node) => {
      if (isOpsLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isOpsLoading, hasMore],
  );

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

  const cols = [
    {
      key: 'operation_id',
      label: 'ID',
      process(operation) {
        const id = operation[this.key];

        return (
          <FlexCenter>
            <Ellipsis style={{ maxWidth: '70px' }}>{id}</Ellipsis>
            <BtnCopy
              textToCopy={id}
              style={{ paddingTop: 0, paddingBottom: 0 }}
            />
          </FlexCenter>
        );
      },
    },
    {
      key: 'type',
      process(operation) {
        // eslint-disable-next-line react/no-this-in-sfc
        const opType = operation.operation_info[this.key].split('_').join(' ');

        return capitalize(opType);
      },
    },
    {
      key: 'created_at',
      label: 'Created',
      process(operation) {
        // eslint-disable-next-line react/no-this-in-sfc
        return dayjs.unix(operation[this.key]).utc().format(dateFormat);
      },
    },
    {
      key: 'amount',
      process(operation) {
        // eslint-disable-next-line react/no-this-in-sfc
        const amount = operation.operation_info[this.key];
        return amount ? `${convertMutezToXTZ(amount)} XTZ` : '';
      },
    },
    {
      key: 'to',
      label: 'Recipient',
      process(operation) {
        const to = operation.operation_info[this.key];

        return (
          <FlexCenter>
            {to ? (
              <>
                <Ellipsis>{to}</Ellipsis>
                <BtnCopy
                  textToCopy={to}
                  style={{ paddingTop: 0, paddingBottom: 0 }}
                />
              </>
            ) : (
              ''
            )}
          </FlexCenter>
        );
      },
    },
    {
      key: 'signatures_count',
      label: 'Signatures',
      process(operation) {
        const signaturesCount = operation.signatures
          ? [
              ...new Set(
                operation.signatures.map((signature) => signature.index),
              ),
            ].length
          : 0;

        return `${signaturesCount}/${
          contractInfo ? contractInfo.threshold : 0
        }`;
      },
    },
    { key: 'nonce' },
    {
      key: 'actions',
      process(operation) {
        if (!isUserOwner || operation.status !== 'pending') {
          return (
            <BadgeOutline
              variant={
                // eslint-disable-next-line no-nested-ternary
                operation.status === 'rejected'
                  ? 'danger'
                  : operation.status === 'pednibf'
                  ? 'warning'
                  : 'success'
              }
            >
              {operation.status}
            </BadgeOutline>
          );
        }

        const signaturesCount =
          operation.signatures && countSignatures(operation.signatures);
        const signaturesSum =
          signaturesCount && signaturesCount.approve + signaturesCount.reject;

        if (
          signaturesSum >= contractInfo.threshold &&
          operation.nonce === contractInfo.counter
        ) {
          // TODO: Add balance check
          if (!contractInfo.balance) {
            return (
              <BadgeOutline variant="secondary">
                Insufficient funds
              </BadgeOutline>
            );
          }

          const opDecision =
            signaturesCount.approve >= signaturesCount.reject
              ? 'approve'
              : 'reject';

          return (
            <Button
              variant="primary"
              block
              size="sm"
              style={{ paddingTop: '1px', paddingBottom: '1px' }}
              disabled={isActionLoading}
              onClick={() =>
                sendOperation(operation.operation_id, { type: opDecision })
              }
            >
              SEND
            </Button>
          );
        }

        return (
          <span>
            <Button
              variant="primary"
              block
              size="sm"
              style={{ padding: '0 4px' }}
              disabled={
                isActionLoading ||
                checkOwnersIndices(
                  operation.signatures,
                  contractInfo.owners,
                  'approve',
                )
              }
              onClick={() => acceptOperation(operation.operation_id)}
            >
              APPROVE
            </Button>
            <Button
              variant="danger"
              block
              size="sm"
              style={{
                padding: '0 4px',
              }}
              disabled={
                isActionLoading ||
                checkOwnersIndices(
                  operation.signatures,
                  contractInfo.owners,
                  'reject',
                )
              }
              onClick={() => rejectOperation(operation.operation_id)}
            >
              REJECT
            </Button>
          </span>
        );
      },
    },
    {
      key: 'status',
      process(operation) {
        return (
          <Status status={operation[this.key]}>{operation[this.key]}</Status>
        );
      },
    },
  ];

  const opsCountsByStatus = useMemo(() => {
    if (!ops) return initialOpsCounts;

    return ops.reduce(
      (acc, op) => {
        switch (op.status) {
          case 'pending':
            // eslint-disable-next-line no-unused-expressions
            acc.pending += 1;
            break;
          case 'rejected':
            // eslint-disable-next-line no-unused-expressions
            acc.rejected += 1;
            break;
          default:
            // eslint-disable-next-line no-unused-expressions
            acc.approved += 1;
            break;
        }

        return acc;
      },
      { ...initialOpsCounts },
    );
  }, [ops]);

  return (
    <section>
      <TblGenInfo>
        <TblGenInfo.Item>Pending: {opsCountsByStatus?.pending}</TblGenInfo.Item>
        <TblGenInfo.Item>
          Approved: {opsCountsByStatus?.approved}
        </TblGenInfo.Item>
        <TblGenInfo.Item>
          Rejected: {opsCountsByStatus?.rejected}
        </TblGenInfo.Item>
      </TblGenInfo>

      <Card style={{ overflow: 'hidden' }}>
        <Table
          cols={cols}
          rows={ops || []}
          rowKey="operation_id"
          maxHeight="600px"
          stickyHeader
          lastItem={lastItem}
          isDataLoading={isOpsLoading}
          isCollapsible
          collapseContent={(row) => {
            console.log(row);
            return <OperationDetails row={row} />;
          }}
        />

        {isOpsLoading && (
          <div style={{ textAlign: 'center' }}>
            <Spinner />
          </div>
        )}
      </Card>
    </section>
  );
};

export default Operations;
