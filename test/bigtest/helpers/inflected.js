import { camelize as _camelize, underscore, pluralize } from 'inflected';

function camelize(arg) {
  return _camelize(underscore(arg), false);
}

export { pluralize, camelize };
