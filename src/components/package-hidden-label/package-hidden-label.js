import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Icon, Tooltip } from '@folio/stripes/components';

const tooltipMessageIds = [null, 'ui-eholdings.hiddenSingleCategory', 'ui-eholdings.hiddenDualCategories', 'ui-eholdings.hiddenTripleCategories'];

const messageFromVisibility = (visibility) => {
  const hiddenCategories = visibility.filter(category => category.hidden);
  const hiddenCount = hiddenCategories.length;
  const messageId = tooltipMessageIds[hiddenCount];
  const categoryLabels = {};
  hiddenCategories.forEach((hiddenCategory, idx) => {
    categoryLabels[`category${idx + 1}`] = <FormattedMessage id={`ui-eholdings.hiddenCategory.${hiddenCategory.category}`} />;
  });
  return <FormattedMessage id={messageId} values={categoryLabels} />;
};

export const PackageHiddenLabel = ({
  id,
  visibility
}) => {
  const hasHiddenCategories = visibility?.some(category => category.hidden);

  if (!hasHiddenCategories) {
    return null;
  }

  const labelId = `label-${id}`;

  return (
    <Tooltip
      id={id}
      text={messageFromVisibility(visibility)}
    >
      {({ ref, ariaIds }) => (
        <span
          ref={ref}
          aria-labelledby={labelId}
          aria-describedby={ariaIds.text}
        >
          <Icon icon="eye-closed">
            <span id={labelId} data-test-hidden-label>
              <FormattedMessage id="ui-eholdings.hidden" />
            </span>
          </Icon>
        </span>
      )}
    </Tooltip>
  );
};

PackageHiddenLabel.propTypes = {
  id: PropTypes.string.isRequired,
  visibility: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string,
    hidden: PropTypes.bool,
  })),
};
