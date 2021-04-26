import { useState } from 'react';

import { expandAllFunction } from '@folio/stripes/components';

const useSectionToggle = (initialSections) => {
  const [sections, setSections] = useState(initialSections);

  const handleSectionToggle = ({ id }) => {
    setSections({
      ...sections,
      [id]: !sections[id],
    });
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
};

export default useSectionToggle;
