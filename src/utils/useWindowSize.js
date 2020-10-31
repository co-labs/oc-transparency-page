import { useEffect, useState } from 'react'
import { debounce } from "lodash";

/**
 * Return window size on resize.
 * @return {number[]}
 */
export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);

  useEffect(() => {
    const updateSize = debounce(() => {
      setSize([window.innerWidth, window.innerHeight]);
    }, 100);

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}
