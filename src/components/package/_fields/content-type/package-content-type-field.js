import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Select } from '@folio/stripes/components';

class PackageContentTypeField extends Component {
  render() {
    return (
      <div data-test-eholdings-package-content-type-field>
        <Field
          name="contentType"
          component={Select}
          label="Content type"
        >
          <FormattedMessage id="ui-eholdings.filter.contentType.aggregated">
            {(message) => <option value="Aggregated Full Text">{message}</option>}
          </FormattedMessage>
          <FormattedMessage id="ui-eholdings.filter.contentType.abstract">
            {(message) => <option value="Abstract and Index">{message}</option>}
          </FormattedMessage>
          <FormattedMessage id="ui-eholdings.filter.contentType.ebook">
            {(message) => <option value="E-Book">{message}</option>}
          </FormattedMessage>
          <FormattedMessage id="ui-eholdings.filter.contentType.ejournal">
            {(message) => <option value="E-Journal">{message}</option>}
          </FormattedMessage>
          <FormattedMessage id="ui-eholdings.filter.contentType.print">
            {(message) => <option value="Print">{message}</option>}
          </FormattedMessage>
          <FormattedMessage id="ui-eholdings.filter.contentType.onlineReference">
            {(message) => <option value="Online Reference">{message}</option>}
          </FormattedMessage>
          <FormattedMessage id="ui-eholdings.filter.contentType.unknown">
            {(message) => <option value="Unknown">{message}</option>}
          </FormattedMessage>
        </Field>
      </div>
    );
  }
}

export default PackageContentTypeField;
