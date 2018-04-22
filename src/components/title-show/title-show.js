import React from 'react';
import PropTypes from 'prop-types';
import { KeyValue } from '@folio/stripes-components';

import { processErrors } from '../utilities';
import DetailsView from '../details-view';
import QueryList from '../query-list';
import PackageListItem from '../package-list-item';
import IdentifiersList from '../identifiers-list';
import ContributorsList from '../contributors-list';
import DetailsViewSection from '../details-view-section';
import Toaster from '../toaster';
import styles from './title-show.css';

export default function TitleShow({
  model,
  packages,
  fetchPackages,
  searchPackages,
  searchParams
}, {
  queryParams
}) {
  let actionMenuItems = [];

  if (queryParams.searchType) {
    actionMenuItems.push({
      label: 'Full view',
      to: {
        pathname: `/eholdings/titles/${model.id}`,
        state: { eholdings: true }
      },
      className: styles['full-view-link']
    });
  }

  return (
    <div>
      <Toaster toasts={processErrors(model)} position="bottom" />

      <DetailsView
        type="title"
        model={model}
        paneTitle={model.name}
        actionMenuItems={actionMenuItems}
        bodyContent={(
          <DetailsViewSection label="Title information">
            <ContributorsList data={model.contributors} />

            <KeyValue label="Publisher">
              <div data-test-eholdings-title-show-publisher-name>
                {model.publisherName}
              </div>
            </KeyValue>

            {model.publicationType && (
              <KeyValue label="Publication Type">
                <div data-test-eholdings-title-show-publication-type>
                  {model.publicationType}
                </div>
              </KeyValue>
            )}

            <IdentifiersList data={model.identifiers} />

            {model.subjects.length > 0 && (
              <KeyValue label="Subjects">
                <div data-test-eholdings-title-show-subjects-list>
                  {model.subjects.map(subjectObj => subjectObj.subject).join('; ')}
                </div>
              </KeyValue>
            )}
          </DetailsViewSection>
        )}
        enableListSearch={model.resources.length > 0}
        listType="packages"
        onSearch={searchPackages}
        searchParams={searchParams}
        renderList={scrollable => {
          return model.resources.length > 0 && (
            <QueryList
              type="title-packages"
              fetch={fetchPackages}
              collection={packages}
              length={packages.length}
              scrollable={scrollable}
              itemHeight={70}
              renderItem={item => (
                <PackageListItem
                  link={item.content && `/eholdings/resources/${item.content.id}`}
                  packageName={item.content && item.content.packageName}
                  item={item.content}
                  headingLevel='h4'
                />
              )}
            />
          );
        }}
      />
    </div>
  );
}

TitleShow.propTypes = {
  model: PropTypes.object.isRequired,
  packages: PropTypes.object.isRequired,
  fetchPackages: PropTypes.func.isRequired,
  searchPackages: PropTypes.func.isRequired,
  searchParams: PropTypes.object.isRequired
};

TitleShow.contextTypes = {
  router: PropTypes.object,
  queryParams: PropTypes.object
};
