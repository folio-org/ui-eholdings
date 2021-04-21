import { useState } from 'react';
import update from 'lodash/fp/update';

import { expandAllFunction } from '@folio/stripes/components';

export default function (initialSections) {
  const [sections, setSections] = useState(initialSections);

  const handleSectionToggle = ({ id }) => {
    const next = update(`sections.${id}`, value => !value, { sections });
    setSections(next.sections);
  };

  const handleExpandAll = (expandedSections) => {
    setSections(expandedSections);
  };

  const toggleAllSections = (expand) => {
    const next = expandAllFunction(sections, expand);
    setSections(next);
  };

  return [sections, {
    handleSectionToggle,
    handleExpandAll,
    toggleAllSections,
  }];
}
