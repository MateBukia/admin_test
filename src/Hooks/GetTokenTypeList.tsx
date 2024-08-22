import { useState, useEffect } from 'react';

const useGetTokenTypeList = () => {
  const [tokenStringTypeIDOptions, setTokenStringTypeIDOptions] = useState<{ value: number, label: string }[]>([]);

  useEffect(() => {
    fetch('http://10.25.25.6:3000/lookup/token_type_list')
      .then((response) => response.json())
      .then((data) => {
        const mappedOptions = data.map((item: { id: number, name: string }) => ({
          value: item.id,
          label: item.name
        }));
        setTokenStringTypeIDOptions(mappedOptions);
      })
      .catch((error) => {
        console.error('Error fetching token types:', error);
      });
  }, []);

  return tokenStringTypeIDOptions;
};

export default useGetTokenTypeList;
