import axe from 'axe-core';


const getAxe = () => {
  axe.reset();
  axe.configure({
    rules: [{
      id: 'meta-viewport',
      enabled: false,
    }, {
      id: 'landmark-one-main',
      enabled: false,
    }, {
      id: 'page-has-heading-one',
      enabled: false,
    }, {
      id: 'bypass',
      enabled: false,
    }],
  });

  return axe;
};

export default getAxe;
