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
import Card from '../styled/Card';
import Table from '../Table';
import BtnCopy from '../BtnCopy';
import Spinner from '../Spinner';
import { useUserStateContext } from '../../store/userContext';
import { useContractStateContext } from '../../store/contractContext';
import useAPI from '../../hooks/useApi';
import { requestSignPayload, sendTx } from '../../plugins/beacon';
import { convertMutezToXTZ } from '../../utils/helpers';
import { dateFormat } from '../../utils/constants';
import {
  useOperationsDispatchContext,
  useOperationsStateContext,
} from '../../store/operationsContext';

dayjs.extend(utc);

const BadgeOutline = styled(Badge)`
  background-color: transparent;
  text-transform: uppercase;
  border: 1px solid
    ${({ variant, theme }) =>
      // eslint-disable-next-line no-nested-ternary
      variant === 'danger'
        ? theme.red
        : variant === 'secondary'
        ? theme.black
        : theme.lightGreen};
  color: ${({ variant, theme }) =>
    // eslint-disable-next-line no-nested-ternary
    variant === 'danger'
      ? theme.red
      : variant === 'secondary'
      ? theme.black
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
      case 'approved':
        return theme.lightGreen;
      case 'rejected':
        return theme.red;
      default:
        return '';
    }
  }};
`;

