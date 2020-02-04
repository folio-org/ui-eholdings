import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FormattedNumber, FormattedMessage } from 'react-intl';
import { Headline } from '@folio/stripes/components';

import shouldFocus from '../should-focus';
import styles from './package-list-item.css';
import InternalLink from '../internal-link';

const cx = classNames.bind(styles);

function PackageListItem({
  item,
  link,
  active,
  showTitleCount,
  showProviderName,
  packageName,
  onClick,
  headingLevel,
}) {
  return !item ? (
    <div
      className={cx('skeleton', {
        'is-provider-name-visible': showProviderName,
        'is-title-count-visible': showTitleCount
      })}
    />
  ) : (
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

      {showProviderName && (
        <div data-test-eholdings-package-list-item-provider-name>
          {item.providerName}
        </div>
      )}

      <div>
        <span data-test-eholdings-package-list-item-selected>
          {item.isSelected ?
            (<FormattedMessage id="ui-eholdings.selected" />) :
            (<FormattedMessage id="ui-eholdings.notSelected" />)}
        </span>

        {showTitleCount && (
          <span>
            &nbsp;&bull;&nbsp;

            <span data-test-eholdings-package-list-item-num-titles-selected>
              <FormattedNumber value={item.selectedCount} />
            </span>

            &nbsp;/&nbsp;

            <span data-test-eholdings-package-list-item-num-titles>
              <FormattedNumber value={item.titleCount} />
            </span>

            &nbsp;

            <span>
              {item.titleCount === 1 ?
                (<FormattedMessage id="ui-eholdings.label.title" />) :
                (<FormattedMessage id="ui-eholdings.label.titles" />)}
            </span>
          </span>
        )}
        {item.visibilityData.isHidden && (
          <span>
              &nbsp;&bull;&nbsp;
            <span data-test-eholdings-package-list-item-title-hidden>
              <FormattedMessage id="ui-eholdings.hidden" />
            </span>
          </span>
        )}
      </div>
    </InternalLink>
  );
}

PackageListItem.propTypes = {
  active: PropTypes.bool,
  headingLevel: PropTypes.string,
  item: PropTypes.object,
  link: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  onClick: PropTypes.func,
  packageName: PropTypes.string,
  showProviderName: PropTypes.bool,
  showTitleCount: PropTypes.bool
};

// this HOC adds a prop, `shouldFocus` that will focus the component's
// rendered DOM node on mount and update (when the prop is toggled)
export default shouldFocus(PackageListItem);
