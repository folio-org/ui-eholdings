import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from '@folio/stripes/components';
import styles from './full-view-link.css';

export default function FullViewLink({ to }) {
  return (
    <Button
      buttonClass={styles['full-view-link']}
      buttonStyle="dropdownItem fullWidth"
      to={to}
    >
      <FormattedMessage id="ui-eholdings.actionMenu.fullView" />
    </Button>
  );
}

FullViewLink.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};
