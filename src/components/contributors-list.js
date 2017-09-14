import React from 'react';
import PropTypes from 'prop-types';
import KeyValueLabel from './key-value-label';
import capitalize from 'lodash/capitalize';

export default function ContributorsList({ data }) {
  let contributorsByType = data.reduce(function (byType, contributor) {
    byType[contributor.type] = byType[contributor.type] || [];
    byType[contributor.type].push(contributor.contributor);
    return byType;
  }, {});

  return (
    <div>
      {Object.keys(contributorsByType).map((key) => {
        let names = contributorsByType[key];
        key = capitalize(key);

        // would be better with a pluralization tool
        if(names.length > 1) {
          key = `${key}s`;
        }

        return (
          <div key={key} data-test-eholdings-contributors-list-item>
            <KeyValueLabel label={key}>
              {names.join('; ')}
            </KeyValueLabel>
          </div>
        );
      })}
    </div>
  );
}

ContributorsList.propTypes = {
  data: PropTypes.array
};
