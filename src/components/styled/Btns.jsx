import styled from 'styled-components';
import { Button } from 'react-bootstrap';

const BtnIcon = styled(Button).attrs({ variant: 'link' })`
  color: ${({ theme }) => theme.gray};
  &:hover {
    color: ${({ $hoverColor, theme }) => $hoverColor || theme.green};
  }
`;

const BtnMax = styled(Button).attrs({ variant: 'link' })`
  padding: 0;
  margin-right: 5px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.blue};

  &:hover,
  &:focus {
    text-decoration: none;
    color: #249ac2;
  }
`;

const BtnLink = styled(Button).attrs({
  variant: 'link',
})`
  color: ${({ theme }) => theme.gray};
  &:hover {
    color: ${({ theme }) => theme.green};
  }
`;

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

export { BtnIcon, BtnMax, BtnLink, BtnTransparent };
