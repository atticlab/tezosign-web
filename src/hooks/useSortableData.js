import { useMemo, useState } from 'react';

const resolvePath = (object, path, defaultValue) =>
  path
    .split(/[.[\]'"]/)
    .filter((p) => p)
    .reduce((o, p) => (o ? o[p] : defaultValue), object);

const useSortableData = (items) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    altKeys: null,
    direction: null,
  });

  const sortedItems = useMemo(() => {
    const sortableItems = [...items];

    if (sortConfig.direction === null) return sortableItems;

    return sortableItems.sort((a, b) => {
      // const x = a[sortConfig.key] || a[nestedObjectKey][sortConfig.key] || 0;
      // const y = b[sortConfig.key] || b[nestedObjectKey][sortConfig.key] || 0;
      const x =
        (sortConfig.altKeys &&
          sortConfig.altKeys
            .map((propPath) => resolvePath(a, propPath))
            .filter((value) => typeof value !== 'undefined')[0]) ||
        a[sortConfig.key] ||
        0;
      const y =
        (sortConfig.altKeys &&
          sortConfig.altKeys
            .map((propPath) => resolvePath(b, propPath))
            .filter((value) => typeof value !== 'undefined')[0]) ||
        b[sortConfig.key] ||
        0;

      if (x < y) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (x > y) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [items, sortConfig]);

  const requestSort = (key, altKeys) => {
    let direction = 'ascending';

    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, altKeys, direction });
  };

  return { listRows: sortedItems, requestSort, sortConfig };
};

export default useSortableData;
