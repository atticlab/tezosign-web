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
import { dateFormatNoTime } from '../../../utils/constants';

dayjs.extend(utc);

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  text-align: left;
  border: ${({ theme }) => theme.border};
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
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
            <Grid style={{ flexWrap: 'wrap' }}>
              <div>
                <Bold>Balance:</Bold>{' '}
                {`${convertMutezToXTZ(vestingInfo.balance)} XTZ`}
              </div>
              <div>
                <OverlayTrigger
                  overlay={
                    <Tooltip>
                      The baker that a vesting contract delegates its funds to.
                    </Tooltip>
                  }
                >
                  <span>
                    <Bold>Delegate address:</Bold> {vestingInfo.delegate}
                  </span>
                </OverlayTrigger>
              </div>
              <div>
                <OverlayTrigger
                  overlay={
                    <Tooltip>
                      The limit of XTZ available for a withdrawal.
                    </Tooltip>
                  }
                >
                  <span>
                    <Bold>Withdrawal limit:</Bold>{' '}
                    {`${convertMutezToXTZ(vestingInfo.opened_balance)} XTZ`}
                  </span>
                </OverlayTrigger>
              </div>
              <div>
                <OverlayTrigger
                  overlay={
                    <Tooltip>
                      The address that sets and changes the delegate/baker for a
                      vesting contract.
                    </Tooltip>
                  }
                >
                  <span>
                    <Bold>Delegate admin address:</Bold>{' '}
                    {vestingInfo.storage.delegate_admin}
                  </span>
                </OverlayTrigger>
              </div>
              <div>
                <OverlayTrigger
                  overlay={
                    <Tooltip>
                      Time interval at which a portion of XTZ becomes unvested
                      and available for withdrawal.
                    </Tooltip>
                  }
                >
                  <span>
                    <Bold>Time per tick:</Bold>{' '}
                    {toHHMMSS(vestingInfo.storage.seconds_per_tick)}
                  </span>
                </OverlayTrigger>
              </div>
              <div>
                <OverlayTrigger
                  overlay={<Tooltip>Vesting start date.</Tooltip>}
                >
                  <span>
                    <Bold>Activation date:</Bold>{' '}
                    {dayjs
                      .unix(vestingInfo.storage.timestamp)
                      .utc()
                      .format(dateFormatNoTime)}
                  </span>
                </OverlayTrigger>
              </div>
              <div>
                <OverlayTrigger
                  overlay={
                    <Tooltip>
                      Amount to become unvested and the smallest unit that can
                      be withdrawn.
                    </Tooltip>
                  }
                >
                  <span>
                    <Bold>XTZ per tick:</Bold>{' '}
                    {`${convertMutezToXTZ(
                      vestingInfo.storage.tokens_per_tick,
                    )} XTZ`}
                  </span>
                </OverlayTrigger>
              </div>
              <div>
                <Bold>Vested amount</Bold>{' '}
                {`${convertMutezToXTZ(vestingInfo.storage.vested_amount)} XTZ`}
              </div>
              <div>
                <OverlayTrigger
                  overlay={
                    <Tooltip>
                      The address to which the unvested XTZ is sent.
                    </Tooltip>
                  }
                >
                  <span>
                    <Bold>Withdrawal address: </Bold>{' '}
                    {vestingInfo.storage.vesting_address}
                  </span>
                </OverlayTrigger>
              </div>
            </Grid>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <VestingActions
                vestingAddress={vesting.address}
                vestingDelegateAdmin={vestingInfo.storage.delegate_admin}
                tokensPerTIck={vestingInfo.storage.tokens_per_tick}
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
