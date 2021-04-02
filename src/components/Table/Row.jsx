import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tbl } from '../styled/Tbl';
import useThemeContext from '../../hooks/useThemeContext';

const Row = forwardRef(({ cols, row, isCollapsible, collapseContent }, ref) => {
  const theme = useThemeContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggle = (e) => {
    // TODO: Refactor. Stop toggling when the element inside a row is pressed.
    if (
      e.target.tagName === 'BUTTON' ||
      e.target.tagName === 'svg' ||
      e.target.tagName === 'path' ||
      e.target.tagName === 'FORM' ||
      e.target.tagName === 'H3' ||
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'LABEL' ||
      e.target.classList?.contains('modal-header') ||
      e.target.classList?.contains('modal-body') ||
      e.target.classList?.contains('modal-content') ||
      e.target.classList?.contains('fade') ||
      e.target.parentElement?.tagName === 'FORM' ||
      e.target.parentElement?.classList?.contains('modal-header')
    ) {
      return;
    }
    setIsCollapsed((prev) => !prev);
  };

  return (
    <>
      <Tbl.Tr
        ref={ref}
        onClick={(e) => toggle(e)}
        type="row"
        isCollapsible={isCollapsible}
      >
        {cols.map((col) => (
          <Tbl.Td key={col.key}>
            {col.process ? col.process(row) : row[col.key]}
          </Tbl.Td>
        ))}
        {isCollapsible && (
          <Tbl.Td>
            <FontAwesomeIcon
              icon="chevron-down"
              color={theme.gray}
              rotation={isCollapsed ? 180 : 0}
              style={{ transition: 'all 0.3s ease' }}
            />
          </Tbl.Td>
        )}
      </Tbl.Tr>
      {isCollapsible && (
        <Tbl.TrCollapsible>
          <Tbl.TdCollapse colSpan="100%">
            <Tbl.Collapse in={isCollapsed}>
              <div>{collapseContent(row, isCollapsed)}</div>
            </Tbl.Collapse>
          </Tbl.TdCollapse>
        </Tbl.TrCollapsible>
      )}
    </>
  );
});

Row.propTypes = {
  cols: PropTypes.arrayOf(PropTypes.object).isRequired,
  row: PropTypes.objectOf(PropTypes.any).isRequired,
  isCollapsible: PropTypes.bool,
  collapseContent: PropTypes.node,
};

Row.defaultProps = {
  isCollapsible: false,
  collapseContent: <div />,
};

Row.displayName = 'Row';

export default Row;
