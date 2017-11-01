import React from 'react';
import PropTypes from 'prop-types';
import { formatISODateWithoutTime, formatYear } from '../utilities';

function sortCoverage(coverageObj1, coverageObj2) {
  return coverageObj1.beginCoverage < coverageObj2.beginCoverage;
}

function formatCoverageDate(coverageObj, intl, isYearOnly) {
  if (isYearOnly) {
    let startYear = `${formatYear(coverageObj.beginCoverage)}`;
    let endYear = coverageObj.endCoverage === null || coverageObj.endCoverage.trim() === '' ? '' : `${formatYear(coverageObj.endCoverage)}`;
    return startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`;
  } else {
    let startDate = `${formatISODateWithoutTime(coverageObj.beginCoverage, intl)}`;
    let endDate = coverageObj.endCoverage === null || coverageObj.endCoverage.trim() === '' ? 'Present' : `${formatISODateWithoutTime(coverageObj.endCoverage, intl)}`;
    return `${startDate} - ${endDate}`;
  }
}

export default function CoverageDates(props) {
  return (
    <div id={props.id} data-test-eholdings-customer-resource-show-managed-coverage-list >
      { props.coverageArray
        .sort((coverageObj1, coverageObj2) => sortCoverage(coverageObj1, coverageObj2))
        .map(coverageArrayObj => formatCoverageDate(coverageArrayObj, props.intl, props.isYearOnly)).join(', ')}
    </div>
  );
}

CoverageDates.propTypes = {
  coverageArray: PropTypes.array,
  intl: PropTypes.object,
  id: PropTypes.string,
  isYearOnly: PropTypes.bool
};
