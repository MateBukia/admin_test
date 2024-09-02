import { useState, useEffect } from 'react';

const useGetChannelList = () => {
  const [ChannelID, setChannelID] = useState<{ value: number, label: string }[]>([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_baseApiUrl}/lookup/channel_list`)
      .then((response) => response.json())
      .then((data) => {
        const mappedOptions = data.map((item: { id: number, name: string }) => ({
          value: item.id,
          label: item.name
        }));
        setChannelID(mappedOptions);
      })
      .catch((error) => {
        console.error('Error fetching token types:', error);
      });
  }, []);

  return ChannelID;
};

export default useGetChannelList;