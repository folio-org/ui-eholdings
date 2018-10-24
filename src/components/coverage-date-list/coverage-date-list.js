import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

class CoverageDateList extends React.Component {
  static propTypes = {
    coverageArray: PropTypes.array,
    id: PropTypes.string,
    intl: intlShape.isRequired,
    isYearOnly: PropTypes.bool
  };

  compareCoveragesToBeSortedInDescOrder(coverageObj1, coverageObj2) {
    return new Date(coverageObj2.beginCoverage) - new Date(coverageObj1.beginCoverage);
  }

  formatCoverageFullDate({ beginCoverage, endCoverage }) {
    let startDate = beginCoverage ?
      `${this.props.intl.formatDate(beginCoverage, { timeZone: 'UTC' })}` :
      '';

    let endDate = endCoverage ?
      `${this.props.intl.formatDate(endCoverage, { timeZone: 'UTC' })}` :
      `${this.props.intl.formatMessage({ id: 'ui-eholdings.date.present' })}`;

    if (!startDate) {
      return endCoverage ? `${endDate}` : '';
    } else {
      return `${startDate} - ${endDate}`;
    }
  }

  formatCoverageYear({ beginCoverage, endCoverage }) {
    let startYear = beginCoverage ?
      `${this.props.intl.formatDate(beginCoverage, { timeZone: 'UTC', year: 'numeric' })}` :
      '';

    let endYear = endCoverage ?
      `${this.props.intl.formatDate(endCoverage, { timeZone: 'UTC', year: 'numeric' })}` :
      '';

    if (!startYear) {
      return endCoverage ? `${endYear}` : '';
    } else if ((startYear === endYear) || (!endYear)) {
      return `${startYear}`;
    } else {
      return `${startYear} - ${endYear}`;
    }
  }

  render() {
    let {
      coverageArray,
      id,
      isYearOnly
    } = this.props;

    return (
      <div id={id} data-test-eholdings-display-coverage-list>
        {
          [...coverageArray]
            .sort(this.compareCoveragesToBeSortedInDescOrder)
            .map(coverageArrayObj => (
              isYearOnly
                ? this.formatCoverageYear(coverageArrayObj)
                : this.formatCoverageFullDate(coverageArrayObj)
            ))
            .join(', ')
        }
      </div>
    );
  }
}

export default injectIntl(CoverageDateList);
