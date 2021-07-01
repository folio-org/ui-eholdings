import { Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  formatCoverageYear,
  formatCoverageFullDate,
  compareCoveragesToBeSortedInDescOrder,
} from '../utilities';

const containsNonEmptyObjectsWithStringValues = (propValue, key, componentName, propFullName) => {
  const BEGIN_COVERAGE = 'beginCoverage';
  const END_COVERAGE = 'endCoverage';
  const error = new Error(`Invalid prop \`${propFullName}\` supplied to \`${componentName}\`. Validation failed.`);

  const curObject = propValue[key];
  const curObjectKeys = Object.keys(curObject);
  const containsBeginCoverageProp = curObjectKeys.includes(BEGIN_COVERAGE);
  const containsEndCoverageProp = curObjectKeys.includes(END_COVERAGE);
  const doesNotContainBeginAndEndCoverage = !containsBeginCoverageProp && !containsEndCoverageProp;
  const beginCoverageIsNotOfStringType = containsBeginCoverageProp && typeof curObject.beginCoverage !== 'string';
  const endCoverageIsNotOfStringType = containsEndCoverageProp && typeof curObject.endCoverage !== 'string';
  const propTypeIsWrong = doesNotContainBeginAndEndCoverage
    || beginCoverageIsNotOfStringType
    || endCoverageIsNotOfStringType;

  return propTypeIsWrong ? error : null;
};

const CoverageDateList = ({
  coverageArray,
  id,
  isYearOnly,
  isManagedCoverage,
}) => {
  const dateRanges = [...coverageArray].sort(compareCoveragesToBeSortedInDescOrder);

  return (
    <div
      id={id}
      data-test-eholdings-display-coverage-list
      data-testid={`coverage-list-${isManagedCoverage ? 'managed' : 'custom'}`}
    >
      {
        dateRanges.map((coverageArrayObj, i) => (
          <Fragment key={i}>
            {i > 0 && ', '}
            {
              isYearOnly
                ? formatCoverageYear(coverageArrayObj)
                : formatCoverageFullDate(coverageArrayObj)
            }
          </Fragment>
        ))
      }
    </div>
  );
};

CoverageDateList.propTypes = {
  coverageArray: PropTypes.arrayOf(containsNonEmptyObjectsWithStringValues).isRequired,
  id: PropTypes.string.isRequired,
  isManagedCoverage: PropTypes.bool,
  isYearOnly: PropTypes.bool,
};

CoverageDateList.defaultProps = {
  isManagedCoverage: false,
  isYearOnly: false,
};

export default CoverageDateList;
