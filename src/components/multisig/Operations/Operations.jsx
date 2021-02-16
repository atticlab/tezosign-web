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
import Card from '../../styled/Card';
import Table from '../../Table';
import BtnCopy from '../../BtnCopy';
import Spinner from '../../Spinner';
import OperationDetails from './OperationDetails';
import {
  useOperationsDispatchContext,
  useOperationsStateContext,
} from '../../../store/operationsContext';
import { convertMutezToXTZ, capitalize } from '../../../utils/helpers';
import { dateFormat } from '../../../utils/constants';

dayjs.extend(utc);

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

const initialOpsCounts = {
  pending: 0,
  rejected: 0,
  approved: 0,
  success: 0,
};

const Operations = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const hasMore = false;
  const { ops, isOpsLoading } = useOperationsStateContext();
  const { getOps } = useOperationsDispatchContext();

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
    { key: 'nonce' },
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
          case 'approved':
            // eslint-disable-next-line no-unused-expressions
            acc.approved += 1;
            break;
          default:
            // eslint-disable-next-line no-unused-expressions
            acc.success += 1;
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
        <TblGenInfo.Item>Success: {opsCountsByStatus?.success}</TblGenInfo.Item>
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
          collapseContent={(operation) => {
            return <OperationDetails operation={operation} />;
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
