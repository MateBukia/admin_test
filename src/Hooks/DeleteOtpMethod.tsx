import { RowData } from '../Types/RowDataType';

const deleteOtpMethod = (
  id: number,
  rows: RowData[],
  setRows: React.Dispatch<React.SetStateAction<RowData[]>>,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const url = `http://10.25.25.6:3000/otp-method/delete-otp-method/${id}`;

  fetch(url, {
    method: 'DELETE',
  })
    .then(response => {
      if (response.ok) {
        setRows(rows.filter(row => row.id !== id));
        setSuccessMessage('OTP successfully deleted.');
      } else {
        console.error('Failed to delete OTP');
        setErrorMessage('Failed to delete OTP.');
      }
    })
    .catch(error => {
      console.error('Error deleting OTP:', error);
      setErrorMessage('Error deleting OTP.');
    });
};

export default deleteOtpMethod;
