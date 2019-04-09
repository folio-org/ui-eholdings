import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';

export default function ContributorsList({ data }) {
  const contributorsByType = data.reduce((byType, contributor) => {
    byType[contributor.type] = byType[contributor.type] || [];
    byType[contributor.type].push(contributor.contributor);
    return byType;
  }, {});

  return (
    <div>
      {Object.keys(contributorsByType).map((contibutorType) => {
        const contributorTypeTranslation = contibutorType.toLowerCase();
        const names = contributorsByType[contibutorType];
        const label = (
          <FormattedMessage
            id={`ui-eholdings.contributorType.${contributorTypeTranslation}`}
            values={{
              count: names.length
            }}
          />
        );

        return (
          <div key={contibutorType} data-test-eholdings-contributors-list-item>
            <KeyValue label={label}>
              <div data-test-eholdings-contributor-names>
                {names.join('; ')}
              </div>
            </KeyValue>
          </div>
        );
      })}
    </div>
  );
}

ContributorsList.propTypes = {
  data: PropTypes.array
};
