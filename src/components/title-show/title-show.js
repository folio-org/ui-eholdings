import React from 'react';
import PropTypes from 'prop-types';

import Icon from '@folio/stripes-components/lib/Icon';
import PaneHeader from '@folio/stripes-components/lib/PaneHeader';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';

import KeyValueLabel from '../key-value-label';
import List from '../list';
import PackageListItem from '../package-list-item';
import IdentifiersList from '../identifiers-list';
import ContributorsList from '../contributors-list';
import { formatPublicationType } from '../utilities';
import styles from './title-show.css';

export default function TitleShow({
  title
}, { router }) {
  let record = title.content;
  const historyState = router.history.location.state;
  const queryString = router.history.location.search;

  return (
    <div>
      { !queryString && (
        <PaneHeader
          firstMenu={historyState && historyState.eholdings && (
            <PaneMenu>
              <button data-test-eholdings-title-show-back-button onClick={() => router.history.goBack()}><Icon icon="left-arrow" /></button>
            </PaneMenu>
          )}
        />
      )}
      <div className={styles['detail-container']} data-test-eholdings-title-show>
        {title.isResolved ? (
          <div>
            <div className={styles['detail-container-header']}>
              <KeyValueLabel label="Title">
                <h1 data-test-eholdings-title-show-title-name>
                  {record.titleName}
                </h1>
              </KeyValueLabel>
            </div>

            <ContributorsList data={record.contributorsList} />

            <KeyValueLabel label="Publisher">
              <div data-test-eholdings-title-show-publisher-name>
                {record.publisherName}
              </div>
            </KeyValueLabel>

            <KeyValueLabel label="Publication Type">
              <div data-test-eholdings-title-show-publication-type>
                {formatPublicationType(record.pubType)}
              </div>
            </KeyValueLabel>

            <IdentifiersList data={record.identifiersList} />

            {record.subjectsList.length > 0 && (
              <KeyValueLabel label="Subjects">
                <div data-test-eholdings-title-show-subjects-list>
                  {record.subjectsList.map(subjectObj => subjectObj.subject).join('; ')}
                </div>
              </KeyValueLabel>
            ) }

            <hr />
            <h3>Packages</h3>
            <List data-test-eholdings-title-show-package-list>
              {record.customerResourcesList.map(item => (
                <PackageListItem
                  key={item.packageId}
                  item={item}
                  link={`/eholdings/vendors/${item.vendorId}/packages/${item.packageId}/titles/${record.titleId}`}
                />
              ))}
            </List>
          </div>
        ) : title.isRejected ? (
          <p data-test-eholdings-title-show-error>
            {title.error.length ? title.error[0].message : title.error.message}
          </p>
        ) : (
          <Icon icon="spinner-ellipsis" />
        )}
      </div>
    </div>
  );
}

TitleShow.propTypes = {
  title: PropTypes.object.isRequired
};

TitleShow.contextTypes = {
  router: PropTypes.object
};
