export default {
  container: (base, state) => {
    return {
      ...base,
      maxWidth: state.selectProps.isSearchable
        ? '100%'
        : state.selectProps.maxWidth,
    };
  },
  control: (base, state) => ({
    ...base,
    cursor: 'pointer',
    minHeight: 'auto',
    height: state.selectProps.height || '100%',
    borderColor:
      // eslint-disable-next-line no-nested-ternary
      state.selectProps.isTouched && state.selectProps.isInvalid
        ? state.theme.colors.danger
        : state.selectProps.isTouched && state.selectProps.isValid
        ? state.theme.colors.primary
        : '#c4c4c4',
    '&:hover': {
      borderColor:
        // eslint-disable-next-line no-nested-ternary
        state.selectProps.isTouched && state.selectProps.isInvalid
          ? state.theme.colors.danger
          : state.selectProps.isTouched && state.selectProps.isValid
          ? state.theme.colors.primary
          : '#c4c4c4',
    },
    boxShadow:
      // eslint-disable-next-line no-nested-ternary
      state.isFocused && state.selectProps.isValid
        ? '0 0 0 0.2rem rgba(39, 241, 144, 0.25)'
        : state.isFocused && state.selectProps.isInvalid
        ? '0 0 0 0.2rem rgba(249, 69, 45, 0.25)'
        : '',
  }),
  valueContainer: (base, state) => ({
    ...base,
    padding: state.selectProps.displayValue ? '2px 8px' : 0,
    width: state.selectProps.displayValue ? 'auto' : 0,
    minWidth: state.selectProps.displayValue ? '30px' : 0,
    fontWeight: 300,
    fontSize: '14px',
  }),
  menu: (provided, state) => ({
    ...provided,
    position: 'absolute',
    right: 0,
    width: state.selectProps.menuWidth
      ? state.selectProps.menuWidth
      : 'max-content',
    fontSize: '14px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05)',
    border: 0,
    marginTop: '1px',
    zIndex: 50,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
    transition: 'transform 0.2s',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : '',
    '&:hover': {
      color: 'inherit',
    },
  }),
  indicatorSeparator: (base, state) => ({
    ...base,
    display: state.selectProps.displayValue ? 'flex' : 'none',
  }),
  option: (base) => ({
    ...base,
    padding: '4px 10px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: '2px 8px',
  }),
};
