import { useCallback, useRef, useState } from 'react';

const useInfiniteScroll = (isLoading, filterOpr) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const lastItem = useCallback(
    (node) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !filterOpr) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, filterOpr],
  );

  return { setHasMore, lastItem, pageNumber, setPageNumber };
};

export default useInfiniteScroll;
