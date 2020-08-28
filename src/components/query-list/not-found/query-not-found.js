import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames/bind';
import styles from '../query-list.css';

const cx = classnames.bind(styles);

const propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['provider-packages', 'package-titles']).isRequired,
};

const QueryNotFound = ({ children, type }) => (
  <div
    className={cx('error', 'not-found')}
    data-test-query-list-not-found={type}
  >
    {children}
  </div>
);

QueryNotFound.propTypes = propTypes;

export default QueryNotFound;
