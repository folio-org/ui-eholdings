import React from 'react';
import PropTypes from 'prop-types';
import { formatISODateWithoutTime, formatYear } from '../utilities';

function compareCoverage(coverageObj1, coverageObj2) {
  return coverageObj1.beginCoverage < coverageObj2.beginCoverage;
}

function formatCoverageFullDate(coverageObj, intl) {
  let startDate = `${formatISODateWithoutTime(coverageObj.beginCoverage, intl)}`;
  let endDate = coverageObj.endCoverage ? `${formatISODateWithoutTime(coverageObj.endCoverage, intl)}` : 'Present';
  if (!startDate) {
    return coverageObj.endCoverage ? `${endDate}` : '';
  } else {
    return `${startDate} - ${endDate}`;
  }
}

function formatCoverageYear(coverageObj) {
  let startYear = `${formatYear(coverageObj.beginCoverage)}`;
  let endYear = `${formatYear(coverageObj.endCoverage)}`;
  if (!startYear) {
    return coverageObj.endCoverage ? `${endYear}` : '';
  } else if ((startYear === endYear) || (!endYear)) {
    return `${startYear}`;
  } else {
    return `${startYear} - ${endYear}`;
  }
}

export default function CoverageDates(props, context) {
  return (
    <div id={props.id} data-test-eholdings-customer-resource-show-managed-coverage-list >
      { props.coverageArray
        .sort((coverageObj1, coverageObj2) => compareCoverage(coverageObj1, coverageObj2))
        .map(coverageArrayObj => (props.isYearOnly ? formatCoverageYear(coverageArrayObj) : formatCoverageFullDate(coverageArrayObj, context.intl))).join(', ')}
    </div>
  );
}

CoverageDates.propTypes = {
  coverageArray: PropTypes.array,
  id: PropTypes.string,
  isYearOnly: PropTypes.bool
};

CoverageDates.contextTypes = {
  intl: PropTypes.object
};
