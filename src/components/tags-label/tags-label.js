import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const propTypes = { tagList: PropTypes.array.isRequired };

const TagsLabel = ({ tagList }) => (
  <span data-test-tags-label>
    <FormattedMessage
      id="ui-eholdings.label.tags"
      values={{ tags: tagList.join(', ') }}
    />
  </span>
);

TagsLabel.propTypes = propTypes;

export default TagsLabel;
