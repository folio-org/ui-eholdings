import React from 'react';
import PropTypes from 'prop-types';

import CustomCoverageDate from '../custom-coverage-date/custom-coverage-date';

export default function PackageCustomCoverage({ onSubmit, isPending, intl, beginCoverage, endCoverage }) {
  return (
    <CustomCoverageDate onSubmit={onSubmit} isPending={isPending} intl={intl} initialValues={{ beginCoverage, endCoverage }} />
  );
}

PackageCustomCoverage.propTypes = {
  beginCoverage: PropTypes.string,
  endCoverage: PropTypes.string,
  onSubmit: PropTypes.func,
  isPending: PropTypes.bool,
  intl: PropTypes.object
};

