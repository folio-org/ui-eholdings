import { Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  formatCoverageYear,
  formatCoverageFullDate,
  compareCoveragesToBeSortedInDescOrder,
} from '../utilities';

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
  coverageArray: PropTypes.arrayOf(PropTypes.shape({
    beginCoverage: PropTypes.string.isRequired,
    endCoverage: PropTypes.string.isRequired,
  })).isRequired,
  id: PropTypes.string,
  isManagedCoverage: PropTypes.bool,
  isYearOnly: PropTypes.bool,
};

CoverageDateList.defaultProps = {
  isManagedCoverage: false,
  isYearOnly: false,
};

export default CoverageDateList;
