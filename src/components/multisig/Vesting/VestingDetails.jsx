import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../../Spinner';
import useAPI from '../../../hooks/useApi';
import useRequest from '../../../hooks/useRequest';

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

  useEffect(() => {
    console.log(vestingInfo);
  }, [vestingInfo]);

  return (
    <div>
      Vesting details
      {isVestingInfoLoading ? <Spinner /> : 'Loaded'}
    </div>
  );
};

VestingDetails.propTypes = {
  vesting: PropTypes.objectOf(PropTypes.any).isRequired,
  isRowCollapsed: PropTypes.bool.isRequired,
};

export default VestingDetails;
