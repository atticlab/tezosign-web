import { useMemo, useState } from 'react';

const useSortableData = (items) => {
  const [sortConfig, setSortConfig] = useState(null);

  const sortedItems = useMemo(() => {
    if (sortConfig !== null) {
      items.sort((a, b) => {
        const x = a[sortConfig.key] || a.operation_info[sortConfig.key] || 0;
        const y = b[sortConfig.key] || b.operation_info[sortConfig.key] || 0;

        if (x < y) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (x > y) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return items;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { listRows: sortedItems, requestSort, sortConfig };
};

export default useSortableData;
