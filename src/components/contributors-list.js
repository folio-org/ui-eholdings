import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import { KeyValue } from '@folio/stripes/components';

export default function ContributorsList({ data }) {
  let contributorsByType = data.reduce((byType, contributor) => {
    byType[contributor.type] = byType[contributor.type] || [];
    byType[contributor.type].push(contributor.contributor);
    return byType;
  }, {});

  return (
    <div>
      {Object.keys(contributorsByType).map((key) => {
        let names = contributorsByType[key];
        let capitalizedKey = capitalize(key);

        // would be better with a pluralization tool
        if (names.length > 1) {
          capitalizedKey = `${capitalizedKey}s`;
        }

        return (
          <div key={key} data-test-eholdings-contributors-list-item>
            <KeyValue label={capitalizedKey}>
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
