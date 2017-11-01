import React from 'react';
import PropTypes from 'prop-types';
import { formatISODateWithoutTime, formatYear } from '../utilities';

function sortCoverage(coverageObj1, coverageObj2) {
  return coverageObj1.beginCoverage < coverageObj2.beginCoverage;
}

function formatCoverageFullDate(coverageObj, intl) {
  let startDate = `${formatISODateWithoutTime(coverageObj.beginCoverage, intl)}`;
  let endDate = coverageObj.endCoverage === null || coverageObj.endCoverage.trim() === '' ? 'Present' : `${formatISODateWithoutTime(coverageObj.endCoverage, intl)}`;
  return `${startDate} - ${endDate}`;
}

function formatCoverageYear(coverageObj) {
  let startYear = `${formatYear(coverageObj.beginCoverage)}`;
  let endYear = coverageObj.endCoverage === null || coverageObj.endCoverage.trim() === '' ? '' : `${formatYear(coverageObj.endCoverage)}`;
  if (startYear === endYear) {
    return `${startYear}`;
  } else if (endYear === '') {
    return `${startYear}`;
  } else {
    return `${startYear} - ${endYear}`;
  }
}

export default function CoverageDates(props) {
  return (
    <div id={props.id} data-test-eholdings-customer-resource-show-managed-coverage-list >
      { props.coverageArray
        .sort((coverageObj1, coverageObj2) => sortCoverage(coverageObj1, coverageObj2))
        .map(coverageArrayObj => (props.isYearOnly ? formatCoverageYear(coverageArrayObj) : formatCoverageFullDate(coverageArrayObj, props.intl))).join(', ')}
    </div>
  );
}

CoverageDates.propTypes = {
  coverageArray: PropTypes.array,
  intl: PropTypes.object,
  id: PropTypes.string,
  isYearOnly: PropTypes.bool
};
