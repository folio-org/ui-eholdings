import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon from '@folio/stripes-components/lib/Icon';
import KeyValueLabel from '../key-value-label';
import IdentifiersList from '../identifiers-list';
import ContributorsList from '../contributors-list';
import ToggleSwitch from '../toggle-switch';
import CoverageDates from '../coverage-dates';
import { isBookPublicationType, formatPublicationType, isValidCoverageList, mapMessageReason } from '../utilities';
import styles from './customer-resource-show.css';

export default function CustomerResourceShow({ customerResource, toggleRequest, toggleSelected }) {
  const record = customerResource.content;

  return (
    <div className={styles['detail-container']} data-test-eholdings-customer-resource-show>
      {customerResource.isResolved ? (
        <div>
          <div className={styles['detail-container-header']}>
            <KeyValueLabel label="Resource">
              <h1 data-test-eholdings-customer-resource-show-title-name>
                {record.titleName}
              </h1>
            </KeyValueLabel>
          </div>

          <ContributorsList data={record.contributorsList} />

          <KeyValueLabel label="Publisher">
            <div data-test-eholdings-customer-resource-show-publisher-name>
              {record.publisherName}
            </div>
          </KeyValueLabel>

          <KeyValueLabel label="Publication Type">
            <div data-test-eholdings-customer-resource-show-publication-type>
              {formatPublicationType(record.pubType)}
            </div>
          </KeyValueLabel>

          <IdentifiersList data={record.identifiersList} />

          {record.subjectsList && record.subjectsList.length > 0 && (
            <KeyValueLabel label="Subjects">
              <div data-test-eholdings-customer-resource-show-subjects-list>
                {record.subjectsList.map(subjectObj => subjectObj.subject).join('; ')}
              </div>
            </KeyValueLabel>
          ) }

          <KeyValueLabel label="Package">
            <div data-test-eholdings-customer-resource-show-package-name>
              <Link to={`/eholdings/vendors/${record.vendorId}/packages/${record.packageId}`}>{record.packageName}</Link>
            </div>
          </KeyValueLabel>

          {record.contentType && (
            <KeyValueLabel label="Content Type">
              <div data-test-eholdings-customer-resource-show-content-type>
                {record.contentType}
              </div>
            </KeyValueLabel>
          ) }

          <KeyValueLabel label="Vendor">
            <div data-test-eholdings-customer-resource-show-vendor-name>
              <Link to={`/eholdings/vendors/${record.vendorId}`}>{record.vendorName}</Link>
            </div>
          </KeyValueLabel>

          {record.url && (
            <KeyValueLabel label="Managed URL">
              <div data-test-eholdings-customer-resource-show-managed-url>
                <Link to={record.url}>{record.url}</Link>
              </div>
            </KeyValueLabel>
          ) }

          {record.managedCoverageList && record.managedCoverageList.length > 0 && isValidCoverageList(record.managedCoverageList) && (
            <KeyValueLabel label="Managed Coverage Dates">
              <CoverageDates
                coverageArray={record.managedCoverageList}
                id="customer-resource-show-managed-coverage-list"
                isYearOnly={isBookPublicationType(record.pubType)}
              />
            </KeyValueLabel>
          ) }

          {record.managedEmbargoPeriod.embargoUnit && record.managedEmbargoPeriod.embargoValue && (
            <KeyValueLabel label="Managed Embargo Period">
              <div data-test-eholdings-customer-resource-show-managed-embargo-period>
                {record.managedEmbargoPeriod.embargoValue} {record.managedEmbargoPeriod.embargoUnit}
              </div>
            </KeyValueLabel>
          ) }

          {record.customEmbargoPeriod.embargoUnit && record.customEmbargoPeriod.embargoValue && (
            <KeyValueLabel label="Custom Embargo Period">
              <div data-test-eholdings-customer-resource-show-custom-embargo-period>
                {record.customEmbargoPeriod.embargoValue} {record.customEmbargoPeriod.embargoUnit}
              </div>
            </KeyValueLabel>
          ) }

          <hr />

          <label
            data-test-eholdings-customer-resource-show-selected
            htmlFor="customer-resource-show-toggle-switch"
          >
            <h4>{record.isSelected ? 'Selected' : 'Not Selected'}</h4>
            <ToggleSwitch
              onChange={toggleSelected}
              disabled={toggleRequest.isPending}
              checked={record.isSelected}
              isPending={toggleRequest.isPending}
              id="customer-resource-show-toggle-switch"
            />
          </label>

          <hr />

          {record.visibilityData.isHidden && (
            <div data-test-eholdings-customer-resource-show-is-hidden>
              <p><strong>This resource is hidden.</strong></p>
              <p data-test-eholdings-customer-resource-show-hidden-reason><em>{mapMessageReason(record.visibilityData.reason)}</em></p>
              <hr />
            </div>
          )}

          <div>
            <Link to={`/eholdings/titles/${record.titleId}`}>
              View all packages that include this title
            </Link>
          </div>
        </div>
      ) : customerResource.isRejected ? (
        <p data-test-eholdings-customer-resource-show-error>
          {customerResource.error.length ? customerResource.error[0].message : customerResource.error.message}
        </p>
      ) : (
        <Icon icon="spinner-ellipsis" />
      )}
    </div>
  );
}

CustomerResourceShow.propTypes = {
  customerResource: PropTypes.object.isRequired,
  toggleRequest: PropTypes.object.isRequired,
  toggleSelected: PropTypes.func.isRequired
};
