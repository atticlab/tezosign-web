import styled, { css } from 'styled-components';
import { Table as BTable } from 'react-bootstrap';

const TblWrap = styled.div`
  .table-responsive {
    max-height: ${({ maxHeight }) => maxHeight};
    overflow-y: auto;
  }
`;

const Tbl = styled(BTable)`
  margin-bottom: 0;
  text-align: center;
  font-size: 16px;
  color: ${({ theme }) => theme.black};
`;

Tbl.Th = styled.th`
  text-transform: uppercase;
  border: none !important;
  background-color: white;
  ${({ stickyHeader }) =>
    stickyHeader
      ? css`
          position: sticky;
          top: 0;
          z-index: 2;
        `
      : ''};
`;

Tbl.Td = styled.td`
  font-size: 14px;
  border-top: 1px solid ${({ theme }) => theme.lightGray} !important;
`;

Tbl.Tr = styled.tr`
  cursor: ${({ isCollapsible }) => (isCollapsible ? 'pointer' : 'initial')};

  &:hover {
    transition: background-color 0.15s;
    background-color: ${({ theme }) => theme.lightGray3};
  }
`;

Tbl.TrCollapsible = styled.tr`
  box-shadow: inset 0 3px 6px -3px rgb(0 0 0 / 20%);
  display: ${({ isCollapsed }) => (isCollapsed ? 'table-row' : 'none')};
`;

export { TblWrap, Tbl };
