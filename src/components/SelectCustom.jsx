import React, { useState } from 'react';
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
  placeholder,
  height,
  onChange,
  onBlur,
  value,
}) => {
  const option = options.map((el) => ({
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
      defaultValue={defaultValue}
      onInputChange={inputChange}
      isSearchable={isSearchable}
      isTouched={isTouched}
      isValid={isValid}
      isInvalid={isInvalid}
      isDisabled={disabled}
      displayValue={displayValue}
      className={isInvalid ? 'is-invalid' : ''}
      styles={selectStyle}
      value={value.value ? value : null}
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
  value: PropTypes.objectOf(PropTypes.any),
  menuWidth: PropTypes.string,
  height: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
};

SelectCustom.defaultProps = {
  defaultValue: {},
  isSearchable: true,
  displayValue: true,
  onBlur: () => null,
  isTouched: false,
  isValid: false,
  isInvalid: false,
  menuWidth: '',
  height: '',
  disabled: false,
  value: {},
  placeholder: '',
};

export default SelectCustom;