const Ellipsis = styled.span`
  display: inline-block;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const fields = [
  // { key: 'operation_id', label: 'Operation ID' },
  { key: 'type' },
  { key: 'created_at', label: 'Created' },
  { key: 'amount' },
  { key: 'to', label: 'Recipient' },
  { key: 'signatures_count', label: 'Signatures' },
  { key: 'nonce' },
  { key: 'actions' },
  { key: 'status' },
];

const initialOpsCounts = {
  pending: 0,
  rejected: 0,
  approved: 0,
};

const countOpTypes = (status, setCount) => {
  if (!status) return null;

  switch (status) {
    case 'pending':
      return setCount((prev) => ({ ...prev, pending: prev.pending + 1 }));
    case 'rejected':
      return setCount((prev) => ({ ...prev, rejected: prev.rejected + 1 }));
    default:
      return setCount((prev) => ({ ...prev, approved: prev.approved + 1 }));
  }
};

const Operations = () => {
  // eslint-disable-next-line no-unused-vars
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
  const [opsCountsByStatus, setOpsCountsByStatus] = useState(initialOpsCounts);

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

  const opsPrepared = useMemo(() => {
    if (!ops || !ops.length) return [];
    setOpsCountsByStatus((prev) => ({ ...prev, ...initialOpsCounts }));

    return ops.map((op) => {
      if (op && op.status) {
        countOpTypes(op.status, setOpsCountsByStatus);
      }

      // eslint-disable-next-line no-param-reassign
      op = { ...op, ...op.operation_info };

      // eslint-disable-next-line no-param-reassign
      op.signatures_count =
        op.signatures &&
        op.signatures.reduce(
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

      return Object.keys(op).reduce((acc, key) => {
        // eslint-disable-next-line no-param-reassign
        if (op.status === 'rejected') {
          acc.actions = (
            <BadgeOutline variant="danger">{op.status}</BadgeOutline>
          );
        }
        if (op.status === 'approved') {
          acc.actions = (
            <BadgeOutline variant="success">{op.status}</BadgeOutline>
          );
        }
        if (isUserOwner && op.status === 'pending') {
          if (!op.signatures) {
            acc.actions = (
              <span>
                <Button
                  variant="primary"
                  size="sm"
                  style={{ paddingTop: '1px', paddingBottom: '1px' }}
                  disabled={isActionLoading}
                  onClick={() => acceptOperation(op.operation_id)}
                >
                  APPROVE
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  style={{
                    paddingTop: '1px',
                    paddingBottom: '1px',
                    marginLeft: '5px',
                  }}
                  disabled={isActionLoading}
                  onClick={() => rejectOperation(op.operation_id)}
                >
                  REJECT
                </Button>
              </span>
            );
          } else if (
            op.signatures &&
            op.signatures_count.approve + op.signatures_count.reject >=
              contractInfo?.threshold &&
            op.nonce === contractInfo.counter
          ) {
            acc.actions = contractInfo.balance ? (
              <Button
                variant="primary"
                size="sm"
                style={{ paddingTop: '1px', paddingBottom: '1px' }}
                disabled={isActionLoading}
                onClick={() => {
                  const opDecision =
                    op.signatures_count.approve >= op.signatures_count.reject
                      ? 'approve'
                      : 'reject';
                  sendOperation(op.operation_id, { type: opDecision });
                }}
              >
                SEND
              </Button>
            ) : (
              <BadgeOutline variant="secondary">
                Insufficient funds
              </BadgeOutline>
            );
          } else {
            acc.actions = (
              <span>
                <Button
                  variant="primary"
                  size="sm"
                  style={{ paddingTop: '1px', paddingBottom: '1px' }}
                  disabled={
                    isActionLoading ||
                    op.signatures.some((signature) => {
                      return (
                        contractInfo.owners[signature.index] &&
                        contractInfo.owners[signature.index].pub_key ===
                          publicKey &&
                        signature.type === 'approve'
                      );
                    }) ||
                    op.nonce < contractInfo.counter
                  }
                  onClick={() => acceptOperation(op.operation_id)}
                >
                  APPROVE
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  style={{
                    paddingTop: '1px',
                    paddingBottom: '1px',
                    marginLeft: '5px',
                  }}
                  disabled={
                    isActionLoading ||
                    op.signatures.some((signature) => {
                      return (
                        contractInfo.owners[signature.index] &&
                        contractInfo.owners[signature.index].pub_key ===
                          publicKey &&
                        signature.type === 'reject'
                      );
                    }) ||
                    op.nonce < contractInfo.counter
                  }
                  onClick={() => rejectOperation(op.operation_id)}
                >
                  REJECT
                </Button>
              </span>
            );
          }
        } else {
          acc.actions = (
            <BadgeOutline variant="secondary">{op.status}</BadgeOutline>
          );
        }

        switch (key) {
          // case 'operation_id':
          //   acc[key] = (
          //     <span
          //       style={{
          //         display: 'flex',
          //         alignItems: 'center',
          //         justifyContent: 'center',
          //       }}
          //     >
          //       <Ellipsis>{op.operation_id}</Ellipsis>
          //       <BtnCopy
          //         textToCopy={op.operation_id}
          //         style={{ paddingTop: 0, paddingBottom: 0 }}
          //       />
          //     </span>
          //   );
          //   return acc;
          case 'type':
            acc[key] = (
              <span style={{ textTransform: 'capitalize' }}>{op.type}</span>
            );
            return acc;
          case 'created_at':
            acc[key] = (
              <span style={{ fontSize: '14px' }}>
                {dayjs.unix(op[key]).utc().format(dateFormat)}
              </span>
            );
            return acc;
          case 'amount':
            acc[key] = (
              <span style={{ fontSize: '14px' }}>
                {`${convertMutezToXTZ(op[key])} ${op.asset || 'XTZ'}`}
              </span>
            );
            return acc;
          case 'to':
            acc[key] = (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {op.to ? (
                  <>
                    <Ellipsis>{op.to}</Ellipsis>
                    <BtnCopy
                      textToCopy={op.to}
                      style={{ paddingTop: 0, paddingBottom: 0 }}
                    />
                  </>
                ) : (
                  ''
                )}
              </span>
            );
            return acc;
          case 'signatures_count':
            acc[key] = `${op[key] ? op[key].approve + op[key].reject : 0}/${
              contractInfo?.threshold
            }`;
            return acc;
          case 'status':
            acc[key] = <Status status={op[key]}>{op[key]}</Status>;
            return acc;
          default:
            acc[key] = op[key];
            return acc;
        }
      }, {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          cols={fields}
          rows={opsPrepared}
          maxHeight="600px"
          stickyHeader
          lastItem={lastItem}
          isDataLoading={isOpsLoading}
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
