import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FormattedNumber, FormattedMessage } from 'react-intl';
import { Headline } from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes-core';

import shouldFocus from '../should-focus';
import styles from './provider-list-item.css';
import InternalLink from '../internal-link';
import { APP_ICON_NAME } from '../../constants';

const cx = classNames.bind(styles);

function ProviderListItem({ item, link, active, onClick, headingLevel }) {
  return !item ? (
    <div className={styles.skeleton} />
  ) : (
    <InternalLink
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
      <Headline
        data-test-eholdings-provider-list-item-name
        margin="none"
        size="medium"
        tag={headingLevel || 'h3'}
      >
        {item.name}
      </Headline>

      <div
        data-test-eholdings-provider-list-item-selections
        className={cx('itemMetadata')}
      >
        <AppIcon
          app={APP_ICON_NAME}
          iconKey='selectedPackage'
          size='small'
          className={cx('item', 'selection-status', {
            'not-selected': !item.packagesSelected,
          })}
        >
          <span data-test-eholdings-package-list-item-selected>
            {item.packagesSelected
              ? (<FormattedMessage
                id="ui-eholdings.selectedCount"
                values={{
                  count: (
                    <span data-test-eholdings-provider-list-item-num-packages-selected>
                      <FormattedNumber value={item.packagesSelected} />
                    </span>
                  )
                }}
              />)
              : <FormattedMessage id="ui-eholdings.notSelected" />
            }
          </span>
        </AppIcon>

        <span>
          <FormattedMessage
            id="ui-eholdings.label.totalPackages"
            values={{
              count: (
                <span data-test-eholdings-provider-list-item-num-packages-total>
                  <FormattedNumber value={item.packagesTotal} />
                </span>
              )
            }}
          />
        </span>
      </div>
    </InternalLink>
  );
}

ProviderListItem.propTypes = {
  active: PropTypes.bool,
  headingLevel: PropTypes.string,
  item: PropTypes.object,
  link: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  onClick: PropTypes.func
};

// this HOC adds a prop, `shouldFocus` that will focus the component's
// rendered DOM node on mount and update (when the prop is toggled)
export default shouldFocus(ProviderListItem);
