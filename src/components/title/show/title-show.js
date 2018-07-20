import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Accordion,
  Button,
  IconButton,
  KeyValue,
  Modal,
  ModalFooter,
  PaneMenu,
} from '@folio/stripes-components';

import { processErrors } from '../../utilities';
import DetailsView from '../../details-view';
import ScrollView from '../../scroll-view';
import PackageListItem from '../../package-list-item';
import IdentifiersList from '../../identifiers-list';
import ContributorsList from '../../contributors-list';
import AddToPackageForm from '../_forms/add-to-package';
import Toaster from '../../toaster';
import styles from './title-show.css';

export default class TitleShow extends Component {
  static propTypes = {
    request: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    customPackages: PropTypes.object.isRequired,
    addCustomPackage: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object,
    queryParams: PropTypes.object
  };

  state = {
    showCustomPackageModal: false
  };

  get actionMenuItems() {
    let { model } = this.props;
    let { queryParams, router } = this.context;
    let items = [];

    if (model.isTitleCustom) {
      items.push({
        label: 'Edit',
        to: {
          pathname: `/eholdings/titles/${model.id}/edit`,
          search: router.route.location.search,
          state: { eholdings: true }
        }
      });
    }

    if (queryParams.searchType) {
      items.push({
        label: 'Full view',
        to: {
          pathname: `/eholdings/titles/${model.id}`,
          state: { eholdings: true }
        },
        className: styles['full-view-link']
      });
    }

    return items;
  }

  get lastMenu() {
    let { model } = this.props;
    let { router } = this.context;

    if (model.isTitleCustom) {
      return (
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
    } else {
      return null;
    }
  }

  get toasts() {
    let { model } = this.props;
    let { router } = this.context;
    let toasts = processErrors(model);

    // if coming from creating a new custom package, show a success toast
    if (router.history.action === 'REPLACE' &&
        router.history.location.state &&
        router.history.location.state.isNewRecord) {
      toasts.push({
        id: `success-title-${model.id}`,
        message: 'Custom title created.',
        type: 'success'
      });
    }

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

    return toasts;
  }

  get customPackageOptions() {
    let titlePackageIds = this.props.model.resources.map(({ id }) => id);

    return this.props.customPackages.map(pkg => ({
      disabled: titlePackageIds.includes(pkg.id),
      label: pkg.name,
      value: pkg.id
    }));
  }

  toggleCustomPackageModal = () => {
    this.setState(({ showCustomPackageModal }) => ({
      showCustomPackageModal: !showCustomPackageModal
    }));
  }

  render() {
    let { model, addCustomPackage, request } = this.props;
    let { showCustomPackageModal } = this.state;

    // this will become a ref that will allow us to submit the form
    // from our modal footer buttons
    let addToPackageForm;

    return (
      <div>
        <Toaster toasts={this.toasts} position="bottom" />

        <DetailsView
          type="title"
          model={model}
          key={model.id}
          paneTitle={model.name}
          actionMenuItems={this.actionMenuItems}
          lastMenu={this.lastMenu}
          bodyContent={(
            <Accordion label="Title information">
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

              <div className={styles['add-to-custom-package-button']}>
                <Button
                  data-test-eholdings-add-to-custom-package-button
                  onClick={this.toggleCustomPackageModal}
                >
                  Add to custom package
                </Button>
              </div>
            </Accordion>
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

        <Modal
          open={showCustomPackageModal}
          size="small"
          label="Add title to custom package"
          id="eholdings-custom-package-modal"
          footer={(
            <ModalFooter
              primaryButton={{
                'label': request.isPending ? 'Saving' : 'Submit',
                'onClick': () => addToPackageForm.submit(),
                'disabled': request.isPending,
                'data-test-eholdings-custom-package-modal-submit': true
              }}
              secondaryButton={{
                'label': 'Cancel',
                'onClick': this.toggleCustomPackageModal,
                'disabled': request.isPending,
                'data-test-eholdings-custom-package-modal-cancel': true
              }}
            />
          )}
        >
          <AddToPackageForm
            ref={(form) => { addToPackageForm = form; }}
            packageOptions={this.customPackageOptions}
            onSubmit={addCustomPackage}
          />
        </Modal>
      </div>
    );
  }
}
