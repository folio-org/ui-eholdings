import { flattenedIdentifiers } from '../constants';

export const expandIdentifiers = (identifiers) => {
  return identifiers ? identifiers.map(({ id, flattenedType }) => {
    const flattenedTypeIndex = flattenedType || 0;

    return {
      id,
      ...flattenedIdentifiers[flattenedTypeIndex],
    };
  }) : [];
};

export const mergeIdentifiers = (identifiers) => {
  return identifiers.map(({ id, type, subtype }) => {
    let mergedTypeIndex = 0;

    if (type && subtype) {
      mergedTypeIndex = flattenedIdentifiers.findIndex(row => row.type === type && row.subtype === subtype);
    }

    return {
      id,
      flattenedType: mergedTypeIndex,
    };
  });
};
