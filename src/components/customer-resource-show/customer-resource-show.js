import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@folio/stripes-components/lib/Icon';
import PaneHeader from '@folio/stripes-components/lib/PaneHeader';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';

import Link from '../link';
import KeyValueLabel from '../key-value-label';
import IdentifiersList from '../identifiers-list';
import ContributorsList from '../contributors-list';
import ToggleSwitch from '../toggle-switch';
import CoverageDates from '../coverage-dates';
import { isBookPublicationType, isValidCoverageList } from '../utilities';
import styles from './customer-resource-show.css';

export default function CustomerResourceShow({ model, toggleSelected }, { router, queryParams }) {
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
              <button data-test-eholdings-customer-resource-show-back-button onClick={() => router.history.goBack()}><Icon icon="left-arrow" /></button>
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
                onChange={toggleSelected}
                checked={model.isSelected}
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
    </div>
  );
}

CustomerResourceShow.propTypes = {
  model: PropTypes.object.isRequired,
  toggleSelected: PropTypes.func.isRequired
};

CustomerResourceShow.contextTypes = {
  router: PropTypes.object,
  queryParams: PropTypes.object
};
