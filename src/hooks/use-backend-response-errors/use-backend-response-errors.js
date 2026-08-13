import {
  useCallback,
  useState,
} from 'react';

export const useBackendResponseErrors = () => {
  const [errors, setErrors] = useState([]);

  const onError = useCallback(async (error) => {
    try {
      const body = await error.response.json();
      // for some reason `error` property of the mutation object is not being set
      // returning or throwing an error doesn't set it, so we'll just resort to having a separate
      // state for errors
      setErrors(body.errors);
    } catch (e) {
      setErrors([]);
    }
  }, []);

  return {
    onError,
    errors,
  };
};
