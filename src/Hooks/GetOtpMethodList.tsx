import { useEffect } from 'react';
import { RowData } from '../Types/RowDataType';

const useGetMethodList = (setRows: React.Dispatch<React.SetStateAction<RowData[]>>) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_baseApiUrl}/otp-method/get_list?skip=0&limit=100`);
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [setRows]);

};

export default useGetMethodList;