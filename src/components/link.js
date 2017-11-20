import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

export default function InternalLink({
  to,
  ...props
}) {
  let location = { state: { eholdings: true } };

  if (typeof to === 'string') {
    location.pathname = to;
  } else {
    location = { ...to, ...location };
  }

  return (
    <Link to={location} {...props} />
  );
}

InternalLink.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};
