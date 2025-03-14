import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';

const ContributorsList = ({
  data,
  showInline = false,
  contributorsInlineLimit = 3,
}) => {
  const contributorsByType = data.reduce((byType, contributor) => {
    byType[contributor.type] = byType[contributor.type] || [];
    byType[contributor.type].push(contributor.contributor);
    return byType;
  }, {});
  const showKeyValueList = () => (
    <>
      {Object.keys(contributorsByType).map((contributorType) => {
        const names = contributorsByType[contributorType];
        const label = (
          <FormattedMessage
            id={`ui-eholdings.contributorType.${contributorType}`}
            values={{
              count: names.length
            }}
          />
        );

        return (
          <div key={contributorType} data-test-eholdings-contributors-list-item>
            <KeyValue label={label}>
              <div data-test-eholdings-contributor-names>
                {names.join('; ')}
              </div>
            </KeyValue>
          </div>
        );
      })}
    </>
  );

  const showInlineList = (numberOfFirstElements) => {
    let contributorsJointList = '';

    if (numberOfFirstElements && data.length > numberOfFirstElements) {
      contributorsJointList = data
        .slice(0, numberOfFirstElements)
        .map((contributorObj) => contributorObj.contributor)
        .join('; ') + '...';
    } else {
      contributorsJointList = data
        .map((contributorObj) => contributorObj.contributor)
        .join('; ');
    }

    return (
      <>
        <FormattedMessage id='ui-eholdings.label.contributors' />
        &#58;&nbsp;
        <span data-test-eholdings-contributors-inline-list-item>
          {contributorsJointList}
        </span>
      </>
    );
  };

  return showInline ? showInlineList(contributorsInlineLimit) : showKeyValueList();
};

ContributorsList.propTypes = {
  contributorsInlineLimit: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.shape({
    contributor: PropTypes.string,
    type: PropTypes.string,
  })).isRequired,
  showInline: PropTypes.bool,
};

export default ContributorsList;
