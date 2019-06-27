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
    </div>
  );
}

ContributorsList.propTypes = {
  data: PropTypes.array
};
