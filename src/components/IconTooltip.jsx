import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const TooltipBox = styled.span`
  color: ${({ theme }) => theme.gray};
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.green};
  }
`;

const IconTooltip = ({ tooltipTxt }) => {
  return (
    <OverlayTrigger overlay={<Tooltip>{tooltipTxt}</Tooltip>}>
      <TooltipBox>
        <FontAwesomeIcon icon="question-circle" />
      </TooltipBox>
    </OverlayTrigger>
  );
};

IconTooltip.propTypes = {
  tooltipTxt: PropTypes.string.isRequired,
};

export default IconTooltip;
