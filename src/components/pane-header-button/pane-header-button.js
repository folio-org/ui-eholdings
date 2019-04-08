import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import {
  Button
} from '@folio/stripes/components';

import styles from './pane-header-button.css';

classNames.bind(styles);

export default function PaneHeaderButton(props) {
  const { children, ...rest } = props;
  return (
    <Button
      buttonClass={styles['pane-header-button']}
      {...rest}
    >
      {children}
    </Button>
  );
}

PaneHeaderButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ])
};
