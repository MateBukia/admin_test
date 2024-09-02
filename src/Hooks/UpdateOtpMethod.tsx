import { useState } from 'react';
import { RowData } from '../Types/RowDataType';

export default function useUpdateOtp(
  setError: (message: any) => void
) {
  const [loading, setLoading] = useState(false);

  const updateOtp = async (id: number, updatedRow: RowData) => {
    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        ...updatedRow,
        smsProductID: Number(updatedRow.smsProductID),
        isSendSms: updatedRow.isSendSms ? 1 : 0, 
      };

      const response = await fetch(`${process.env.REACT_APP_baseApiUrl}/otp-method/update-otp-method/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update OTP method');
      }
  
      const contentType = response.headers.get('Content-Type');
      let successMessage: string;
  
      if (contentType && contentType.includes('application/json')) {
        const jsonResponse = await response.json();
        successMessage = jsonResponse.message || 'OTP method updated successfully!';
      } else {
        successMessage = await response.text(); 
      }
  
      return successMessage;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateOtp, loading };
}
