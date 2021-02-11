import React from 'react';
import PropTypes from 'prop-types';

const OperationDetails = ({ operation }) => {
  return <div>{operation}</div>;
};

OperationDetails.propTypes = {
  operation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OperationDetails;
