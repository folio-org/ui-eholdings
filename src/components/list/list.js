import React from 'react';
import PropTypes from 'prop-types';
import styles from './list.css';

export default function List({ className, ...props }) {
  return <ul className={[styles.list, className].join(' ')} {...props} />;
}

List.propTypes = {
  className: PropTypes.string
};
