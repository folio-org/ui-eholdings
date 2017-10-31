import React from 'react';
import PropTypes from 'prop-types';
import { formatISODateWithoutTime } from '../utilities';

export default function CoverageDates(props) {
  return (
    <div data-test-eholdings-customer-resource-show-managed-coverage-list >
      { props.coverageArray
        .sort((item1, item2) => item1.beginCoverage < item2.beginCoverage)
        .map(coverageArrayObj => (`${formatISODateWithoutTime(coverageArrayObj.beginCoverage, props.intl)} - ${formatISODateWithoutTime(coverageArrayObj.endCoverage, props.intl)}`)).join(', ')}
    </div>
  );
}

CoverageDates.propTypes = {
  coverageArray: PropTypes.array,
  intl: PropTypes.object
};
