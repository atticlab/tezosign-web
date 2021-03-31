import React, { useEffect, useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Form as BForm } from 'react-bootstrap';
import Card from '../styled/Card';
import { FlexCenter } from '../styled/Flex';
import { Ellipsis, TextAccent } from '../styled/Text';
import { TblGenInfo } from '../styled/Tbl';
import { FormLabel } from '../styled/Forms';
import Table from '../Table';
import BtnCopy from '../BtnCopy';
import Spinner from '../Spinner';
import OperationDetails from './OperationDetails';
import SelectCustom from '../SelectCustom';
import IndentIcon from '../IdentIcon';
import useThemeContext from '../../hooks/useThemeContext';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { useAssetsStateContext } from '../../store/assetsContext';
import {
  useOperationsDispatchContext,
  useOperationsStateContext,
} from '../../store/operationsContext';
import { convertMutezToXTZ, capitalize } from '../../utils/helpers';
import { dateFormat } from '../../utils/constants';

dayjs.extend(utc);

const Status = styled.span`
  text-transform: uppercase;
  color: ${({ status, theme }) => {
    switch (status) {
      case 'rejected':
        return theme.red;
      case 'pending':
        return theme.yellow;
      default:
        return theme.green;
    }
  }};
`;

const initialOpsCounts = {
  pending: 0,
  rejected: 0,
  approved: 0,
  success: 0,
};

const listOperationType = [
  {
    label: 'Transfer',
    value: 'transfer',
  },
  {
    label: 'Fa transfer',
    value: 'fa_transfer',
  },
  {
    label: 'Fa2 transfer',
    value: 'fa2_transfer',
  },
  {
    label: 'Income fa transfer',
    value: 'income_fa_transfer',
  },
  {
    label: 'Income transfer',
    value: 'income_transfer',
  },
  {
    label: 'Delegation',
    value: 'delegation',
  },
  {
    label: 'Storage update',
    value: 'storage_update',
  },
];

const limit = 15;

const Operations = () => {
  const theme = useThemeContext();
  const { assets } = useAssetsStateContext();
  const { ops, isOpsLoading } = useOperationsStateContext();
  const { getOps, setOps } = useOperationsDispatchContext();
  const [operationType, setOperationType] = useState(null);
  const { lastItem, pageNumber, setHasMore, setPageNumber } = useInfiniteScroll(
    isOpsLoading,
  );

  const resetOperations = useCallback(async () => {
    let prevPageNumber;
    setOps(() => []);
    setHasMore(true);
    setPageNumber((prev) => {
      prevPageNumber = prev;
      return 1;
    });

    if (prevPageNumber === 1) {
      await getOps(limit, 0);
    }
  }, [getOps, setHasMore, setOps, setPageNumber]);

  useEffect(() => {
    const loadOps = async () => {
      const resp = await getOps(limit, (pageNumber - 1) * limit);
      if (!resp.length || resp.length < limit) setHasMore(false);
    };

    loadOps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  const opsLists = useMemo(() => {
    if (!ops) return ops;

    return ops.filter(
      (elem) =>
        operationType === null ||
        operationType.value === elem.operation_info.type,
    );
  }, [ops, operationType]);

  const cols = [
    {
      key: 'operation_id',
      label: 'ID',
      process(operation) {
        const id = operation[this.key];

        return (
          <FlexCenter>
            <Ellipsis maxWidth="70px">{id}</Ellipsis>
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
        const {
          operation_info: {
            amount,
            asset_id: assetId,
            transfer_list: transferList,
            type,
          },
        } = operation;

        // eslint-disable-next-line no-underscore-dangle
        const _amount =
          amount || (transferList && transferList[0].txs[0].amount);

        if (!_amount) return '';

        const currAsset = assets?.find((asset) => {
          return asset.address === assetId;
        });

        if (
          type === 'income_fa_transfer' ||
          type === 'fa_transfer' ||
          type === 'fa2_transfer'
        ) {
          return `${
            currAsset?.scale ? _amount / (10 ** currAsset?.scale || 1) : _amount
          } ${currAsset?.ticker || '???'}`;
        }

        return `${convertMutezToXTZ(_amount)} XTZ`;
      },
    },
    {
      key: 'to',
      label: 'Recipient',
      process(operation) {
        const to =
          operation.operation_info.to ||
          (operation.operation_info.transfer_list &&
            operation.operation_info.transfer_list[0].txs[0].to);

        return to ? (
          <FlexCenter>
            <div style={{ marginRight: '5px' }}>
              <IndentIcon address={to} scale={4} />
            </div>
            <Ellipsis>{to}</Ellipsis>
            <BtnCopy
              textToCopy={to}
              style={{ paddingTop: 0, paddingBottom: 0 }}
            />
          </FlexCenter>
        ) : (
          ''
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
    if (!opsLists) return initialOpsCounts;

    return opsLists.reduce(
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
  }, [opsLists]);

  return (
    <section>
      <BForm>
        <FormLabel>Operation type</FormLabel>
        <SelectCustom
          id="filter"
          options={listOperationType}
          onChange={(value) => {
            setOperationType(value);
          }}
          isClearable
          isSearchable={false}
          placeholder="Select type"
          menuWidth="100%"
          maxWidth="200px"
        />
      </BForm>

      <TblGenInfo>
        <TblGenInfo.Item>
          Pending:{' '}
          <TextAccent color={theme.blue}>
            {opsCountsByStatus?.pending}
          </TextAccent>
        </TblGenInfo.Item>
        <TblGenInfo.Item>
          Approved:{' '}
          <TextAccent color={theme.blue}>
            {opsCountsByStatus?.approved}
          </TextAccent>
        </TblGenInfo.Item>
        <TblGenInfo.Item>
          Rejected:{' '}
          <TextAccent color={theme.blue}>
            {opsCountsByStatus?.rejected}
          </TextAccent>
        </TblGenInfo.Item>
        <TblGenInfo.Item>
          Success:{' '}
          <TextAccent color={theme.blue}>
            {opsCountsByStatus?.success}
          </TextAccent>
        </TblGenInfo.Item>
      </TblGenInfo>

      <Card style={{ overflow: 'hidden' }}>
        <Table
          cols={cols}
          rows={opsLists || []}
          rowKey="operation_id"
          maxHeight="560px"
          stickyHeader
          lastItem={lastItem}
          isDataLoading={isOpsLoading}
          isCollapsible
          collapseContent={(operation) => {
            return (
              <OperationDetails
                operation={operation}
                resetOperations={resetOperations}
              />
            );
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
