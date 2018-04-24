import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
  IconButton,
  KeyValue,
  PaneMenu
} from '@folio/stripes-components';
import { processErrors } from '../../utilities';

import DetailsView from '../../details-view';
import QueryList from '../../query-list';
import Link from '../../link';
import TitleListItem from '../../title-list-item';
import ToggleSwitch from '../../toggle-switch';
import Modal from '../../modal';
import CustomCoverage from '../_forms/custom-coverage';
import NavigationModal from '../../navigation-modal';
import DetailsViewSection from '../../details-view-section';
import Toaster from '../../toaster';

import styles from './package-show.css';

export default class PackageShow extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    fetchPackageTitles: PropTypes.func.isRequired,
    toggleSelected: PropTypes.func.isRequired,
    toggleHidden: PropTypes.func.isRequired,
    customCoverageSubmitted: PropTypes.func.isRequired,
    toggleAllowKbToAddTitles: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: PropTypes.object,
    router: PropTypes.object,
    queryParams: PropTypes.object
  };

  state = {
    showSelectionModal: false,
    packageSelected: this.props.model.isSelected,
    packageHidden: this.props.model.visibilityData.isHidden,
    packageAllowedToAddTitles: this.props.model.allowKbToAddTitles,
    isCoverageEditable: false
  };

  componentWillReceiveProps({ model }) {
    if (!model.isSaving) {
      this.setState({
        packageSelected: model.isSelected,
        packageHidden: model.visibilityData.isHidden,
        packageAllowedToAddTitles: model.allowKbToAddTitles
      });
    }
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
    let { model, fetchPackageTitles, customCoverageSubmitted } = this.props;
    let { intl, router, queryParams } = this.context;
    let {
      showSelectionModal,
      packageSelected,
      packageHidden,
      packageAllowedToAddTitles,
      isCoverageEditable
    } = this.state;

    let customCoverages = [{
      beginCoverage: model.customCoverage.beginCoverage,
      endCoverage: model.customCoverage.endCoverage
    }];

    let actionMenuItems = [
      {
        label: 'Edit',
        to: {
          pathname: `/eholdings/packages/${model.id}/edit`,
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

    let toasts = processErrors(model);

    // if coming from creating a new custom package, show a success toast
    if (router.history.action === 'REPLACE' &&
        router.history.location.state.isNewRecord) {
      toasts.push({
        id: `success-package-${model.id}`,
        message: 'Successfully created custom package',
        type: 'success'
      });
    }

    return (
      <div>
        <Toaster toasts={toasts} position="bottom" />
        <DetailsView
          type="package"
          model={model}
          paneTitle={model.name}
          actionMenuItems={actionMenuItems}
          lastMenu={(
            <PaneMenu>
              <IconButton
                icon="edit"
                ariaLabel={`Edit ${model.name}`}
                href={`/eholdings/packages/${model.id}/edit${router.route.location.search}`}
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
                    {intl.formatNumber(model.selectedCount)}
                  </div>
                </KeyValue>

                <KeyValue label="Total titles">
                  <div data-test-eholdings-package-details-titles-total>
                    {intl.formatNumber(model.titleCount)}
                  </div>
                </KeyValue>
              </DetailsViewSection>
              <DetailsViewSection label="Holding status">
                <label
                  data-test-eholdings-package-details-selected
                  htmlFor="package-details-toggle-switch"
                >
                  <h4>{packageSelected ? 'Selected' : 'Not selected'}</h4>
                  <br />
                  <ToggleSwitch
                    onChange={this.handleSelectionToggle}
                    // if destroying selection status is always false
                    checked={model.destroy.isPending ? false : packageSelected}
                    isPending={model.destroy.isPending ||
                      (model.update.isPending && 'isSelected' in model.update.changedAttributes)}
                    id="package-details-toggle-switch"
                  />
                </label>
              </DetailsViewSection>
              <DetailsViewSection label="Visibility">
                {packageSelected ? (
                  <div>
                    <label
                      data-test-eholdings-package-details-hidden
                      htmlFor="package-details-toggle-hidden-switch"
                    >
                      <h4>
                        {model.visibilityData.isHidden
                          ? 'Hidden from patrons'
                          : 'Visible to patrons'}
                      </h4>
                      <br />
                      <ToggleSwitch
                        onChange={this.props.toggleHidden}
                        checked={!packageHidden}
                        isPending={model.update.isPending &&
                          ('visibilityData' in model.update.changedAttributes)}
                        id="package-details-toggle-hidden-switch"
                      />
                    </label>

                    {model.visibilityData.isHidden && (
                      <div data-test-eholdings-package-details-is-hidden>
                        {model.visibilityData.reason}
                      </div>
                    )}
                  </div>
                ) : (
                  <p>Not shown to patrons.</p>
                )}
              </DetailsViewSection>

              {!model.isCustom && (
                <DetailsViewSection label="Title management">
                  {packageSelected ? (
                    <div>
                      {packageAllowedToAddTitles != null ? (
                        <div>
                          <label
                            data-test-eholdings-package-details-allow-add-new-titles
                            htmlFor="package-details-toggle-allow-add-new-titles-switch"
                          >
                            <h4>
                              {packageAllowedToAddTitles
                              ? 'Automatically select new titles'
                              : 'Do not automatically select new titles'}
                            </h4>
                            <br />
                            <ToggleSwitch
                              onChange={this.props.toggleAllowKbToAddTitles}
                              checked={packageAllowedToAddTitles}
                              isPending={model.update.isPending && 'allowKbToAddTitles' in model.update.changedAttributes}
                              id="package-details-toggle-allow-add-new-titles-switch"
                            />
                          </label>
                        </div>
                        ) : (
                          <label
                            data-test-eholdings-package-details-allow-add-new-titles
                            htmlFor="package-details-toggle-allow-add-new-titles-switch"
                          >
                            <Icon icon="spinner-ellipsis" />
                          </label>
                        )}
                    </div>
                  ) : (
                    <p>Knowledge base does not automatically select titles.</p>
                  )}
                </DetailsViewSection>
              )}

              <DetailsViewSection
                label="Coverage dates"
                closedByDefault={!packageSelected}
              >
                {packageSelected ? (
                  <div data-test-eholdings-package-details-custom-coverage>
                    <CustomCoverage
                      initialValues={{ customCoverages }}
                      onSubmit={customCoverageSubmitted}
                      isPending={model.update.isPending && 'customCoverage' in model.update.changedAttributes}
                      onEdit={this.handleCoverageEdit}
                      isEditable={isCoverageEditable}
                    />
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
          label="Remove package from holdings?"
          scope="root"
          id="eholdings-package-confirmation-modal"
          footer={(
            <div>
              <Button
                buttonStyle="primary"
                onClick={this.commitSelectionToggle}
                data-test-eholdings-package-deselection-confirmation-modal-yes
              >
                Yes, remove
              </Button>
              <Button
                onClick={this.cancelSelectionToggle}
                data-test-eholdings-package-deselection-confirmation-modal-no
              >
                No, do not remove
              </Button>
            </div>
          )}
        >
           Are you sure you want to remove this package and all its titles from your holdings? All customizations will be lost.
        </Modal>

        <NavigationModal when={isCoverageEditable} />
      </div>
    );
  }
}
