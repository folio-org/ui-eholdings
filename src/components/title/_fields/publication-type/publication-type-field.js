import React from 'react';
import { Field } from 'react-final-form';

import { Select } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

export default function PublicationTypeField() {
  return (
    <div data-test-eholdings-publication-type-field>
      <Field
        name="publicationType"
        component={Select}
        label={<FormattedMessage id="ui-eholdings.title.publicationType" />}
      >
        <FormattedMessage id="ui-eholdings.filter.pubType.audioBook">
          {(message) => <option value="Audiobook">{message}</option>}
        </FormattedMessage>
        <FormattedMessage id="ui-eholdings.filter.pubType.book">
          {(message) => <option value="Book">{message}</option>}
        </FormattedMessage>
        <FormattedMessage id="ui-eholdings.filter.pubType.bookSeries">
          {(message) => <option value="Book Series">{message}</option>}
        </FormattedMessage>
        <FormattedMessage id="ui-eholdings.filter.pubType.database">
          {(message) => <option value="Database">{message}</option>}
        </FormattedMessage>
        <FormattedMessage id="ui-eholdings.filter.pubType.journal">
          {(message) => <option value="Journal">{message}</option>}
        </FormattedMessage>
        <FormattedMessage id="ui-eholdings.filter.pubType.newsletter">
          {(message) => <option value="Newsletter">{message}</option>}
        </FormattedMessage>
        <FormattedMessage id="ui-eholdings.filter.pubType.newspaper">
          {(message) => <option value="Newspaper">{message}</option>}
        </FormattedMessage>
        <FormattedMessage id="ui-eholdings.filter.pubType.proceedings">
          {(message) => <option value="Proceedings">{message}</option>}
        </FormattedMessage>
        <FormattedMessage id="ui-eholdings.filter.pubType.report">
          {(message) => <option value="Report">{message}</option>}
        </FormattedMessage>
        <FormattedMessage id="ui-eholdings.filter.pubType.streamingAudio">
          {(message) => <option value="Streaming Audio">{message}</option>}
        </FormattedMessage>
        <FormattedMessage id="ui-eholdings.filter.pubType.streamingVideo">
          {(message) => <option value="Streaming Video">{message}</option>}
        </FormattedMessage>
        <FormattedMessage id="ui-eholdings.filter.pubType.thesisdissertation">
          {(message) => <option value="Thesis/Dissertation">{message}</option>}
        </FormattedMessage>
        <FormattedMessage id="ui-eholdings.filter.pubType.unspecified">
          {(message) => <option value="Unspecified">{message}</option>}
        </FormattedMessage>
        <FormattedMessage id="ui-eholdings.filter.pubType.website">
          {(message) => <option value="Web Site">{message}</option>}
        </FormattedMessage>
      </Field>
    </div>
  );
}
