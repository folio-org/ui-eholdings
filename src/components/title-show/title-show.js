import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import KeyValueLabel from '../key-value-label';
import List from '@folio/stripes-components/lib/List';
import styles from './title-show.css';

export default function TitleShow({ title }) {
  const renderPackageListItem = item => (
    <li key={item.packageId} data-test-eholdings-title-show-package>
      <h5 data-test-eholdings-title-show-package-name>
        <Link to={`/eholdings/vendors/${item.vendorId}/packages/${item.packageId}/titles/${item.titleId}`}>{item.packageName}</Link>
      </h5>
      <div data-test-eholdings-title-show-package-selected>
        <span>{item.isSelected ? 'Selected' : 'Not Selected'}</span>
     </div>
    </li>
  );

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

              <hr />
              <h3>Packages</h3>
              <List
                itemFormatter={renderPackageListItem}
                items={title.customerResourcesList}
                listClass={styles.list}
              />
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
