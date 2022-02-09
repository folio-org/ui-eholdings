import { useState } from 'react';

import { sortOrders } from '../../constants';

export default function (sortOrder, sortedColumn, onSortChange = () => {}) {
  const [currentSortOrder, setCurrentSortOrder] = useState(sortOrder);
  const [currentColumn, setCurrentColumn] = useState(sortedColumn);

  const onChange = (_, metadata) => { // see MultiColumnList onHeaderClick prop for parameter details
    const { name: newName } = metadata;

    let newOrder;

    if (newName !== currentColumn) {
      setCurrentColumn(newName);
      newOrder = sortOrders.asc;
    } else {
      newOrder = currentSortOrder.name === sortOrders.asc.name
        ? sortOrders.desc
        : sortOrders.asc;
    }

    setCurrentSortOrder(newOrder);

    onSortChange(newName, newOrder);
  };

  const currentParameters = {
    sortOrder: currentSortOrder,
    sortedColumn: currentColumn,
  };

  return [currentParameters, onChange];
}
