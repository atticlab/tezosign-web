import React from 'react';
import PropTypes from 'prop-types';
import IconTooltip from './IconTooltip';
import { FlexAlignItemsCenter } from './styled/Flex';
import { FormLabel } from './styled/Forms';

const FormLabelWithTooltip = ({ labelTxt, tooltipTxt }) => {
  return (
    <FlexAlignItemsCenter style={{ marginBottom: '0.2rem', gap: '5px' }}>
      <FormLabel style={{ marginBottom: 0 }}>{labelTxt}</FormLabel>
      <IconTooltip tooltipTxt={tooltipTxt} />
    </FlexAlignItemsCenter>
  );
};

FormLabelWithTooltip.propTypes = {
  labelTxt: PropTypes.string.isRequired,
  tooltipTxt: PropTypes.string.isRequired,
};

export default FormLabelWithTooltip;
