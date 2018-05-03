import React from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  KeyValue,
  PaneMenu
} from '@folio/stripes-components';

import { processErrors } from '../../utilities';
import DetailsView from '../../details-view';
import ScrollView from '../../scroll-view';
import PackageListItem from '../../package-list-item';
import IdentifiersList from '../../identifiers-list';
import ContributorsList from '../../contributors-list';
import DetailsViewSection from '../../details-view-section';
import Toaster from '../../toaster';
import styles from './title-show.css';

export default function TitleShow({ model }, { queryParams, router }) {
  let actionMenuItems = [];

  if (model.isTitleCustom) {
    actionMenuItems.push({
      label: 'Edit',
      to: {
        pathname: `/eholdings/titles/${model.id}/edit`,
        search: router.route.location.search,
        state: { eholdings: true }
      }
    });
  }

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

  let lastMenu;
  if (model.isTitleCustom) {
    lastMenu = (
      <PaneMenu>
        <IconButton
          data-test-eholdings-title-edit-link
          icon="edit"
          ariaLabel={`Edit ${model.name}`}
          to={{
            pathname: `/eholdings/titles/${model.id}/edit`,
            search: router.route.location.search,
            state: { eholdings: true }
          }}
        />
      </PaneMenu>
    );
  }

  let toasts = processErrors(model);

  // if coming from saving edits to the package, show a success toast
  if (router.history.action === 'PUSH' &&
      router.history.location.state &&
      router.history.location.state.isFreshlySaved) {
    toasts.push({
      id: `success-title-saved-${model.id}`,
      message: 'Title saved.',
      type: 'success'
    });
  }

  return (
    <div>
      <Toaster toasts={toasts} position="bottom" />

      <DetailsView
        type="title"
        model={model}
        paneTitle={model.name}
        actionMenuItems={actionMenuItems}
        lastMenu={lastMenu}
        bodyContent={(
          <DetailsViewSection label="Title information">
            <ContributorsList data={model.contributors} />

            {model.edition && (
              <KeyValue label="Edition">
                <div data-test-eholdings-title-show-edition>
                  {model.edition}
                </div>
              </KeyValue>
            )}

            {model.publisherName && (
              <KeyValue label="Publisher">
                <div data-test-eholdings-title-show-publisher-name>
                  {model.publisherName}
                </div>
              </KeyValue>
            )}

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

            <KeyValue label="Peer reviewed">
              <div data-test-eholdings-peer-reviewed-field>
                {model.isPeerReviewed ? 'Yes' : 'No'}
              </div>
            </KeyValue>

            <KeyValue label="Title type">
              <div data-test-eholdings-title-details-type>
                {model.isTitleCustom ? 'Custom' : 'Managed'}
              </div>
            </KeyValue>

            {model.description && (
              <KeyValue label="Description">
                <div data-test-eholdings-description-field>
                  {model.description}
                </div>
              </KeyValue>
            )}
          </DetailsViewSection>
        )}
        listType="packages"
        renderList={scrollable => (
          <ScrollView
            itemHeight={70}
            items={model.resources}
            scrollable={scrollable}
            data-test-query-list="title-packages"
          >
            {item => (
              <PackageListItem
                link={`/eholdings/resources/${item.id}`}
                packageName={item.packageName}
                item={item}
                headingLevel='h4'
              />
            )}
          </ScrollView>
        )}
      />
    </div>
  );
}

TitleShow.propTypes = {
  model: PropTypes.object.isRequired
};

TitleShow.contextTypes = {
  router: PropTypes.object,
  queryParams: PropTypes.object
};
