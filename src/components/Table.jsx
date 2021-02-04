import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Table as BTable } from 'react-bootstrap';
import styled, { css } from 'styled-components';

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
  font-weight: normal;
  border-top: 1px solid ${({ theme }) => theme.lightGray} !important;
`;

const Table = ({
  cols,
  rows,
  maxHeight,
  stickyHeader,
  lastItem,
  isDataLoading,
}) => {
  const colKeys = useMemo(() => {
    return cols.map((field) => field.key);
  }, [cols]);

  const rowsFiltered = useMemo(() => {
    return rows.map((tx) => {
      return colKeys.reduce((acc, key) => {
        acc[key] = tx[key];

        return acc;
      }, {});
    });
  }, [rows, colKeys]);

  return (
    // <Tbl responsive>
    //   <thead>
    //     <tr>
    //       {cols.map((col, index) => (
    //         // eslint-disable-next-line react/no-array-index-key
    //         <Tbl.Th key={index}>{col.label ? col.label : col.key}</Tbl.Th>
    //       ))}
    //     </tr>
    //   </thead>
    //
    //   <tbody>
    //     {rowsFiltered.map((tx, index) => (
    //       // eslint-disable-next-line react/no-array-index-key
    //       <tr key={index}>
    //         {Object.keys(tx).map((field, index2) => (
    //           // eslint-disable-next-line react/no-array-index-key
    //           <Tbl.Td key={index2}>{tx[field]}</Tbl.Td>
    //         ))}
    //       </tr>
    //     ))}
    //   </tbody>
    // </Tbl>

    <TblWrap maxHeight={maxHeight}>
      <Tbl responsive>
        <thead>
          <tr>
            {cols.map((col, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Tbl.Th key={index} stickyHeader={stickyHeader}>
                {col.label ? col.label : col.key}
              </Tbl.Th>
            ))}
          </tr>
        </thead>

        <tbody>
          {(!rowsFiltered || !rowsFiltered.length) && !isDataLoading ? (
            <tr>
              <td colSpan="100%">No data</td>
            </tr>
          ) : (
            rowsFiltered.map((row, index) => {
              if (rowsFiltered.length === index + 1) {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <tr key={index} ref={lastItem}>
                    {Object.keys(row).map((field, index2) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <Tbl.Td key={index2}>{row[field]}</Tbl.Td>
                    ))}
                  </tr>
                );
              }
              return (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={index}>
                  {Object.keys(row).map((field, index2) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Tbl.Td key={index2}>{row[field]}</Tbl.Td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </Tbl>
    </TblWrap>
  );
};

Table.propTypes = {
  cols: PropTypes.arrayOf(PropTypes.object).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  maxHeight: PropTypes.string,
  stickyHeader: PropTypes.bool,
  lastItem: PropTypes.func,
  isDataLoading: PropTypes.bool,
};

Table.defaultProps = {
  // cols: [{}],
  // rows: [{}],
  maxHeight: '100%',
  stickyHeader: false,
  lastItem: () => null,
  isDataLoading: false,
};

export default Table;
