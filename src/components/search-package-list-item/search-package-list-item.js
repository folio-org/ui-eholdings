import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import isEmpty from 'lodash/isEmpty';
import {
  FormattedNumber,
  FormattedMessage,
} from 'react-intl';

import { Headline } from '@folio/stripes/components';

import InternalLink from '../internal-link';
import HiddenLabel from '../hidden-label';
import SelectedLabel from '../selected-label';
import TagsLabel from '../tags-label';

import styles from './search-package-list-item.css';

const cx = classNames.bind(styles);

const SearchPackageListItem = ({
  item,
  link,
  active,
  packageName,
  onClick,
  headingLevel,
  showProviderName = false,
  showTitleCount = false,
  showSelectedCount = false,
  showTags = false,
}) => {
  return !item
    ? (
      <div
        className={cx('skeleton', 'is-provider-name-visible')}
        data-testid="skeleton-element"
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
        data-testid="search-package-list-item-link"
      >
        <Headline
          data-test-eholdings-package-list-item-name
          margin="none"
          size="medium"
          tag={headingLevel || 'h3'}
        >
          {packageName || item.name}
        </Headline>

        {showProviderName &&
          <div data-test-eholdings-package-list-item-provider-name>
            {item.providerName}
          </div>
        }

        <div className={cx('itemMetadata')}>
          <SelectedLabel
            isSelected={item.isSelected}
            selectedCount={item.selectedCount}
            showSelectedCount={showSelectedCount}
          />

          {showTitleCount &&
            <span data-test-total-title-label>
              <FormattedMessage
                id="ui-eholdings.label.totalTitles"
                values={{
                  count: <span data-test-eholdings-package-list-item-num-titles><FormattedNumber value={item.titleCount} /></span>
                }}
              />
            </span>
          }

          {item.visibilityData.isHidden && <HiddenLabel />}

          {(showTags && !isEmpty(item.tags.tagList)) && <TagsLabel tagList={item.tags.tagList} />}
        </div>
      </InternalLink>
    );
};

SearchPackageListItem.propTypes = {
  active: PropTypes.bool,
  headingLevel: PropTypes.string,
  item: PropTypes.shape({
    isSelected: PropTypes.bool,
    name: PropTypes.string,
    providerName: PropTypes.string,
    selectedCount: PropTypes.number,
    tags: PropTypes.shape({
      tagList: PropTypes.arrayOf(PropTypes.string),
    }),
    titleCount: PropTypes.number,
    visibilityData: PropTypes.shape({
      isHidden: PropTypes.bool,
    }),
  }),
  link: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]).isRequired,
  onClick: PropTypes.func,
  packageName: PropTypes.string,
  showProviderName: PropTypes.bool,
  showSelectedCount: PropTypes.bool,
  showTags: PropTypes.bool,
  showTitleCount: PropTypes.bool,
};

export default SearchPackageListItem;
