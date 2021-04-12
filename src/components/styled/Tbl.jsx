import styled, { css } from 'styled-components';
import { Table as BTable, Collapse } from 'react-bootstrap';

const TblGenInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

TblGenInfo.Item = styled.span`
  margin: 20px 30px 20px 0;
  text-transform: capitalize;
  font-size: 16px;

  &:last-child {
    margin-right: 0;
  }
`;

const TblWrap = styled.div`
  .table-responsive {
    max-height: ${({ maxHeight }) => maxHeight};
    overflow-y: auto;
  }
`;

const Tbl = styled(BTable)`
  margin-bottom: 0;
  text-align: center;
  font-size: ${({ theme }) => theme.fs14};
  color: ${({ theme }) => theme.black};
  background-color: white;
`;

Tbl.Th = styled.th`
  cursor: pointer;
  text-transform: uppercase;
  border: none !important;
  background-color: white;
  color: ${({ theme }) => theme.gray};
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
  border-top: 0 !important;
  vertical-align: middle !important;
  padding: 0.55rem !important;
`;

Tbl.Tr = styled.tr`
  cursor: ${({ isCollapsible }) => (isCollapsible ? 'pointer' : 'initial')};

  &:hover {
    transition: background-color 0.15s;
    background-color: ${({ theme }) => theme.lightGray};
  }
`;

Tbl.TrCollapsible = styled.tr`
  box-shadow: inset 0 3px 6px -3px rgb(0 0 0 / 20%),
    inset 0 -3px 6px -3px rgb(0 0 0 / 20%);
`;

Tbl.TdCollapse = styled.td`
  overflow: hidden;
  padding: 0 !important;
  border: none !important;
`;

Tbl.Collapse = styled(Collapse)`
  transition: all 0.2s linear;
  margin: 0.75rem;
`;

export { TblGenInfo, TblWrap, Tbl };
