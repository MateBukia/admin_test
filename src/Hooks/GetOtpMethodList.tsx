import { useEffect } from 'react';
import { RowData } from '../Types/RowDataType';

const useGetMethodList = (setRows: React.Dispatch<React.SetStateAction<RowData[]>>) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://10.25.25.6:3000/otp-method/get_list?skip=0&limit=10');
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