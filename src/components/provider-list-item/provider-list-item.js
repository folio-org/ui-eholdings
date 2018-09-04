import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FormattedNumber, FormattedMessage } from 'react-intl';

import shouldFocus from '../should-focus';
import styles from './provider-list-item.css';
import Link from '../link';

const cx = classNames.bind(styles);

function ProviderListItem({ item, link, active, onClick, headingLevel }) {
  let Heading = headingLevel || 'h3';

  return !item ? (
    <div className={styles.skeleton} />
  ) : (
    <Link
      data-test-eholdings-provider-list-item
      to={link}
      className={cx('item', {
        'is-selected': active
      })}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Heading data-test-eholdings-provider-list-item-name>
        {item.name}
      </Heading>

      <div data-test-eholdings-provider-list-item-selections>
        <span data-test-eholdings-provider-list-item-num-packages-selected>
          <FormattedNumber value={item.packagesSelected} />
        </span>

        &nbsp;/&nbsp;

        <span data-test-eholdings-provider-list-item-num-packages-total>
          <FormattedNumber value={item.packagesTotal} />
        </span>

        &nbsp;

        <span>
          {item.packagesTotal === 1 ?
            (<FormattedMessage id="ui-eholdings.label.package" />) :
            (<FormattedMessage id="ui-eholdings.label.packages" />)}
        </span>
      </div>
    </Link>
  );
}

ProviderListItem.propTypes = {
  item: PropTypes.object,
  link: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  active: PropTypes.bool,
  onClick: PropTypes.func,
  headingLevel: PropTypes.string
};

// this HOC adds a prop, `shouldFocus` that will focus the component's
// rendered DOM node on mount and update (when the prop is toggled)
export default shouldFocus(ProviderListItem);
