import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
  IconButton,
  KeyValue,
  PaneMenu
} from '@folio/stripes-components';
import { FormattedDate, FormattedNumber } from 'react-intl';
import { processErrors } from '../../utilities';

import DetailsView from '../../details-view';
import QueryList from '../../query-list';
import Link from '../../link';
import TitleListItem from '../../title-list-item';
import Modal from '../../modal';
import NavigationModal from '../../navigation-modal';
import DetailsViewSection from '../../details-view-section';
import Toaster from '../../toaster';

import styles from './package-show.css';

export default class PackageShow extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    fetchPackageTitles: PropTypes.func.isRequired,
    toggleSelected: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object,
    queryParams: PropTypes.object
  };

  state = {
    showSelectionModal: false,
    packageSelected: this.props.model.isSelected,
    packageAllowedToAddTitles: this.props.model.allowKbToAddTitles,
    isCoverageEditable: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { model: { allowKbToAddTitles, isSaving, isSelected } } = nextProps;
    if (!isSaving) {
      return {
        ...prevState,
        packageSelected: isSelected,
        packageAllowedToAddTitles: allowKbToAddTitles
      };
    }
    return prevState;
  }

  handleSelectionToggle = () => {
    this.setState({ packageSelected: !this.props.model.isSelected });
    if (this.props.model.isSelected) {
      this.setState({ showSelectionModal: true });
    } else {
      this.setState({ packageAllowedToAddTitles: true });
      this.props.toggleSelected();
    }
  };

  commitSelectionToggle = () => {
    this.setState({ showSelectionModal: false });
    this.props.toggleSelected();
  };

  cancelSelectionToggle = () => {
    this.setState({
      showSelectionModal: false,
      packageSelected: this.props.model.isSelected
    });
  };

  handleCoverageEdit = (isCoverageEditable) => {
    this.setState({ isCoverageEditable });
  };

  render() {
    let { model, fetchPackageTitles } = this.props;
    let { router, queryParams } = this.context;
    let {
      showSelectionModal,
      packageSelected,
      packageAllowedToAddTitles,
      isCoverageEditable
    } = this.state;

    let visibilityMessage = model.visibilityData.reason && `(${model.visibilityData.reason})`;
    let packageSelectionPending = model.destroy.isPending ||
        (model.update.isPending && 'isSelected' in model.update.changedAttributes);

    let modalMessage = model.isCustom ?
      {
        header: 'Delete custom package',
        body: `Are you sure you want to delete this package?
          By deleting this package it will no longer be available for selection and all customization will be lost.
          If a title only appears in this package it will no longer be available for selection.`,
        buttonConfirm: 'Yes, delete',
        buttonCancel: 'No, do not delete'
      } :
      {
        header: 'Remove package from holdings?',
        body: 'Are you sure you want to remove this package and all its titles from your holdings? All customizations will be lost.',
        buttonConfirm: 'Yes, remove',
        buttonCancel: 'No, do not remove'
      };

    let actionMenuItems = [
      {
        label: 'Edit',
        to: {
          pathname: `/eholdings/packages/${model.id}/edit`,
          search: router.route.location.search,
          state: { eholdings: true }
        }
      }
    ];

    if (queryParams.searchType) {
      actionMenuItems.push({
        label: 'Full view',
        to: {
          pathname: `/eholdings/packages/${model.id}`,
          state: { eholdings: true }
        },
        className: styles['full-view-link']
      });
    }

    if (packageSelected) {
      actionMenuItems.push({
        'label': 'Remove from holdings',
        'state': { eholdings: true },
        'data-test-eholdings-package-remove-from-holdings-action': true,
        'onClick': this.handleSelectionToggle
      });
    } else {
      actionMenuItems.push({
        'label': 'Add to holdings',
        'state': { eholdings: true },
        'data-test-eholdings-package-add-to-holdings-action': true,
        'onClick': this.handleSelectionToggle
      });
    }

    let toasts = processErrors(model);

    // if coming from creating a new custom package, show a success toast
    if (router.history.action === 'REPLACE' &&
        router.history.location.state &&
        router.history.location.state.isNewRecord) {
      toasts.push({
        id: `success-package-creation-${model.id}`,
        message: 'Custom package created.',
        type: 'success'
      });
    }

    // if coming from destroying a custom or managed title
    // from within custom-package, show a success toast
    if (router.history.action === 'REPLACE' &&
        router.history.location.state &&
        router.history.location.state.isDestroyed) {
      toasts.push({
        id: `success-resource-destruction-${model.id}`,
        message: 'Title removed from package',
        type: 'success'
      });
    }

    // if coming from saving edits to the package, show a success toast
    if (router.history.action === 'PUSH' &&
        router.history.location.state &&
        router.history.location.state.isFreshlySaved) {
      toasts.push({
        id: `success-package-saved-${model.id}`,
        message: 'Package saved.',
        type: 'success'
      });
    }

    return (
      <div>
        <Toaster toasts={toasts} position="bottom" />
        <DetailsView
          type="package"
          model={model}
          key={model.id}
          paneTitle={model.name}
          actionMenuItems={actionMenuItems}
          lastMenu={(
            <PaneMenu>
              <IconButton
                data-test-eholdings-package-edit-link
                icon="edit"
                ariaLabel={`Edit ${model.name}`}
                to={{
                  pathname: `/eholdings/packages/${model.id}/edit`,
                  search: router.route.location.search,
                  state: { eholdings: true }
                }}
              />
            </PaneMenu>
          )}
          bodyContent={(
            <div>
              <DetailsViewSection label='Package information'>
                <KeyValue label="Provider">
                  <div data-test-eholdings-package-details-provider>
                    <Link to={`/eholdings/providers/${model.providerId}`}>{model.providerName}</Link>
                  </div>
                </KeyValue>

                {model.contentType && (
                  <KeyValue label="Content type">
                    <div data-test-eholdings-package-details-content-type>
                      {model.contentType}
                    </div>
                  </KeyValue>
                )}

                {model.packageType && (
                  <KeyValue label="Package type">
                    <div data-test-eholdings-package-details-type>
                      {model.packageType}
                    </div>
                  </KeyValue>
                )}

                <KeyValue label="Titles selected">
                  <div data-test-eholdings-package-details-titles-selected>
                    <FormattedNumber value={model.selectedCount} />
                  </div>
                </KeyValue>

                <KeyValue label="Total titles">
                  <div data-test-eholdings-package-details-titles-total>
                    <FormattedNumber value={model.titleCount} />
                  </div>
                </KeyValue>
              </DetailsViewSection>
              <DetailsViewSection label="Holding status">
                <label
                  data-test-eholdings-package-details-selected
                  htmlFor="package-details-toggle-switch"
                >
                  { packageSelectionPending ? (
                    <Icon icon="spinner-ellipsis" />
                  ) : (
                    <h4>{packageSelected ? 'Selected' : 'Not selected'}</h4>
                  ) }
                  <br />
                  {(
                    (!packageSelected && !packageSelectionPending) ||
                    (!this.props.model.isSelected && packageSelectionPending)) &&
                    <Button
                      type="button"
                      buttonStyle="primary"
                      disabled={packageSelectionPending}
                      onClick={this.handleSelectionToggle}
                      data-test-eholdings-package-add-to-holdings-button
                    >
                    Add to holdings
                    </Button>
                  }
                </label>
              </DetailsViewSection>
              <DetailsViewSection label="Package settings">
                {packageSelected ? (
                  <div>
                    <KeyValue label="Show titles in package to patrons">
                      <div data-test-eholdings-package-details-visibility-status>
                        {!model.visibilityData.isHidden ? 'Yes' : `No ${visibilityMessage}`}
                      </div>

                      {model.visibilityData.isHidden && (
                        <div data-test-eholdings-package-details-is-hidden>
                          {model.visibilityData.reason}
                        </div>
                      )}
                    </KeyValue>
                    {!model.isCustom && (
                      <KeyValue label="Automatically select new titles">
                        <div>
                          {packageAllowedToAddTitles != null ? (
                            <div data-test-eholdings-package-details-allow-add-new-titles>
                              {packageAllowedToAddTitles ? 'Yes' : 'No'}
                            </div>
                            ) : (
                              <div>
                                <Icon icon="spinner-ellipsis" />
                              </div>
                            )}
                        </div>
                      </KeyValue>
                    )}
                  </div>
                ) : (
                  <p>Add the package to holdings to customize package settings.</p>
                )}
              </DetailsViewSection>
              <DetailsViewSection
                label="Coverage dates"
                closedByDefault={!packageSelected}
              >
                {packageSelected ? (
                  <div>
                    {model.customCoverage.beginCoverage ? (
                      <div>
                        <KeyValue label="Custom coverage dates">
                          <div data-test-eholdings-package-details-custom-coverage-display>
                            <FormattedDate
                              value={model.customCoverage.beginCoverage}
                              timeZone="UTC"
                              year="numeric"
                              month="numeric"
                              day="numeric"
                            />&nbsp;-&nbsp;
                            {(model.customCoverage.endCoverage) ? (
                              <FormattedDate
                                value={model.customCoverage.endCoverage}
                                timeZone="UTC"
                                year="numeric"
                                month="numeric"
                                day="numeric"
                              />
                            ) : 'Present'}
                          </div>
                        </KeyValue>
                      </div>
                    ) : (
                      <p>No custom coverage dates set.</p>
                    )}
                  </div>
                ) : (
                  <p>Add the package to holdings to set custom coverage dates.</p>
                )}
              </DetailsViewSection>
            </div>
          )}
          listType="titles"
          renderList={scrollable => (
            <QueryList
              type="package-titles"
              fetch={fetchPackageTitles}
              collection={model.resources}
              length={model.titleCount}
              scrollable={scrollable}
              itemHeight={70}
              renderItem={item => (
                <TitleListItem
                  item={item.content}
                  link={item.content && `/eholdings/resources/${item.content.id}`}
                  showSelected
                  headingLevel='h4'
                />
              )}
            />
          )}
        />

        <Modal
          open={showSelectionModal}
          size="small"
          label={modalMessage.header}
          scope="root"
          id="eholdings-package-confirmation-modal"
          footer={(
            <div>
              <Button
                buttonStyle="primary"
                onClick={this.commitSelectionToggle}
                data-test-eholdings-package-deselection-confirmation-modal-yes
              >
                {modalMessage.buttonConfirm}
              </Button>
              <Button
                onClick={this.cancelSelectionToggle}
                data-test-eholdings-package-deselection-confirmation-modal-no
              >
                {modalMessage.buttonCancel}
              </Button>
            </div>
          )}
        >
          {modalMessage.body}
        </Modal>

        <NavigationModal when={isCoverageEditable} />
      </div>
    );
  }
}
