import React from 'react';
import Select from 'react-select/creatable';
import PropTypes from 'prop-types';
import selectStyle from '../utils/theme/selectStyle';

const SelectCustom = ({
  onChange,
  onBlur,
  options,
  isSearchable,
  displayValue,
  isValid,
  isInvalid,
  isTouched,
  value,
  menuWidth,
}) => {
  const option = options.map((el) => ({
    label: el.label ? el.label : el,
    value: el.value ? el.value : el,
  }));
  const handleChange = (opt) => {
    onChange(opt);
  };

  return (
    <Select
      options={option}
      onChange={handleChange}
      styles={selectStyle}
      isSearchable={isSearchable}
      displayValue={displayValue}
      isTouched={isTouched}
      isValid={isValid}
      isInvalid={isInvalid}
      value={value}
      onBlur={onBlur}
      menuWidth={menuWidth}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: '#27f190',
          primary25: 'rgba(39, 241, 144, 0.25)',
          primary50: 'rgba(39, 241, 144, 0.5)',
          danger: '#f9452d',
        },
        spacing: {
          ...theme.spacing,
          controlHeight: 21,
        },
      })}
    />
  );
};

SelectCustom.propTypes = {
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  isSearchable: PropTypes.bool,
  displayValue: PropTypes.bool,
  isTouched: PropTypes.bool,
  isValid: PropTypes.bool,
  isInvalid: PropTypes.bool,
  value: PropTypes.objectOf(PropTypes.any),
  menuWidth: PropTypes.string,
};

SelectCustom.defaultProps = {
  isSearchable: true,
  displayValue: true,
  onBlur: () => null,
  isTouched: false,
  isValid: false,
  isInvalid: false,
  menuWidth: '',
  value: {},
};

export default SelectCustom;
