import React from 'react';
import PropTypes from 'prop-types';

import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import KeyValueLabel from './key-value-label';
import List from './list';
import PackageListItem from './package-list-item';
import IdentifiersList from './identifiers-list';
import ContributorsList from './contributors-list';

export default function TitleShow({ title }) {
  let record = title.content;

  return (
    <div data-test-eholdings-title-show>
      <Paneset>
        <Pane defaultWidth="100%">
          {title.isResolved ? (
            <div>
              <div style={{ margin: '2rem 0' }}>
                <KeyValueLabel label="Title">
                  <h1 data-test-eholdings-title-show-title-name>
                    {record.titleName}
                  </h1>
                </KeyValueLabel>
              </div>

              <KeyValueLabel label="Publisher">
                <div data-test-eholdings-title-show-publisher-name>
                  {record.publisherName}
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Publication Type">
                <div data-test-eholdings-title-show-publication-type>
                  {record.pubType}
                </div>
              </KeyValueLabel>

              <IdentifiersList data={record.identifiersList} />
              <ContributorsList data={record.contributorsList} />

              {record.subjectsList.length > 0 && (
                <KeyValueLabel label="Subjects">
                  <div data-test-eholdings-title-show-subjects-list>
                    {record.subjectsList.map((subjectObj) => subjectObj.subject).join('; ')}
                  </div>
                </KeyValueLabel>
              ) }

              <hr />
              <h3>Packages</h3>
              <List data-test-eholdings-title-show-package-list>
                {record.customerResourcesList.map(item => (
                  <PackageListItem
                    key={item.packageId}
                    item={item}
                    link={`/eholdings/vendors/${item.vendorId}/packages/${item.packageId}/titles/${record.titleId}`}>
                  </PackageListItem>
                ))}
              </List>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Pane>
      </Paneset>
    </div>
  );
}

TitleShow.propTypes = {
  title: PropTypes.object.isRequired
};
