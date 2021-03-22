import styled from 'styled-components';
import { Button } from 'react-bootstrap';

const BtnTransparent = styled(Button).attrs({
  className: 'btn btn-primary',
})`
  background-color: ${({ theme }) => theme.green15};
  color: ${({ theme }) => theme.green};
  border: 0;
  font-weight: 400;

  &:hover {
    background-color: rgba(34, 211, 105, 0.25);
    color: ${({ theme }) => theme.green};
  }
  &:focus {
    background-color: rgba(34, 211, 105, 0.35);
    color: ${({ theme }) => theme.green};
  }
  &:not(:disabled):not(.disabled):active {
    background-color: rgba(34, 211, 105, 0.45);
    color: ${({ theme }) => theme.green};
  }
`;

export default BtnTransparent;
