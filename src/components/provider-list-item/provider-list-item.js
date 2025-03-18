import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FormattedNumber, FormattedMessage } from 'react-intl';
import { Headline } from '@folio/stripes/components';

import InternalLink from '../internal-link';
import SelectedLabel from '../selected-label';

import styles from './provider-list-item.css';

const cx = classNames.bind(styles);

const ProviderListItem = ({
  item,
  link,
  active = false,
  onClick,
  headingLevel = 'h3',
}) => {
  return !item
    ? (
      <div
        className={styles.skeleton}
        data-testid="skeleton-element"
      />
    )
    : (
      <InternalLink
        data-test-eholdings-provider-list-item
        to={link}
        className={cx('item', {
          'is-selected': active,
        })}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();
            onClick();
          }
        }}
        data-testid="provider-list-item-link"
      >
        <Headline
          data-test-eholdings-provider-list-item-name
          margin="none"
          size="medium"
          tag={headingLevel}
        >
          {item.name}
        </Headline>

        <div
          data-test-eholdings-provider-list-item-selections
          className={cx('itemMetadata')}
        >
          <SelectedLabel
            isSelected={!!item.packagesSelected}
            selectedCount={item.packagesSelected}
            showSelectedCount
          />

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
};

ProviderListItem.propTypes = {
  active: PropTypes.bool,
  headingLevel: PropTypes.string,
  item: PropTypes.object,
  link: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  ]),
  onClick: PropTypes.func,
};

export default ProviderListItem;
