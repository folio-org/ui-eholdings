import React from 'react';
import PropTypes from 'prop-types';

import { Accordion, FilterAccordionHeader } from '@folio/stripes-components/lib/Accordion';
import RadioButton from '@folio/stripes-components/lib/RadioButton';

const pubtypeFilters = [
  { label: 'All', value: 'all' },
  { label: 'Audio Book', value: 'audiobook' },
  { label: 'Book', value: 'book' },
  { label: 'Book Series', value: 'bookseries' },
  { label: 'Database', value: 'database' },
  { label: 'Journal', value: 'journal' },
  { label: 'Newsletter', value: 'newsletter' },
  { label: 'Newspaper', value: 'newspaper' },
  { label: 'Proceedings', value: 'proceedings' },
  { label: 'Report', value: 'report' },
  { label: 'Streaming Audio', value: 'streamingaudio' },
  { label: 'Streaming Video', value: 'streamingvideo' },
  { label: 'Thesis & Dissertation', value: 'thesisdissertation' },
  { label: 'Website', value: 'website' },
  { label: 'Unspecified', value: 'unspecified' }
];

export default function TitleSearchFilters({
  filter,
  onUpdate
}) {
  // this is not a default property to allow `null` as a filter
  let pubtype = filter || 'all';

  return (
    <div data-test-eholdings-title-search-filters>
      <Accordion
        name="pubtype"
        label="Publication Type"
        separator={false}
        header={FilterAccordionHeader}
        displayClearButton={pubtype !== 'all'}
        onClearFilter={() => onUpdate('all')}
        closedByDefault={false}
      >
        {pubtypeFilters.map(({ label, value }, i) => (
          <RadioButton
            key={i}
            name="pubtype"
            id={`eholdings-title-search-filters-pubtype-${value}`}
            label={label}
            value={value}
            checked={value === pubtype}
            onChange={() => onUpdate(value)}
          />
        ))}
      </Accordion>
    </div>
  );
}

TitleSearchFilters.propTypes = {
  filter: PropTypes.string,
  onUpdate: PropTypes.func.isRequired
};
