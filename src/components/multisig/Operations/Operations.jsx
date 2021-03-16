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
import { Form as BForm } from 'react-bootstrap';
import Card from '../../styled/Card';
import { FlexCenter } from '../../styled/Flex';
import Ellipsis from '../../styled/Ellipsis';
import { TblGenInfo } from '../../styled/Tbl';
import Table from '../../Table';
import BtnCopy from '../../BtnCopy';
import Spinner from '../../Spinner';
import OperationDetails from './OperationDetails';
import { useAssetsStateContext } from '../../../store/assetsContext';
import {
  useOperationsDispatchContext,
  useOperationsStateContext,
} from '../../../store/operationsContext';
import { convertMutezToXTZ, capitalize } from '../../../utils/helpers';
import { dateFormat } from '../../../utils/constants';
import IndentIcon from '../../IdentIcon';
import SelectCustom from '../../SelectCustom';
import { FormLabel } from '../../styled/Forms';

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
        return theme.lightGreen;
    }
  }};
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
  const { assets } = useAssetsStateContext();
  const { ops, isOpsLoading } = useOperationsStateContext();
  const { getOps } = useOperationsDispatchContext();
  const operationType = [
    {
      label: 'Delegation',
      value: 'delegation',
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
      label: 'Income transfer',
      value: 'income_transfer',
    },
    {
      label: 'Storage update',
      value: 'storage_update',
    },
    {
      label: 'Transfer',
      value: 'transfer',
    },
  ];
  const [changeFilter, setChangeFilter] = useState(null);

  const opsLists = useMemo(() => {
    if (!ops) return ops;

    return ops.filter((elem) => {
      if (
        changeFilter === null ||
        changeFilter.value === elem.operation_info.type
      ) {
        return true;
      }

      return false;
    });
  }, [ops, changeFilter]);

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
      // TODO: Refactor
      process(operation) {
        const {
          operation_info: {
            amount,
            asset_id: assetId,
            transfer_list: transferList,
          },
        } = operation;
        // eslint-disable-next-line no-underscore-dangle
        const _amount =
          amount || (transferList && transferList[0].txs[0].amount);

        const currAsset = assets?.find((asset) => {
          return asset.address === assetId;
        });

        const ticker = assetId ? currAsset?.ticker || '' : 'XTZ';
        return _amount
          ? `${
              assetId
                ? _amount / 10 ** currAsset?.scale
                : convertMutezToXTZ(_amount)
            } ${ticker}`
          : '';
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
          options={operationType}
          onChange={(value) => {
            setChangeFilter(value);
          }}
          isClearable
          isSearchable={false}
          placeholder="Select type"
          menuWidth="100%"
          width="20%"
        />
      </BForm>

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
          rows={opsLists || []}
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
