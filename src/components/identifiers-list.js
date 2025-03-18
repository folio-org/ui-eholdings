import PropTypes from 'prop-types';
import { KeyValue } from '@folio/stripes/components';

const IdentifiersList = ({ data, displayInline = false }) => {
  // get rid of identifiers we received that aren't ISSN or ISBN
  const filteredData = data.filter(identifier => ['ISSN', 'ISBN'].includes(identifier.type));

  // turn type and subtype into compound types
  const identifiersWithCompoundTypes = filteredData.map((identifier) => {
    let compoundType = identifier.type;

    if (identifier.subtype !== 'Empty') {
      compoundType = `${identifier.type} (${identifier.subtype})`;
    }

    return {
      id: identifier.id,
      compoundType
    };
  });

  // group by type/subtype combination
  const identifiersByType = identifiersWithCompoundTypes.reduce((byType, identifier) => {
    const key = identifier.compoundType;
    byType[key] = byType[key] || [];
    byType[key].push(identifier.id);
    return byType;
  }, {});

  const getKeyValueList = () => {
    return (
      <>
        {Object.keys(identifiersByType).map(key => (
          <div key={key} data-test-eholdings-identifiers-list-item>
            <KeyValue label={key}>
              <div data-test-eholdings-identifier-id>
                {identifiersByType[key].join(', ')}
              </div>
            </KeyValue>
          </div>
        ))}
      </>
    );
  };

  const getInlineList = () => {
    const identifiersStringArr = [];
    Object.keys(identifiersByType).map(key => (
      identifiersStringArr.push(`${key}: ${identifiersByType[key].join(', ')}`)
    ));

    return (
      <div data-test-eholdings-identifiers-inline-list-item>
        {identifiersStringArr.join(' • ')}
      </div>
    );
  };

  return displayInline ? getInlineList() : getKeyValueList();
};

IdentifiersList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    subtype: PropTypes.string,
    type: PropTypes.string,
  })),
  displayInline: PropTypes.bool,
};

export default IdentifiersList;
