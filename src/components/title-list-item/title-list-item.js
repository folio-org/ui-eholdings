import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import isEmpty from 'lodash/isEmpty';

import { Headline } from '@folio/stripes/components';

import shouldFocus from '../should-focus';
import InternalLink from '../internal-link';
import IdentifiersList from '../identifiers-list';
import ContributorsList from '../contributors-list';
import TagsLabel from '../tags-label';

import styles from './title-list-item.css';
import HiddenLabel from '../hidden-label';
import SelectedLabel from '../selected-label/selected-label';

const cx = classNames.bind(styles);
const CONTRIBUTORS_LIMIT = 3;

function TitleListItem({
  item,
  link,
  active,
  showSelected,
  showPublisherAndType,
  showContributors,
  showIdentifiers,
  onClick,
  headingLevel
}) {
  const hasContributors = item?.contributors?.length > 0 && showContributors;
  const hasPublisherOrType = showPublisherAndType && (item?.publicationType || item?.publisherName);
  const hasIdentifiers = item?.identifiers?.length > 0 && showIdentifiers;
  const showPublisherContributorSeparator = hasPublisherOrType && hasContributors;

  return !item
    ? (
      <div
        className={cx('skeleton', {
          'is-selected-visible': showSelected,
          'is-publisher-and-type-visible': showPublisherAndType
        })}
      />
    )
    : (
      <InternalLink
        data-test-eholdings-title-list-item
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
          data-test-eholdings-title-list-item-title-name
          margin="none"
          size="medium"
          tag={headingLevel || 'h3'}
        >
          {item.name}
        </Headline>

        {showPublisherAndType && (
          <div>
            {item.publicationType && (
              <span data-test-eholdings-title-list-item-publication-type>
                {item.publicationType}
              </span>
            )}
            {item.publisherName && (
              <span>
                &nbsp;&bull;&nbsp;
                <span data-test-eholdings-title-list-item-publisher-name>
                  {item.publisherName}
                </span>
              </span>
            )}
            {showPublisherContributorSeparator && (
              <span>
                &nbsp;&bull;&nbsp;
              </span>
            )}
            {hasContributors && (
              <ContributorsList
                data={item.contributors}
                showInline
                contributorsInlineLimit={CONTRIBUTORS_LIMIT}
              />
            )}
          </div>
        )}

        {hasIdentifiers && (
          <IdentifiersList
            data={item.identifiers}
            displayInline
          />
        )}

        {showSelected && (
          <div className={cx('itemMetadata')}>
            <SelectedLabel isSelected={item.isSelected} />

            {item.visibilityData.isHidden && <HiddenLabel />}

            {!isEmpty(item.tags.tagList) && <TagsLabel tagList={item.tags.tagList} />}
          </div>
        )}
      </InternalLink>
    );
}

TitleListItem.propTypes = {
  active: PropTypes.bool,
  headingLevel: PropTypes.string,
  item: PropTypes.object,
  link: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  onClick: PropTypes.func,
  showContributors: PropTypes.bool,
  showIdentifiers: PropTypes.bool,
  showPublisherAndType: PropTypes.bool,
  showSelected: PropTypes.bool,
};

// this HOC adds a prop, `shouldFocus` that will focus the component's
// rendered DOM node on mount and update (when the prop is toggled)
export default shouldFocus(TitleListItem);
