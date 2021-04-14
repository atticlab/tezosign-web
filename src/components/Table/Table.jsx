import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { TblWrap, Tbl } from '../styled/Tbl';
import Row from './Row';
import useSortableData from '../../hooks/useSortableData';
import { FlexCenter } from '../styled/Flex';
import useThemeContext from '../../hooks/useThemeContext';

const WrapIcons = styled.div`
  display: inline-flex;
  flex-direction: column;
  padding-left: 5px;
`;

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
  nestedObjectKey,
}) => {
  const { listRows, requestSort, sortConfig } = useSortableData(
    rows,
    nestedObjectKey,
  );
  const theme = useThemeContext();

  return (
    <TblWrap maxHeight={maxHeight}>
      <Tbl responsive>
        <thead>
          <tr>
            {cols.map((col) => (
              <Tbl.Th
                key={col.key}
                stickyHeader={stickyHeader}
                isSortable={col.isSortable}
                onClick={() => {
                  if (!col.isSortable) return;
                  requestSort(col.key);
                }}
              >
                <FlexCenter>
                  {col.label ? col.label : col.key}

                  {col.key !== 'Actions' && (
                    <WrapIcons>
                      <FontAwesomeIcon
                        icon="caret-up"
                        style={{ marginBottom: '-7px' }}
                        color={
                          sortConfig.key === col.key &&
                          sortConfig.direction === 'ascending'
                            ? theme.black
                            : theme.gray
                        }
                      />
                      <FontAwesomeIcon
                        icon="caret-down"
                        color={
                          sortConfig.key === col.key &&
                          sortConfig.direction === 'descending'
                            ? theme.black
                            : theme.gray
                        }
                      />
                    </WrapIcons>
                  )}
                </FlexCenter>
              </Tbl.Th>
            ))}
            {isCollapsible && <Tbl.Th stickyHeader={stickyHeader} />}
          </tr>
        </thead>

        <tbody>
          {(!listRows || !listRows.length) && !isDataLoading ? (
            <tr>
              <td colSpan="100%">No data</td>
            </tr>
          ) : (
            listRows.map((row, index) => {
              if (listRows.length === index + 1) {
                return (
                  <Row
                    ref={lastItem}
                    key={row[rowKey]}
                    cols={cols}
                    row={row}
                    isCollapsible={isCollapsible}
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
  nestedObjectKey: PropTypes.string,
};

Table.defaultProps = {
  maxHeight: '100%',
  stickyHeader: false,
  lastItem: () => null,
  isDataLoading: false,
  isCollapsible: false,
  collapseContent: () => null,
  nestedObjectKey: '',
};

export default Table;
