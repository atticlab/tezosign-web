import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tbl } from '../styled/Tbl';

const Row = forwardRef(({ cols, row, isCollapsible, collapseContent }, ref) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggle = (e) => {
    if (e.target.type) return;
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
              color="#cacaca"
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
              <div>{collapseContent}</div>
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
