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
import styles from './title-show.css';

export default function TitleShow({ model }, { router }) {
  let historyState = router.history.location.state;
  let queryString = router.route.location.search;

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
        {model.isLoaded ? (
          <div>
            <div className={styles['detail-container-header']}>
              <KeyValueLabel label="Title">
                <h1 data-test-eholdings-title-show-title-name>
                  {model.name}
                </h1>
              </KeyValueLabel>
            </div>

            <ContributorsList data={model.contributors} />

            <KeyValueLabel label="Publisher">
              <div data-test-eholdings-title-show-publisher-name>
                {model.publisherName}
              </div>
            </KeyValueLabel>

            <KeyValueLabel label="Publication Type">
              <div data-test-eholdings-title-show-publication-type>
                {model.publicationType}
              </div>
            </KeyValueLabel>

            <IdentifiersList data={model.identifiers} />

            {model.subjects.length > 0 && (
              <KeyValueLabel label="Subjects">
                <div data-test-eholdings-title-show-subjects-list>
                  {model.subjects.map(subjectObj => subjectObj.subject).join('; ')}
                </div>
              </KeyValueLabel>
            ) }

            <hr />
            <h3>Packages</h3>
            <List data-test-eholdings-title-show-package-list>
              {model.customerResources.isLoading ? (
                <Icon icon="spinner-ellipsis" />
              ) : model.customerResources.map(item => (
                <PackageListItem
                  key={item.id}
                  item={item}
                  link={`/eholdings/customer-resources/${item.id}`}
                  packageName={item.packageName}
                />
              ))}
            </List>
          </div>
        ) : model.request.isRejected ? (
          <p data-test-eholdings-title-show-error>
            {model.request.errors[0].title}
          </p>
        ) : model.isLoading ? (
          <Icon icon="spinner-ellipsis" />
        ) : null}
      </div>
    </div>
  );
}

TitleShow.propTypes = {
  model: PropTypes.object.isRequired
};

TitleShow.contextTypes = {
  router: PropTypes.object
};
