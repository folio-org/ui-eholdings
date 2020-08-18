import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@folio/stripes/components';

import css from './noResultsMessage.css';

const propTypes = {
  children: PropTypes.node.isRequired,
};

const NoResultsMessage = ({ children, ...rest }) => {
  return (
    <div className={css.noResultsMessage} {...rest}>
      <p className={css.noResultsMessageLabelWrap}>
        <Icon icon="search" />
        <span className={css.noResultsMessageLabel}>{children}</span>
      </p>
    </div>
  );
};

NoResultsMessage.propTypes = propTypes;

export default NoResultsMessage;
