import React from 'react';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import KeyValueLabel from '../key-value-label';
import PackageListItem from '../package-list-item';
import styles from './title-show.css';

export default function TitleShow({ title }) {
  return (
    <div data-test-eholdings-title-show>
      <Paneset>
        <Pane defaultWidth="100%">
          {title ? (
            <div>
              <div style={{ margin: '2rem 0' }}>
                <KeyValueLabel label="Title">
                  <h1 data-test-eholdings-title-show-title-name>
                    {title.titleName}
                  </h1>
                </KeyValueLabel>
              </div>

              <KeyValueLabel label="Publisher">
                <div data-test-eholdings-title-show-publisher-name>
                  {title.publisherName}
                </div>
              </KeyValueLabel>

              <KeyValueLabel label="Publisher Type">
                <div data-test-eholdings-title-show-publisher-type>
                  {title.pubType}
                </div>
              </KeyValueLabel>

              <hr />
              <h3>Packages</h3>
              <ul data-test-eholdings-title-show-package-list className={styles['list']}>
                {title.customerResourcesList.map(item => (
                  <PackageListItem
                    key={item.packageId}
                    item={item}
                    link={`/eholdings/vendors/${item.vendorId}/packages/${item.packageId}/titles/${title.titleId}`}>
                  </PackageListItem>
                ))}
              </ul>
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
  title: PropTypes.object
};
