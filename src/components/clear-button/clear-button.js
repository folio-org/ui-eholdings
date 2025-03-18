import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { IconButton } from '@folio/stripes/components';

const propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

const ClearButton = ({
  show,
  label,
  className,
  onClick,
}) => {
  const intl = useIntl();

  if (!show) {
    return null;
  }
  return (
    <IconButton
      className={className}
      size="small"
      iconSize="small"
      icon="times-circle-solid"
      aria-label={intl.formatMessage({ id: 'stripes-components.filterGroups.clearFilterSetLabel' }, {
        labelText: label,
      })}
      onClick={onClick}
    />
  );
};

ClearButton.propTypes = propTypes;

export { ClearButton };
