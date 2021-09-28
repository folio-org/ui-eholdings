import { configureAxe } from 'jest-axe';

const getAxe = (config = {}) => {
  return configureAxe({
    rules: {
      'meta-viewport': { enabled: false },
      'landmark-one-main': { enabled: false },
      'page-has-heading-one': { enabled: false },
      'bypass': { enabled: false },
    },
    ...config,
  });
};

export default getAxe;
