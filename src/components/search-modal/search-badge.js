import PropTypes from 'prop-types';

import {
  IconButton
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

export default function SearchBadge({ filterCount = 0, onClick, ...rest }) {
  return (
    <FormattedMessage id="ui-eholdings.filter.togglePane">
      {([ariaLabel]) => (
        <div {...rest}>
          <IconButton
            icon="search"
            onClick={onClick}
            data-test-eholdings-search-filters="icon"
            data-testid="search-badge"
            {...filterCount > 0 ? { badgeCount: filterCount } : {}}
            ariaLabel={ariaLabel}
          />
        </div>
      )}
    </FormattedMessage>
  );
}

SearchBadge.propTypes = {
  filterCount: PropTypes.number,
  onClick: PropTypes.func.isRequired,
};
