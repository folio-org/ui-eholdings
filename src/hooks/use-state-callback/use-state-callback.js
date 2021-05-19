import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';

const useStateCallback = (initialState) => {
  const [state, setState] = useState(initialState);
  const callbackRef = useRef(null); // mutable ref to store current callback

  const setStateCallback = useCallback((_state, callback) => {
    callbackRef.current = callback; // store passed callback to ref
    setState(_state);
  }, []);

  useEffect(() => {
    // cb.current is `null` on initial render, so we only execute cb on state *updates*
    if (callbackRef.current) {
      callbackRef.current(state);
      callbackRef.current = null; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
};

export default useStateCallback;
