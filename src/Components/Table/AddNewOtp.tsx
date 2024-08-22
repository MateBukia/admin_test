import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Button,
  SelectChangeEvent,
  CircularProgress,
  Typography,
} from '@mui/material';
import { RowData } from '../../Types/RowDataType';
import useGetChannelList from '../../Hooks/GetChannelList';
import useGetTokenTypeList from '../../Hooks/GetTokenTypeList';

interface CreateNewOtpProps {
  open: boolean;
  onClose: () => void;
  setRows: React.Dispatch<React.SetStateAction<RowData[]>>;
  rows: RowData[];
  setSuccessMessage: (message: string) => void;
  setErrorMessage: (message: string) => void;
}

const CreateNewOtp: React.FC<CreateNewOtpProps> = ({
  open,
  onClose,
  setRows,
  rows,
  setSuccessMessage,
  setErrorMessage,
}) => {
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [type, setType] = useState<number | string>('');
  const [channelID, setChannelID] = useState<number>(1);
  const [tokenIdentityParams, setTokenIdentityParams] = useState('');
  const [expireTimeMinute, setExpireTimeMinute] = useState<number>(5);
  const [checkVerifyTryCount, setCheckVerifyTryCount] = useState<number>(3);
  const [generateLimitQuantity, setGenerateLimitQuantity] = useState<number>(10);
  const [generateLimitTimeMinute, setGenerateLimitTimeMinute] = useState<number>(60);
  const [smsProductID, setSmsProductID] = useState<number>(164);
  const [tokenLength, setTokenLength] = useState<number>(6);
  const [generateLimitWithoutQuantityTimeSecond, setGenerateLimitWithoutQuantityTimeSecond] =
    useState<number>(1);
  const [smsTemplate, setSmsTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const channelIDOptions = useGetChannelList();
  const tokenStringTypeIDOptions = useGetTokenTypeList();

  const handleTypeChange = (event: SelectChangeEvent<number | string>) => {
    setType(event.target.value as number | string);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const requestBody = {
      name: description,
      channelID,
      tokenIdentityParams,
      expireTimeMinute,
      checkVerifyTryCount,
      generateLimitQuantity,
      generateLimitTimeMinute,
      isSendSms: isActive ? 1 : 0,
      smsProductID,
      tokenLength,
      generateLimitWithoutQuantityTimeSecond,
      tokenStringTypeID: typeof type === 'number' ? type : 1,
      smsTemplate,
    };

    try {
      const response = await fetch(
        'http://10.25.25.6:3000/otp-method/create-otp-method',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.status === 201) {
        const contentType = response.headers.get('Content-Type');
  
        if (contentType && contentType.includes('application/json')) {
          const newOtpMethod: RowData = await response.json(); 
          setRows([...rows, newOtpMethod]);
          setSuccessMessage('OTP method created successfully!');
        } else {
          const successMessage = await response.text(); 
          setSuccessMessage(successMessage);
        }
  
        resetForm();
        onClose();
      } else if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create OTP method');
      }
    } catch (err: any) {
      setError(err.message);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDescription('');
    setIsActive(false);
    setType('');
    setChannelID(1);
    setTokenIdentityParams('');
    setExpireTimeMinute(5);
    setCheckVerifyTryCount(3);
    setGenerateLimitQuantity(10);
    setGenerateLimitTimeMinute(60);
    setSmsProductID(164);
    setTokenLength(6);
    setGenerateLimitWithoutQuantityTimeSecond(1);
    setSmsTemplate('');
    setError(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New OTP Method</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="dense"
          required
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Channel ID</InputLabel>
          <Select
            value={channelID}
            onChange={(e) => setChannelID(Number(e.target.value))}
            label="Channel ID"
          >
            {channelIDOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
          </Select>
        </FormControl>
        <TextField
          label="Token Identity Params"
          value={tokenIdentityParams}
          onChange={(e) => setTokenIdentityParams(e.target.value)}
          fullWidth
          margin="dense"
          required
        />
        <TextField
          label="Expire Time (Minutes)"
          type="number"
          value={expireTimeMinute}
          onChange={(e) => setExpireTimeMinute(Number(e.target.value))}
          fullWidth
          margin="dense"
          required
        />
        <TextField
          label="Check Verify Try Count"
          type="number"
          value={checkVerifyTryCount}
          onChange={(e) => setCheckVerifyTryCount(Number(e.target.value))}
          fullWidth
          margin="dense"
          required
        />
        <TextField
          label="Generate Limit Quantity"
          type="number"
          value={generateLimitQuantity}
          onChange={(e) => setGenerateLimitQuantity(Number(e.target.value))}
          fullWidth
          margin="dense"
          required
        />
        <TextField
          label="Generate Limit Time (Minutes)"
          type="number"
          value={generateLimitTimeMinute}
          onChange={(e) => setGenerateLimitTimeMinute(Number(e.target.value))}
          fullWidth
          margin="dense"
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              color="primary"
            />
          }
          label="Send SMS"
          sx={{ marginTop: 1 }}
        />
        <TextField
          label="SMS Product ID"
          type="number"
          value={smsProductID}
          onChange={(e) => setSmsProductID(Number(e.target.value))}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Token Length"
          type="number"
          value={tokenLength}
          onChange={(e) => setTokenLength(Number(e.target.value))}
          fullWidth
          margin="dense"
          required
        />
        <TextField
          label="Generate Limit Without Quantity Time (Seconds)"
          type="number"
          value={generateLimitWithoutQuantityTimeSecond}
          onChange={(e) =>
            setGenerateLimitWithoutQuantityTimeSecond(Number(e.target.value))
          }
          fullWidth
          margin="dense"
          required
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Token String Type ID</InputLabel>
          <Select
            value={type}
            onChange={handleTypeChange}
            label="Token String Type ID"
            required
          >
             {tokenStringTypeIDOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
          </Select>
        </FormControl>
        <TextField
          label="SMS Template"
          value={smsTemplate}
          onChange={(e) => setSmsTemplate(e.target.value)}
          fullWidth
          margin="dense"
        //   required={isActive}
        //   disabled={!isActive}
        />
        {/* {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )} */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Saving...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewOtp;
