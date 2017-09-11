import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import KeyValueLabel from './key-value-label';
import IdentifiersList from './identifiers-list';

export default function CustomerResourceShow({ model, toggleSelected }) {
  const { record, toggle } = model;
  const resource = record.content;

  return (
    <div data-test-eholdings-customer-resource-show>
      <Paneset>
        <Pane defaultWidth="100%">
          {record.isResolved ? (
            <div>
              <div style={{ margin: '2rem 0' }}>
                <KeyValueLabel label="Resource">
                  <h1 data-test-eholdings-customer-resource-show-title-name>
                    {resource.titleName}
                  </h1>
                </KeyValueLabel>
              </div>

              <KeyValueLabel label="Publisher">
                <div data-test-eholdings-customer-resource-show-publisher-name>
                  {resource.publisherName}
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Publication Type">
                <div data-test-eholdings-customer-resource-show-publication-type>
                  {resource.pubType}
                </div>
              </KeyValueLabel>

              <IdentifiersList data={resource.identifiersList} />

              <KeyValueLabel label="Package">
                <div data-test-eholdings-customer-resource-show-package-name>
                  <Link to={`/eholdings/vendors/${resource.vendorId}/packages/${resource.packageId}`}>{resource.packageName}</Link>
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Content Type">
                <div data-test-eholdings-customer-resource-show-content-type>
                  {resource.contentType}
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Vendor">
                <div data-test-eholdings-customer-resource-show-vendor-name>
                  <Link to={`/eholdings/vendors/${resource.vendorId}`}>{resource.vendorName}</Link>
                </div>
              </KeyValueLabel>

              {resource.url && (
                <KeyValueLabel label="Managed URL">
                  <div data-test-eholdings-customer-resource-show-managed-url>
                    <Link to={resource.url}>{resource.url}</Link>
                  </div>
                </KeyValueLabel>
              ) }

              {resource.subjectsList && resource.subjectsList.length > 0 && (
                <KeyValueLabel label="Subjects">
                  <div data-test-eholdings-customer-resource-show-subjects-list>
                    {resource.subjectsList.map((subjectObj) => subjectObj.subject).join('; ')}
                  </div>
                </KeyValueLabel>
              ) }

              <hr />

              <KeyValueLabel label="Selected">
                <div data-test-eholdings-customer-resource-show-selected>
                  <input type="checkbox" onChange={toggleSelected} disabled={toggle.isPending} checked={resource.isSelected} />
                  {resource.isSelected ? 'Yes' : 'No'}
                  {toggle.isPending && (
                    <span data-test-eholdings-customer-resource-show-is-selecting>...</span>
                  )}
                </div>
              </KeyValueLabel>

              <hr/>

              {resource.visibilityData.isHidden && (
                <div data-test-eholdings-customer-resource-show-is-hidden>
                  <p><strong>This resource is hidden.</strong></p>
                  <p><em>{resource.visibilityData.reason}</em></p>
                  <hr />
                </div>
              )}

              <div>
                <Link to={`/eholdings/titles/${resource.titleId}`}>
                  View all packages that include this title
                </Link>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Pane>
      </Paneset>
    </div>
  );
}

CustomerResourceShow.propTypes = {
  model: PropTypes.object,
  saveSelected: PropTypes.func,
  toggleSelected: PropTypes.func
};
