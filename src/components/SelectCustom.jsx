import React from 'react';
import Select from 'react-select/creatable';
import PropTypes from 'prop-types';
import selectStyle from '../utils/theme/selectStyle';
import colors from '../utils/theme/colors';

const themeOverrides = {
  colors: {
    primary: colors.lightGreen,
    primary25: 'rgba(39, 241, 144, 0.25)',
    primary50: 'rgba(39, 241, 144, 0.5)',
    danger: colors.red,
  },
  spacing: {
    controlHeight: 21,
  },
};

const SelectCustom = ({
  options,
  defaultValue,
  isSearchable,
  displayValue,
  isValid,
  isInvalid,
  isTouched,
  disabled,
  menuWidth,
  height,
  onChange,
  onBlur,
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
      defaultValue={defaultValue}
      isSearchable={isSearchable}
      isTouched={isTouched}
      isValid={isValid}
      isInvalid={isInvalid}
      isDisabled={disabled}
      displayValue={displayValue}
      styles={selectStyle}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          ...themeOverrides.colors,
        },
        spacing: {
          ...theme.spacing,
          ...themeOverrides.spacing,
        },
      })}
      menuWidth={menuWidth}
      height={height}
      onChange={handleChange}
      onBlur={onBlur}
    />
  );
};

SelectCustom.propTypes = {
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  defaultValue: PropTypes.objectOf(PropTypes.any),
  isSearchable: PropTypes.bool,
  displayValue: PropTypes.bool,
  isTouched: PropTypes.bool,
  isValid: PropTypes.bool,
  isInvalid: PropTypes.bool,
  menuWidth: PropTypes.string,
  height: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
};

SelectCustom.defaultProps = {
  defaultValue: {},
  isSearchable: true,
  displayValue: true,
  isTouched: false,
  isValid: false,
  isInvalid: false,
  menuWidth: '',
  height: '',
  disabled: false,
  onBlur: () => null,
};

export default SelectCustom;
