import styled from 'styled-components';
import { Dropdown } from 'react-bootstrap';

Dropdown.Toggle = styled(Dropdown.Toggle)`
  &:after {
    display: none;
  }
`;

Dropdown.Menu = styled(Dropdown.Menu)`
  padding: 0;
  border: 0;
  box-shadow: ${({ theme }) => theme.borderShadow};

  .dropdown-item {
    transition: color, background-color 0.15s;
    font-size: 14px;
    padding: 4px 10px;
    color: ${({ theme }) => theme.black};

    &:hover {
      background-color: rgba(34, 211, 105, 0.25);
    }

    &:active {
      background-color: rgba(34, 211, 105, 0.5);
      color: ${({ theme }) => theme.black};
    }

    &:focus {
      background-color: rgba(34, 211, 105, 0.5);
      outline: rgba(38, 210, 129, 0.5) auto 1px;
    }

    &.disabled {
      background-color: ${({ theme }) => theme.lightGray};
      color: ${({ theme }) => theme.gray};
    }
  }
`;

// eslint-disable-next-line import/prefer-default-export
export { Dropdown };
