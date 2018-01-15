import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from '@folio/stripes-components/lib/Icon';
import IconButton from '@folio/stripes-components/lib/IconButton';
import PaneHeader from '@folio/stripes-components/lib/PaneHeader';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Button from '@folio/stripes-components/lib/Button';

import Link from '../link';
import KeyValueLabel from '../key-value-label';
import List from '../list';
import TitleListItem from '../title-list-item';
import ToggleSwitch from '../toggle-switch';
import Modal from '../modal';
import { formatISODateWithoutTime } from '../utilities';
import styles from './package-show.css';

export default class PackageShow extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    toggleSelected: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object,
    router: PropTypes.object,
    queryParams: PropTypes.object
  };

  state = {
    showSelectionModal: false,
    packageSelected: this.props.model.isSelected
  };

  componentWillReceiveProps({ model }) {
    if (!model.isSaving) {
      this.setState({ packageSelected: model.isSelected });
    }
  }

  handleSelectionToggle = () => {
    this.setState({ packageSelected: !this.props.model.isSelected });
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
      packageSelected: this.props.model.isSelected
    });
  };

  render() {
    let { model } = this.props;
    let { intl, router, queryParams } = this.context;
    let { showSelectionModal, packageSelected } = this.state;
    let historyState = router.history.location.state;

    return (
      <div>
        {!queryParams.searchType && (
          <PaneHeader
            firstMenu={historyState && historyState.eholdings && (
              <PaneMenu>
                <div data-test-eholdings-package-details-back-button>
                  <IconButton icon="left-arrow" onClick={() => router.history.goBack()} />
                </div>
              </PaneMenu>
            )}
          />
        )}
        <div className={styles['detail-container']} data-test-eholdings-package-details>
          {model.isLoaded ? (
            <div>
              <div className={styles['detail-container-header']}>
                <KeyValueLabel label="Package">
                  <h1 data-test-eholdings-package-details-name>
                    {model.name}
                  </h1>
                </KeyValueLabel>
              </div>

              <KeyValueLabel label="Vendor">
                <div data-test-eholdings-package-details-vendor>
                  <Link to={`/eholdings/vendors/${model.vendorId}`}>{model.vendorName}</Link>
                </div>
              </KeyValueLabel>

              {model.contentType && (
                <KeyValueLabel label="Content Type">
                  <div data-test-eholdings-package-details-content-type>
                    {model.contentType}
                  </div>
                </KeyValueLabel>
              ) }

              <KeyValueLabel label="Titles Selected">
                <div data-test-eholdings-package-details-titles-selected>
                  {intl.formatNumber(model.selectedCount)}
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Total Titles">
                <div data-test-eholdings-package-details-titles-total>
                  {intl.formatNumber(model.titleCount)}
                </div>
              </KeyValueLabel>

              {(model.customCoverage.beginCoverage || model.customCoverage.endCoverage) && (
                <KeyValueLabel label="Custom Coverage">
                  <div data-test-eholdings-package-details-custom-coverage>
                    {formatISODateWithoutTime(model.customCoverage.beginCoverage, intl)} - {formatISODateWithoutTime(model.customCoverage.endCoverage, intl)}
                  </div>
                </KeyValueLabel>
              )}

              <hr />

              <label
                data-test-eholdings-package-details-selected
                htmlFor="package-details-toggle-switch"
              >
                <h4>{model.isSelected ? 'Selected' : 'Not Selected'}</h4>
                <ToggleSwitch
                  onChange={this.handleSelectionToggle}
                  checked={packageSelected}
                  isPending={model.update.isPending && 'isSelected' in model.update.changedAttributes}
                  id="package-details-toggle-switch"
                />
              </label>

              {model.visibilityData.isHidden && (
                <div data-test-eholdings-package-details-is-hidden>
                  <p><strong>This package is hidden.</strong></p>
                  <p><em>{model.visibilityData.reason}</em></p>
                  <hr />
                </div>
              )}

              <h3>Titles</h3>
              <List data-test-eholdings-package-details-title-list>
                {model.customerResources.isLoading ? (
                  <Icon icon="spinner-ellipsis" />
                ) : (
                  model.customerResources.map(item => (
                    <li key={item.id} data-test-eholdings-title-list-item>
                      <TitleListItem
                        item={item}
                        link={`/eholdings/customer-resources/${item.id}`}
                        showSelected
                      />
                    </li>
                  ))
                )}
              </List>
            </div>
          ) : model.request.isRejected ? (
            <p data-test-eholdings-package-details-error>
              {model.request.errors[0].title}
            </p>
          ) : model.isLoading ? (
            <Icon icon="spinner-ellipsis" />
          ) : null}
        </div>
        <Modal
          open={showSelectionModal}
          size="small"
          label="Remove package from holdings?"
          scope="root"
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
                hollow
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
      </div>
    );
  }
}
