import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

/**
 *
 * This Link component is used to track the origination
 * of a link wether its from within the application or not.
 * Here the Link Component sets the state of eholdings to true. Checks
 * that 'to' is typeof string. Adds a property 'pathname' to location has
 * containing the 'pathname' that was passed in. Then is returns a new
 * <Link to={ location } {...props } /> component
 * with a location hash containing keys of pathname and state.
 *
 * ---  Usage   ---
 * import Link from 'link';
 *
 * <Link to={`/eholdings/providers/${record.providerId}/packages/${record.packageId}`}>{record.packageName}</Link>
 *
 * --- end Usage ---
 *
 * With this added data you can test wether a user
 * navigated to a section of the app via the use of links vs
 * pasting in URL to browser using the router history.
 *
 * ie. In comsuming component you can check router history.
 * let historyState = router.history.location.state;
 *
 * If you look at historyState it would be
 * -> Object { eholdings: true }
 *
 * However, if a user was to paste in the url
 * historyState will be undefined which is what we want.
 *
 */

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
