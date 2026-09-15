import { FormattedMessage } from 'react-intl';

import { Icon, Tooltip } from '@folio/stripes/components';
import PropTypes from 'prop-types';

const tooltipMessageIds = [null, 'ui-eholdings.hiddenSingleCategory', 'ui-eholdings.hiddenDualCategories', 'ui-eholdings.hiddenTripleCategories'];
const categoryLabelMessageId = (category) => {
  return `ui-eholdings.hiddenCategory.${category}`;
};

// This is only ever called with more than one hidden category.
const messageFromVisibility = (visibility) => {
  const hiddenCategories = visibility.filter(category => category.hidden);
  const hiddenCount = hiddenCategories.length;
  const messageId = tooltipMessageIds[hiddenCount];
  const categoryLabels = {};
  hiddenCategories.forEach((hiddenCategory, idx) => {
    categoryLabels[`category${idx + 1}`] = <FormattedMessage id={categoryLabelMessageId(hiddenCategory.category)} />;
  });
  return <FormattedMessage id={messageId} values={categoryLabels} />;
};

const HiddenLabel = ({
  id,
  visibility
}) => {
  return (
    <Tooltip
      id={id}
      text={messageFromVisibility(visibility)}
    >
      {({ ref, ariaIds }) => (
        <Icon
          icon="eye-closed"
          ref={ref}
          aria-labelledby={ariaIds.text}
        >
          <span data-test-hidden-label>
            <FormattedMessage id="ui-eholdings.hidden" />
          </span>
        </Icon>
      )}
    </Tooltip>
  );
};

HiddenLabel.propTypes = {
  id: PropTypes.string,
  visibility: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string,
    hidden: PropTypes.bool,
  })),
};

export default HiddenLabel;
