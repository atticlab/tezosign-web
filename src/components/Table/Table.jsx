import React from 'react';
import PropTypes from 'prop-types';
import { TblWrap, Tbl } from '../styled/Tbl';
import Row from './Row';

const Table = ({
  cols,
  rows,
  maxHeight,
  stickyHeader,
  lastItem,
  isDataLoading,
  isCollapsible,
}) => {
  return (
    <TblWrap maxHeight={maxHeight}>
      <Tbl responsive>
        <thead>
          <tr>
            {cols.map((col) => (
              <Tbl.Th key={col.key} stickyHeader={stickyHeader}>
                {col.label ? col.label : col.key}
              </Tbl.Th>
            ))}
            {isCollapsible && <Tbl.Th stickyHeader={stickyHeader} />}
          </tr>
        </thead>

        <tbody>
          {(!rows || !rows.length) && !isDataLoading ? (
            <tr>
              <td colSpan="100%">No data</td>
            </tr>
          ) : (
            rows.map((row, index) => {
              if (rows.length === index + 1) {
                return (
                  <Row
                    ref={lastItem}
                    key={row.operation_id}
                    cols={cols}
                    row={row}
                    isCollapsible={isCollapsible}
                  />
                );
              }
              return (
                <Row
                  key={row.operation_id}
                  cols={cols}
                  row={row}
                  isCollapsible={isCollapsible}
                />
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
  isCollapsible: PropTypes.bool,
};

Table.defaultProps = {
  maxHeight: '100%',
  stickyHeader: false,
  lastItem: () => null,
  isDataLoading: false,
  isCollapsible: false,
};

export default Table;
