import { useCallback, useRef } from 'react'

const useInfiniteScroll = ({ loading = false, setPage, hasMore = false }) => {
    const observer = useRef(null);

    const lastItemRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
                async (entries) => {
                    if (entries[0].isIntersecting && hasMore) {
                        await setPage((prevPage) => prevPage + 1);
                    }
                },
                { threshold: 1.0 }
            );
            if (node) observer.current.observe(node);
        },
        [loading, hasMore, setPage]
    );

    const getItemRef = useCallback((index, totalItems) => {
        if (index === totalItems - 1) {
            return lastItemRef;
        }
    }, [lastItemRef])

    return {
        lastItemRef, observer, getItemRef
    }
}

export default useInfiniteScroll