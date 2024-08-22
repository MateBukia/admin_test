import { useEffect } from 'react';

const useAutoClear = (successMessage: unknown, errorMessage: unknown, setSuccessMessage: (arg0: null) => void, setErrorMessage: (arg0: null) => void) =>{
    useEffect(() => {
        if (successMessage || errorMessage) {
          const timer = setTimeout(() => {
            setSuccessMessage(null);
            setErrorMessage(null);
          }, 3000); 
      
          return () => clearTimeout(timer);
        }
      }, [successMessage, errorMessage, setSuccessMessage, setErrorMessage]);
}
export default useAutoClear;
  