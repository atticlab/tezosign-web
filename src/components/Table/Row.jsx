import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tbl } from '../styled/Tbl';

const Row = forwardRef(({ cols, row, isCollapsible }, ref) => {
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
              flip={isCollapsed ? 'vertical' : 'horizontal'}
            />
          </Tbl.Td>
        )}
      </Tbl.Tr>
      {isCollapsible && (
        <Tbl.TrCollapsible isCollapsed={isCollapsed}>
          <td colSpan="100%">
            <div>{row.operation_id}</div>
          </td>
        </Tbl.TrCollapsible>
      )}
    </>
  );
});

Row.propTypes = {
  cols: PropTypes.arrayOf(PropTypes.object).isRequired,
  row: PropTypes.objectOf(PropTypes.any).isRequired,
  isCollapsible: PropTypes.bool,
};

Row.defaultProps = {
  isCollapsible: false,
};

Row.displayName = 'Row';

export default Row;
