import PropTypes from 'prop-types';

import { Icon } from '@folio/stripes/components';

import styles from './external-link.css';

const ExternalLink = ({
  href,
  target,
  rel,
}) => (
  <a href={href} target={target} rel={rel}>
    {href}
    {' '}
    <span
      data-test-eholdings-resource-show-external-link-icon
      className={styles['external-link-icon']}
    >
      <Icon icon="external-link" size="small" color="currentColor" />
    </span>
  </a>
);

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  rel: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
};

export default ExternalLink;
