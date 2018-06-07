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
import ToggleSwitch from '../../toggle-switch';
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

  componentWillReceiveProps({ model }) {
    if (!model.isSaving) {
      this.setState({
        packageSelected: model.isSelected,
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
    let { model, fetchPackageTitles } = this.props;
    let { router, queryParams } = this.context;
    let {
      showSelectionModal,
      packageSelected,
      packageAllowedToAddTitles,
      isCoverageEditable
    } = this.state;

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
              <DetailsViewSection label="Package settings">
                {packageSelected ? (
                  <div>
                    <KeyValue label="Visible to patrons">
                      <div data-test-eholdings-package-details-visibility-status>
                        {!model.visibilityData.isHidden ? 'Yes' : 'No'}
                      </div>

                      {model.visibilityData.isHidden && (
                        <div data-test-eholdings-package-details-is-hidden>
                          {model.visibilityData.reason}
                        </div>
                      )}
                    </KeyValue>
                    {!model.isCustom && (
                      <KeyValue label="Allow knowledge base to automatically select new titles">
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
