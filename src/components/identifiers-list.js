import React from 'react';
import PropTypes from 'prop-types';
import KeyValueLabel from './key-value-label';

export default function IdentifiersList({ data }) {
  let types = {
    0: 'ISSN',
    1: 'ISBN',
    2: 'TSDID',
    3: 'SPID',
    4: 'EjsJournaID',
    5: 'NewsbankID',
    6: 'ZDBID',
    7: 'EPBookID',
    8: 'Mid',
    9: 'BHM'
  };

  let subtypes = {
    0: 'Empty',
    1: 'Print',
    2: 'Online',
    3: 'Preceding',
    4: 'Succeeding',
    5: 'Regional',
    6: 'Linking',
    7: 'Invalid'
  };

  let typesCount = Object.keys(types).length;
  let subtypesCount = Object.keys(subtypes).length;

  // turn type and subtype ids into strings
  let identifiersWithCompoundTypes = data.map((identifier) => {
    let compoundType = types[identifier.type];

    if(identifier.type >= typesCount) {
      compoundType = 'Unknown Identifier';
    }

    if(identifier.subtype > 0 && identifier.subtype < subtypesCount) {
      compoundType = `${compoundType} (${subtypes[identifier.subtype]})`;
    }

    return {
      id: identifier.id,
      compoundType
    }
  });

  // group by type/subtype combination
  let identifiersByType = identifiersWithCompoundTypes.reduce(function (byType, identifier) {
    let key = identifier.compoundType;
    byType[key] = byType[key] || [];
    byType[key].push(identifier.id);
    return byType;
  }, {});

  return (
    <div>
      {Object.keys(identifiersByType).map((key) => {
        return (
          <div key={key} data-test-eholdings-identifiers-list-item>
            <KeyValueLabel label={key}>
              {identifiersByType[key].join(' ')}
            </KeyValueLabel>
          </div>
        );
      })}
    </div>
  );
}

IdentifiersList.propTypes = {
  data: PropTypes.array
};
