import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import SelectCustom from '../../../SelectCustom';
import { useVestingsStateContext } from '../../../../store/vestingsContext';

const VestingsSelect = ({
  isInvalid,
  isValid,
  isTouched,
  onChange,
  onBlur,
}) => {
  const { vestings, isVestingsLoading } = useVestingsStateContext();
  const vestingsOpts = useMemo(() => {
    return vestings.map((vesting) => ({
      label: vesting.address,
      value: vesting.address,
    }));
  }, [vestings]);

  return (
    <SelectCustom
      options={vestingsOpts}
      placeholder="KT1..."
      isSearchable={false}
      isInvalid={isInvalid}
      isValid={isValid}
      isTouched={isTouched}
      isLoading={isVestingsLoading}
      menuWidth="100%"
      height="38px"
      disabled={!vestings || !vestings.length}
      styles={{
        singleValue: (provided) => ({
          ...provided,
          fontSize: '1rem',
        }),
      }}
      onChange={(value) => {
        onChange(value);
      }}
      onBlur={() => {
        onBlur();
      }}
    />
  );
};

VestingsSelect.propTypes = {
  isInvalid: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  isTouched: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default VestingsSelect;
