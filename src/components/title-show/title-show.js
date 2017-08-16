import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import List from '@folio/stripes-components/lib/List';
import styles from './title-show.css';

export default function TitleShow({ title }) {
  const renderPackageListItem = item => (
    <li key={item.packageId} data-test-eholdings-title-show-package>
      <h5 data-test-eholdings-title-show-package-name>
        <Link to={`/eholdings/vendors/${item.vendorId}/packages/${item.packageId}/titles/${item.titleId}`}>{item.packageName}</Link>
      </h5>
      <div data-test-eholdings-title-show-package-selected>
        <span>{item.isSelected ? 'Selected' : 'Unselected'}</span>
     </div>
    </li>
  );

  return (
    <div data-test-eholdings-title-show>
      <Paneset>
        <Pane defaultWidth="100%">
          {title ? (
            <div>
              <h1 data-test-eholdings-title-show-title-name>
                {title.titleName}
              </h1>
              <div data-test-eholdings-title-show-publisher-name>
                <KeyValue label="Publisher" value={title.publisherName} />
              </div>
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
