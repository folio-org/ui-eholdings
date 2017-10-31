import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './coverage-dates.css';
import { formatISODateWithoutTime, isBookPublicationType } from '../utilities';

const cx = classNames.bind(styles);

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
  id: PropTypes.string,
  intl: PropTypes.object
};
