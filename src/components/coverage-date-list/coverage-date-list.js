import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedDate, FormattedMessage } from 'react-intl';

const containsNonEmptyObjectsWithStringValues = (propValue, key, componentName, location, propFullName) => {
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

class CoverageDateList extends React.Component {
  static propTypes = {
    coverageArray: PropTypes.arrayOf(containsNonEmptyObjectsWithStringValues),
    id: PropTypes.string,
    isYearOnly: PropTypes.bool
  };

  compareCoveragesToBeSortedInDescOrder(coverageObj1, coverageObj2) {
    return new Date(coverageObj2.beginCoverage) - new Date(coverageObj1.beginCoverage);
  }

  formatCoverageFullDate({ beginCoverage, endCoverage }) {
    let startDate = beginCoverage ?
      <FormattedDate value={beginCoverage} timeZone="UTC" /> :
      '';

    let endDate = endCoverage ?
      <FormattedDate value={endCoverage} timeZone="UTC" /> :
      <FormattedMessage id="ui-eholdings.date.present" />;

    if (!startDate) {
      return endCoverage ? endDate : '';
    } else {
      return (
        <Fragment>
          {startDate}
          {' - '}
          {endDate}
        </Fragment>
      );
    }
  }

  formatCoverageYear({ beginCoverage, endCoverage }) {
    let startYear = beginCoverage ?
      <FormattedDate value={beginCoverage} timeZone="UTC" year="numeric" /> :
      '';

    let endYear = endCoverage ?
      <FormattedDate value={endCoverage} timeZone="UTC" year="numeric" /> :
      '';

    if (!startYear) {
      return endCoverage ? endYear : '';
    } else if ((moment.utc(beginCoverage).format('YYYY') === moment.utc(endCoverage).format('YYYY')) || (!endYear)) {
      return startYear;
    } else {
      return (
        <Fragment>
          {startYear}
          {' - '}
          {endYear}
        </Fragment>
      );
    }
  }

  render() {
    let {
      coverageArray,
      id,
      isYearOnly
    } = this.props;

    const dateRanges = [...coverageArray].sort(this.compareCoveragesToBeSortedInDescOrder);

    return (
      <div id={id} data-test-eholdings-display-coverage-list>
        {
          dateRanges.map((coverageArrayObj, i) => (
            <Fragment key={i}>
              {i > 0 && ', '}
              {
                isYearOnly
                  ? this.formatCoverageYear(coverageArrayObj)
                  : this.formatCoverageFullDate(coverageArrayObj)
              }
            </Fragment>
          ))
        }
      </div>
    );
  }
}

export default CoverageDateList;
