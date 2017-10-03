import React from 'react';
import PropTypes from 'prop-types';
import KeyValueLabel from './key-value-label';

export default function IdentifiersList({ data }) {
  let types = {
    0: 'ISSN',
    1: 'ISBN'
  };

  let subtypes = {
    0: 'Empty',
    1: 'Print',
    2: 'Online'
  };

  // get rid of identifiers we received that aren't ISSN or ISBN
  let filteredData = data.filter(identifier => (identifier.type === 0 || identifier.type === 1) && (identifier.type >= 0 || identifier.type <= 2));

  // turn type and subtype ids into strings
  let identifiersWithCompoundTypes = filteredData.map((identifier) => {
    let compoundType = types[identifier.type];

    if (identifier.subtype > 0) {
      compoundType = `${compoundType} (${subtypes[identifier.subtype]})`;
    }

    return {
      id: identifier.id,
      compoundType
    };
  });

  // group by type/subtype combination
  let identifiersByType = identifiersWithCompoundTypes.reduce((byType, identifier) => {
    let key = identifier.compoundType;
    byType[key] = byType[key] || [];
    byType[key].push(identifier.id);
    return byType;
  }, {});

  return (
    <div>
      {Object.keys(identifiersByType).map(key => (
        <div key={key} data-test-eholdings-identifiers-list-item>
          <KeyValueLabel label={key}>
            {identifiersByType[key].join(' ')}
          </KeyValueLabel>
        </div>
      ))}
    </div>
  );
}

IdentifiersList.propTypes = {
  data: PropTypes.array
};
