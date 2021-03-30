import React from 'react';
import PropTypes from 'prop-types';
import { TblWrap, Tbl } from '../styled/Tbl';
import Row from './Row';

const Table = ({
  cols,
  rows,
  rowKey,
  maxHeight,
  stickyHeader,
  lastItem,
  isDataLoading,
  isCollapsible,
  collapseContent,
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
                    key={row[rowKey]}
                    cols={cols}
                    row={row}
                    isCollapsible={isCollapsible}
                    // collapseContent={collapseContent(row)}
                    collapseContent={collapseContent}
                  />
                );
              }
              return (
                <Row
                  key={row[rowKey]}
                  cols={cols}
                  row={row}
                  isCollapsible={isCollapsible}
                  // collapseContent={collapseContent(row)}
                  collapseContent={collapseContent}
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
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  maxHeight: PropTypes.string,
  stickyHeader: PropTypes.bool,
  lastItem: PropTypes.func,
  isDataLoading: PropTypes.bool,
  isCollapsible: PropTypes.bool,
  collapseContent: PropTypes.func,
};

Table.defaultProps = {
  maxHeight: '100%',
  stickyHeader: false,
  lastItem: () => null,
  isDataLoading: false,
  isCollapsible: false,
  collapseContent: () => null,
};

export default Table;
