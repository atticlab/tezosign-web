import React, { useState } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import selectStyle from '../utils/theme/selectStyle';
import colors from '../utils/theme/colors';

const themeOverrides = {
  colors: {
    primary: colors.green,
    primary25: 'rgba(34, 211, 105, 0.25)',
    primary50: 'rgba(34, 211, 105, 0.5)',
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
  isLoading,
  disabled,
  menuWidth,
  placeholder,
  height,
  onChange,
  onBlur,
  isClearable,
  maxWidth,
  styles,
}) => {
  const option = options.map((el) => ({
    ...el,
    label: el.label ? el.label : el,
    value: el.value ? el.value : el,
  }));

  const [inputValue, setInputValue] = useState('');

  const handleChange = (opt) => {
    setInputValue('');
    onChange(opt);
  };

  const inputChange = (inputVal, { action }) => {
    if (inputVal && action === 'input-change') {
      setInputValue(inputVal);
      onChange({
        label: inputVal,
        value: inputVal,
      });
    }

    if (!inputVal && action === 'input-change') {
      setInputValue('');
      onChange({});
    }
  };

  return (
    <Select
      options={option}
      defaultValue={defaultValue.label ? defaultValue : null}
      isSearchable={isSearchable}
      isTouched={isTouched}
      isValid={isValid}
      isInvalid={isInvalid}
      isDisabled={disabled}
      isLoading={isLoading}
      displayValue={displayValue}
      className={isInvalid ? 'is-invalid' : ''}
      styles={{ ...selectStyle, ...styles }}
      onInputChange={inputChange}
      inputValue={inputValue}
      placeholder={placeholder}
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
      maxWidth={maxWidth}
      onChange={handleChange}
      onBlur={onBlur}
      isClearable={isClearable}
    />
  );
};

SelectCustom.propTypes = {
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  defaultValue: PropTypes.objectOf(PropTypes.any),
  isSearchable: PropTypes.bool,
  displayValue: PropTypes.bool,
  // TODO: Investigate and handle type changes
  isTouched: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  // TODO: Investigate and handle type changes
  isValid: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  // TODO: Investigate and handle type changes
  isInvalid: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  isLoading: PropTypes.bool,
  menuWidth: PropTypes.string,
  height: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  isClearable: PropTypes.bool,
  maxWidth: PropTypes.string,
  styles: PropTypes.objectOf(PropTypes.any),
};

SelectCustom.defaultProps = {
  defaultValue: {},
  isSearchable: true,
  displayValue: true,
  onBlur: () => null,
  isTouched: false,
  isValid: false,
  isInvalid: false,
  isLoading: false,
  menuWidth: '',
  height: '',
  disabled: false,
  placeholder: '',
  isClearable: false,
  maxWidth: 'auto',
  styles: {},
};

export default SelectCustom;
