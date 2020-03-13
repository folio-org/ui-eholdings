import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FormattedNumber, FormattedMessage } from 'react-intl';
import { Headline, Icon } from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes-core';
import shouldFocus from '../should-focus';
import styles from './search-package-list-item.css';
import InternalLink from '../internal-link';
import { APP_ICON_NAME } from '../../constants';

const cx = classNames.bind(styles);

function SearchPackageListItem({
  item,
  link,
  active,
  packageName,
  onClick,
  headingLevel,
}) {
  return !item
    ? (
      <div
        className={cx('skeleton', 'is-provider-name-visible')}
      />
    )
    : (
      <InternalLink
        data-test-eholdings-package-list-item
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
          data-test-eholdings-package-list-item-name
          margin="none"
          size="medium"
          tag={headingLevel || 'h3'}
        >
          {packageName || item.name}
        </Headline>

        <div data-test-eholdings-package-list-item-provider-name>
          {item.providerName}
        </div>

        <div className={cx('itemMetadata')}>
          <AppIcon
            app={APP_ICON_NAME}
            iconKey='selectedPackage'
            size='small'
            className={cx('item', 'selection-status', {
              'not-selected': !item.isSelected,
            })}
          >
            <span data-test-eholdings-package-list-item-selected>
              {item.isSelected ?
                (<FormattedMessage
                  id="ui-eholdings.selectedCount"
                  values={{
                    count: <FormattedNumber value={item.selectedCount} />
                  }}
                />) :
                (<FormattedMessage id="ui-eholdings.notSelected" />)}
            </span>
          </AppIcon>

          <span>
            <FormattedMessage
              id="ui-eholdings.label.totalTitles"
              values={{
                count: <span data-test-eholdings-package-list-item-num-titles><FormattedNumber value={item.titleCount} /></span>
              }}
            />
          </span>

          {item.visibilityData.isHidden && (
            <Icon
              icon="eye-closed"
            >
              <span data-test-eholdings-package-list-item-title-hidden>
                <FormattedMessage id="ui-eholdings.hidden" />
              </span>
            </Icon>
          )}
        </div>
      </InternalLink>
    );
}

SearchPackageListItem.propTypes = {
  active: PropTypes.bool,
  headingLevel: PropTypes.string,
  item: PropTypes.object,
  link: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  onClick: PropTypes.func,
  packageName: PropTypes.string,
};

// this HOC adds a prop, `shouldFocus` that will focus the component's
// rendered DOM node on mount and update (when the prop is toggled)
export default shouldFocus(SearchPackageListItem);
