import { flattenedIdentifiers } from '../../../constants';

export default function expandIdentifiers(identifiers) {
  return identifiers ? identifiers.map(({ id, flattenedType }) => {
    const flattenedTypeIndex = flattenedType || 0;

    return {
      id,
      ...flattenedIdentifiers[flattenedTypeIndex],
    };
  }) : [];
}
