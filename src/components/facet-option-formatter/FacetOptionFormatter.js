import PropTypes from 'prop-types';

import { OptionSegment } from '@folio/stripes/components';

const propTypes = {
  option: PropTypes.object,
  searchTerm: PropTypes.string,
};

const FacetOptionFormatter = ({ option, searchTerm }) => {
  if (!option) {
    return null;
  }

  return (
    <OptionSegment
      searchTerm={searchTerm}
      innerText={`${option.label} (${option.totalRecords})`}
    />
  );
};

FacetOptionFormatter.defaultProps = {
  option: null,
  searchTerm: '',
};

FacetOptionFormatter.propTypes = propTypes;

export default FacetOptionFormatter;
