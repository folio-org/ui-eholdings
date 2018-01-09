import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '@folio/stripes-components/lib/Icon';
import IconButton from '@folio/stripes-components/lib/IconButton';
import PaneHeader from '@folio/stripes-components/lib/PaneHeader';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Button from '@folio/stripes-components/lib/Button';

import Link from '../link';
import KeyValueLabel from '../key-value-label';
import IdentifiersList from '../identifiers-list';
import ContributorsList from '../contributors-list';
import ToggleSwitch from '../toggle-switch';
import CoverageDates from '../coverage-dates';
import { isBookPublicationType, isValidCoverageList } from '../utilities';
import Modal from '../modal';
import styles from './customer-resource-show.css';

export default class CustomerResourceShow extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    toggleSelected: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object,
    queryParams: PropTypes.object
  };

  state = {
    showSelectionModal: false,
    resourceSelected: this.props.model.isSelected
  };

  componentWillReceiveProps({ model }) {
    if (!model.isSaving) {
      this.setState({ resourceSelected: model.isSelected });
    }
  }

  handleSelectionToggle = () => {
    this.setState({ resourceSelected: !this.props.model.isSelected });
    if (this.props.model.isSelected) {
      this.setState({ showSelectionModal: true });
    } else {
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
      resourceSelected: this.props.model.isSelected
    });
  };

  render() {
    let { model } = this.props;
    let { router, queryParams } = this.context;
    let { showSelectionModal, resourceSelected } = this.state;

    let historyState = router.history.location.state;
    let hasManagedCoverages = model.managedCoverages.length > 0 &&
      isValidCoverageList(model.managedCoverages);
    let hasManagedEmbargoPeriod = model.managedEmbargoPeriod &&
      model.managedEmbargoPeriod.embargoUnit &&
      model.managedEmbargoPeriod.embargoValue;
    let hasCustomEmbargoPeriod = model.customEmbargoPeriod &&
      model.customEmbargoPeriod.embargoUnit &&
      model.customEmbargoPeriod.embargoValue;

    return (
      <div>
        {!queryParams.searchType && (
          <PaneHeader
            firstMenu={historyState && historyState.eholdings && (
              <PaneMenu>
                <div data-test-eholdings-customer-resource-show-back-button>
                  <IconButton icon="left-arrow" onClick={() => router.history.goBack()} />
                </div>
              </PaneMenu>
            )}
          />
        )}
        <div className={styles['detail-container']} data-test-eholdings-customer-resource-show>
          {model.isLoaded ? (
            <div>
              <div className={styles['detail-container-header']}>
                <KeyValueLabel label="Resource">
                  <h1 data-test-eholdings-customer-resource-show-title-name>
                    {model.name}
                  </h1>
                </KeyValueLabel>
              </div>

              <ContributorsList data={model.contributors} />

              <KeyValueLabel label="Publisher">
                <div data-test-eholdings-customer-resource-show-publisher-name>
                  {model.publisherName}
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Publication Type">
                <div data-test-eholdings-customer-resource-show-publication-type>
                  {model.publicationType}
                </div>
              </KeyValueLabel>

              <IdentifiersList data={model.identifiers} />

              {model.subjects.length > 0 && (
                <KeyValueLabel label="Subjects">
                  <div data-test-eholdings-customer-resource-show-subjects-list>
                    {model.subjects.map(subjectObj => subjectObj.subject).join('; ')}
                  </div>
                </KeyValueLabel>
              ) }

              <KeyValueLabel label="Package">
                <div data-test-eholdings-customer-resource-show-package-name>
                  <Link to={`/eholdings/packages/${model.packageId}`}>{model.packageName}</Link>
                </div>
              </KeyValueLabel>

              {model.contentType && (
                <KeyValueLabel label="Content Type">
                  <div data-test-eholdings-customer-resource-show-content-type>
                    {model.contentType}
                  </div>
                </KeyValueLabel>
              ) }

              <KeyValueLabel label="Vendor">
                <div data-test-eholdings-customer-resource-show-vendor-name>
                  <Link to={`/eholdings/vendors/${model.vendorId}`}>{model.vendorName}</Link>
                </div>
              </KeyValueLabel>

              {model.url && (
                <KeyValueLabel label="Managed URL">
                  <div data-test-eholdings-customer-resource-show-managed-url>
                    <a href={model.url}>{model.url}</a>
                  </div>
                </KeyValueLabel>
              ) }

              {hasManagedCoverages && (
                <KeyValueLabel label="Managed Coverage Dates">
                  <CoverageDates
                    coverageArray={model.managedCoverages}
                    id="customer-resource-show-managed-coverage-list"
                    isYearOnly={isBookPublicationType(model.publicationType)}
                  />
                </KeyValueLabel>
              )}

              {hasManagedEmbargoPeriod && (
                <KeyValueLabel label="Managed Embargo Period">
                  <div data-test-eholdings-customer-resource-show-managed-embargo-period>
                    {model.managedEmbargoPeriod.embargoValue} {model.managedEmbargoPeriod.embargoUnit}
                  </div>
                </KeyValueLabel>
              )}

              {hasCustomEmbargoPeriod && (
                <KeyValueLabel label="Custom Embargo Period">
                  <div data-test-eholdings-customer-resource-show-custom-embargo-period>
                    {model.customEmbargoPeriod.embargoValue} {model.customEmbargoPeriod.embargoUnit}
                  </div>
                </KeyValueLabel>
              )}

              <hr />

              <label
                data-test-eholdings-customer-resource-show-selected
                htmlFor="customer-resource-show-toggle-switch"
              >
                <h4>{model.isSelected ? 'Selected' : 'Not Selected'}</h4>
                <ToggleSwitch
                  onChange={this.handleSelectionToggle}
                  checked={resourceSelected}
                  isPending={model.update.isPending}
                  id="customer-resource-show-toggle-switch"
                />
              </label>

              <hr />

              {model.visibilityData.isHidden && (
                <div data-test-eholdings-customer-resource-show-is-hidden>
                  <p><strong>This resource is hidden.</strong></p>
                  <p data-test-eholdings-customer-resource-show-hidden-reason>
                    <em>{model.visibilityData.reason}</em>
                  </p>
                  <hr />
                </div>
              )}

              <div>
                <Link to={`/eholdings/titles/${model.titleId}`}>
                  View all packages that include this title
                </Link>
              </div>
            </div>
          ) : model.request.isRejected ? (
            <p data-test-eholdings-customer-resource-show-error>
              {model.request.errors[0].title}
            </p>
          ) : model.isLoading ? (
            <Icon icon="spinner-ellipsis" />
          ) : null}
        </div>
        <Modal
          open={showSelectionModal}
          size="small"
          label="Remove resource from holdings?"
          scope="root"
          footer={(
            <div>
              <Button
                buttonStyle="primary"
                onClick={this.commitSelectionToggle}
                data-test-eholdings-customer-resource-deselection-confirmation-modal-yes
              >
                Yes, remove
              </Button>
              <Button
                hollow
                onClick={this.cancelSelectionToggle}
                data-test-eholdings-customer-resource-deselection-confirmation-modal-no
              >
                No, do not remove
              </Button>
            </div>
          )}
        >
          Are you sure you want to remove this title from your holdings? All customizations will be lost.
        </Modal>
      </div>
    );
  }
}
