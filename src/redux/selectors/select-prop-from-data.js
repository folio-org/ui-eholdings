import { get } from 'lodash';

export default function selectPropFromData(store, type) {
  return get(store, `eholdings.data.${type}`, {});
}
