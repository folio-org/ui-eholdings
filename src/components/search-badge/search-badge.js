import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { IconButton } from '@folio/stripes/components';

const SearchBadge = ({ filterCount = 0, onClick, ...rest }) => (
  <FormattedMessage id="ui-eholdings.filter.togglePane">
    {([ariaLabel]) => (
      <div {...rest}>
        <IconButton
          icon="search"
          onClick={onClick}
          data-testid="search-badge"
          {...(filterCount > 0 ? { badgeCount: filterCount } : {})}
          ariaLabel={ariaLabel}
        />
      </div>
    )}
  </FormattedMessage>
);

SearchBadge.propTypes = {
  filterCount: PropTypes.number,
  onClick: PropTypes.func.isRequired,
};

export default SearchBadge;
