import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@folio/stripes/components';
import classNames from 'classnames/bind';
import styles from './external-link.css';

classNames.bind(styles);

export default function ExternalLink(props) {
  return (
    <a href={props.href} target={props.target} rel={props.rel}>
      {props.href}
      {' '}
      <span data-test-eholdings-resource-show-external-link-icon className={styles['external-link-icon']}>
        <Icon icon="external-link" size="small" color="currentColor" />
      </span>
    </a>
  );
}

ExternalLink.propTypes = {
  href: PropTypes.string,
  rel: PropTypes.string,
  target: PropTypes.string
};
