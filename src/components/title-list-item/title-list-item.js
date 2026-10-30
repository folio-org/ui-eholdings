import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { Headline } from '@folio/stripes/components';

import InternalLink from '../internal-link';
import IdentifiersList from '../identifiers-list';
import ContributorsList from '../contributors-list';

import styles from './title-list-item.css';

const cx = classNames.bind(styles);
const CONTRIBUTORS_LIMIT = 3;

const TitleListItem = ({
  item,
  link,
  active,
  showPublisherAndType,
  showContributors,
  showIdentifiers,
  onClick,
  headingLevel
}) => {
  const hasContributors = item?.contributors?.length > 0 && showContributors;
  const hasPublisherOrType = showPublisherAndType && (item?.publicationType || item?.publisherName);
  const hasIdentifiers = item?.identifiers?.length > 0 && showIdentifiers;
  const showPublisherContributorSeparator = hasPublisherOrType && hasContributors;

  return !item
    ? (
      <div
        className={cx('skeleton', {
          'is-publisher-and-type-visible': showPublisherAndType
        })}
        data-testid="skeleton-element"
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
        data-testid="title-list-item-link"
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
      </InternalLink>
    );
};

TitleListItem.propTypes = {
  active: PropTypes.bool,
  headingLevel: PropTypes.string,
  item: PropTypes.shape({
    contributors: PropTypes.arrayOf(PropTypes.shape({
      contributor: PropTypes.string,
      type: PropTypes.string,
    })),
    identifiers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      subtype: PropTypes.string,
      type: PropTypes.string,
    })),
    name: PropTypes.string,
    publicationType: PropTypes.string,
    publisherName: PropTypes.string,
  }),
  link: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  onClick: PropTypes.func,
  showContributors: PropTypes.bool,
  showIdentifiers: PropTypes.bool,
  showPublisherAndType: PropTypes.bool,
};

export default TitleListItem;
