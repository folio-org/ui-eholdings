import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@folio/stripes/components';

import css from './NoResultsMessage.css';

const propTypes = {
  children: PropTypes.node.isRequired,
};

const NoResultsMessage = ({ children, ...rest }) => {
  return (
    <div className={css.noResultsMessage} {...rest}>
      <div className={css.noResultsMessageLabelWrap}>
        <Icon iconRootClass={css.noResultsMessageIcon} icon="search" />
        <span className={css.noResultsMessageLabel}>{children}</span>
      </div>
    </div>
  );
};

NoResultsMessage.propTypes = propTypes;

export default NoResultsMessage;
