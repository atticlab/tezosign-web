import { useMemo, useState } from 'react';

const useSortableData = (items, nestedObjectKey) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  const sortedItems = useMemo(() => {
    const sortableItems = [...items];

    if (sortConfig.direction === null) return sortableItems;

    return sortableItems.sort((a, b) => {
      const x = a[sortConfig.key] || a[nestedObjectKey][sortConfig.key] || 0;
      const y = b[sortConfig.key] || b[nestedObjectKey][sortConfig.key] || 0;

      if (x < y) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (x > y) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [items, sortConfig, nestedObjectKey]);

  const requestSort = (key) => {
    let direction = 'ascending';

    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { listRows: sortedItems, requestSort, sortConfig };
};

export default useSortableData;
