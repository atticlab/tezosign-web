import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import styled from 'styled-components';
import { Bold } from '../../styled/Text';
import Spinner from '../../Spinner';
import VestingActions from './VestingActions';
import useAPI from '../../../hooks/useApi';
import useRequest from '../../../hooks/useRequest';
import { convertMutezToXTZ, toHHMMSS } from '../../../utils/helpers';
import { dateFormat } from '../../../utils/constants';

dayjs.extend(utc);

const OperationGeneralInfo = styled.div`
  display: flex;
  border: ${({ theme }) => theme.border};
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
  flex-wrap: wrap;
`;

OperationGeneralInfo.Item = styled.div`
  text-align: left;
  flex: 1 0 50%;

  &:not(:last-child) {
    padding-right: 30px;
  }

  @media (${({ theme }) => theme.xlDown}) {
    flex: 1 0 100%;
  }
`;

const VestingDetails = ({ vesting, isRowCollapsed }) => {
  const { getVestingInfo } = useAPI();
  const {
    request: loadVestingInfo,
    resp: vestingInfo,
    isLoading: isVestingInfoLoading,
  } = useRequest(getVestingInfo);

  useEffect(() => {
    if (isRowCollapsed && !vestingInfo) {
      loadVestingInfo(vesting.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesting, isRowCollapsed]);

  return (
    <div>
      {isVestingInfoLoading ? (
        <Spinner />
      ) : (
        vestingInfo && (
          <>
            <OperationGeneralInfo>
              <OperationGeneralInfo.Item>
                <Bold>Balance:</Bold>{' '}
                {`${convertMutezToXTZ(vestingInfo.balance)} XTZ`}
              </OperationGeneralInfo.Item>
              <OperationGeneralInfo.Item>
                <Bold>Delegate:</Bold> {vestingInfo.delegate}
              </OperationGeneralInfo.Item>
              <OperationGeneralInfo.Item>
                <Bold>Opened balance:</Bold>{' '}
                {`${convertMutezToXTZ(vestingInfo.opened_balance)} XTZ`}
              </OperationGeneralInfo.Item>
              <OperationGeneralInfo.Item>
                <Bold>Delegate admin:</Bold>{' '}
                {vestingInfo.storage.delegate_admin}
              </OperationGeneralInfo.Item>
              <OperationGeneralInfo.Item>
                <OverlayTrigger
                  overlay={
                    <Tooltip>
                      The interval of time needed for tokens to become available
                      for a withdrawal
                    </Tooltip>
                  }
                >
                  <span>
                    <Bold>Seconds per tick:</Bold>{' '}
                    {toHHMMSS(vestingInfo.storage.seconds_per_tick)}
                  </span>
                </OverlayTrigger>
              </OperationGeneralInfo.Item>
              <OperationGeneralInfo.Item>
                <Bold>Activation date:</Bold>{' '}
                {dayjs
                  .unix(vestingInfo.storage.timestamp)
                  .utc()
                  .format(dateFormat.split(' ')[0])}
              </OperationGeneralInfo.Item>
              <OperationGeneralInfo.Item>
                <OverlayTrigger
                  overlay={
                    <Tooltip>
                      The amount of tokens that becomes available for a
                      withdrawal
                    </Tooltip>
                  }
                >
                  <span>
                    <Bold>Tokens per tick:</Bold>{' '}
                    {`${convertMutezToXTZ(
                      vestingInfo.storage.tokens_per_tick,
                    )} XTZ`}
                  </span>
                </OverlayTrigger>
              </OperationGeneralInfo.Item>
              <OperationGeneralInfo.Item>
                <Bold>Vested amount</Bold>{' '}
                {`${convertMutezToXTZ(vestingInfo.storage.vested_amount)} XTZ`}
              </OperationGeneralInfo.Item>
              <OperationGeneralInfo.Item>
                <Bold>Vesting address: </Bold>{' '}
                {vestingInfo.storage.vesting_address}
              </OperationGeneralInfo.Item>
            </OperationGeneralInfo>

            <div style={{ marginTop: '20px', textAlign: 'left' }}>
              <VestingActions
                vestingAddress={vesting.address}
                // vestingAddress={vestingInfo.storage.vesting_address}
                vestingAdminAddress={vestingInfo.storage.delegate_admin}
              />
            </div>
          </>
        )
      )}
    </div>
  );
};

VestingDetails.propTypes = {
  vesting: PropTypes.objectOf(PropTypes.any).isRequired,
  isRowCollapsed: PropTypes.bool.isRequired,
};

export default VestingDetails;
