import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from '@folio/stripes/components';
import styles from './full-view-link.css';

export default function FullViewLink({ to, onClick }) {
  return (
    <Button
      buttonClass={styles['full-view-link']}
      buttonStyle="dropdownItem fullWidth"
      to={to}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <FormattedMessage id="ui-eholdings.actionMenu.fullView" />
    </Button>
  );
}

FullViewLink.propTypes = {
  onClick: PropTypes.func,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};
