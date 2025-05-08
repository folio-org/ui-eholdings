import PropTypes from 'prop-types';

import { OptionSegment } from '@folio/stripes/components';

const propTypes = {
  option: PropTypes.object,
  searchTerm: PropTypes.string,
};

const FacetOptionFormatter = ({ option = null, searchTerm = '' }) => {
  if (!option || !option?.value) {
    return null;
  }

  return (
    <OptionSegment
      searchTerm={searchTerm}
      innerText={`${option.label} (${option.totalRecords})`}
    />
  );
};

FacetOptionFormatter.propTypes = propTypes;

export default FacetOptionFormatter;
