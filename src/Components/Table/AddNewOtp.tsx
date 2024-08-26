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
  Grid,
  useTheme, 
} from '@mui/material';
import { RowData } from '../../Types/RowDataType';
import useGetChannelList from '../../Hooks/GetChannelList';
import useGetTokenTypeList from '../../Hooks/GetTokenTypeList';
import validateFields from '../../Hooks/ValidateFields'

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
  const [description, setDescription] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [type, setType] = useState<number | string>('');
  const [channelID, setChannelID] = useState<number | undefined>(undefined);
  const [tokenIdentityParams, setTokenIdentityParams] = useState<string>('');
  const [expireTimeMinute, setExpireTimeMinute] = useState<number | undefined>(undefined);
  const [checkVerifyTryCount, setCheckVerifyTryCount] = useState<number | undefined>(undefined);
  const [generateLimitQuantity, setGenerateLimitQuantity] = useState<number | undefined>(undefined);
  const [generateLimitTimeMinute, setGenerateLimitTimeMinute] = useState<number | undefined>(undefined);
  const [smsProductID, setSmsProductID] = useState<number | undefined>(undefined);
  const [tokenLength, setTokenLength] = useState<number | undefined>(undefined);
  const [generateLimitWithoutQuantityTimeSecond, setGenerateLimitWithoutQuantityTimeSecond] =
    useState<number | undefined>(undefined);
  const [smsTemplate, setSmsTemplate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [tokenStringTypeID, serTokenStringTypeID] = useState<number | undefined>(undefined);

  const channelIDOptions = useGetChannelList();
  const tokenStringTypeIDOptions = useGetTokenTypeList();

  const theme = useTheme();
  

   const handleTypeChange = (event: SelectChangeEvent<number | string>) => {
    setType(event.target.value as number | string);
  };

  const handleInputChange = (key: keyof RowData, value: any) => {
    let errorMessage = validateFields(key, value);
    setErrors((prevErrors) => ({ ...prevErrors, [key]: errorMessage }));

    switch (key) {
      case 'description':
        setDescription(value);
        break;
      case 'channelID':
        setChannelID(value);
        break;
      case 'tokenIdentityParams':
        setTokenIdentityParams(value);
        break;
      case 'expireTimeMinute':
        setExpireTimeMinute(value);
        break;
      case 'checkVerifyTryCount':
        setCheckVerifyTryCount(value);
        break;
      case 'generateLimitQuantity':
        setGenerateLimitQuantity(value);
        break;
      case 'generateLimitTimeMinute':
        setGenerateLimitTimeMinute(value);
        break;
      case 'smsProductID':
        setSmsProductID(value);
        break;
      case 'tokenLength':
        setTokenLength(value);
        break;
      case 'generateLimitWithoutQuantityTimeSecond':
        setGenerateLimitWithoutQuantityTimeSecond(value);
        break;
      case 'smsTemplate':
        setSmsTemplate(value);
        break;
      default:
        break;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const validationErrors: { [key: string]: string | null } = {};
    Object.entries({
      description,
      channelID,
      tokenIdentityParams,
      expireTimeMinute,
      checkVerifyTryCount,
      generateLimitQuantity,
      generateLimitTimeMinute,
      smsProductID,
      tokenLength,
      generateLimitWithoutQuantityTimeSecond,
      smsTemplate,
      tokenStringTypeID,
    }).forEach(([key, value]) => {
      const errorMessage = validateFields(key as keyof RowData, value);
      if (errorMessage) validationErrors[key] = errorMessage;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

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

  const handleClose = () => {
    setErrors({});
    onClose();
  }

  const resetForm = () => {
    setDescription('');
    setIsActive(false);
    setType('');
    setChannelID(undefined);
    setTokenIdentityParams('');
    setExpireTimeMinute(undefined);
    setCheckVerifyTryCount(undefined);
    setGenerateLimitQuantity(undefined);
    setGenerateLimitTimeMinute(undefined);
    setSmsProductID(undefined);
    setTokenLength(undefined);
    setGenerateLimitWithoutQuantityTimeSecond(undefined);
    setSmsTemplate('');
    serTokenStringTypeID(undefined);
    setError(null);
    setErrors({});
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New OTP Method</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Name Field */}
          <Grid item xs={12}>
            <TextField
              label="Name"
              value={description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              fullWidth
              margin="dense"
              required
              InputLabelProps={{ shrink: true, sx: { color: '#1976d2' } }}
              InputProps={{
                sx: {
                  backgroundColor: 'white',
                  borderColor: '#1976d2',
                },
              }}
              variant="outlined"
              error={!!errors['description']}
              helperText={errors['description']}
            />
          </Grid>

          {/* Channel ID Field */}
          <Grid item xs={6}>
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel shrink={true} sx={{
                  color: errors['channelID'] ? theme.palette.error.main : '#1976d2',
                  backgroundColor: 'white',
                  px: 1,
              }}>
                Channel ID
              </InputLabel>
              <Select
                value={channelID || ''}
                onChange={(e) => handleInputChange('channelID', Number(e.target.value))}
                label="Channel ID"
                sx={{ backgroundColor: 'white', borderColor: '#1976d2' }}
                error={!!errors['channelID']}
              >
                {channelIDOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="body2" color="error">
                {errors['channelID']}
              </Typography>
            </FormControl>
          </Grid>

          {/* Token Identity Params Field */}
          <Grid item xs={6}>
            <TextField
              label="Token Identity Params"
              value={tokenIdentityParams}
              onChange={(e) => handleInputChange('tokenIdentityParams', e.target.value)}
              fullWidth
              margin="dense"
              required
              InputLabelProps={{ shrink: true, sx: { color: '#1976d2' } }}
              InputProps={{
                sx: {
                  backgroundColor: 'white',
                  borderColor: '#1976d2',
                },
              }}
              variant="outlined"
              error={!!errors['tokenIdentityParams']}
              helperText={errors['tokenIdentityParams']}
            />
          </Grid>

          {/* Expire Time Field */}
          <Grid item xs={6}>
            <TextField
              label="Expire Time (Minutes)"
              type="number"
              value={expireTimeMinute ?? ''}
              onChange={(e) => handleInputChange('expireTimeMinute', Number(e.target.value))}
              fullWidth
              margin="dense"
              required
              InputLabelProps={{ shrink: true, sx: { color: '#1976d2' } }}
              InputProps={{
                sx: {
                  backgroundColor: 'white',
                  borderColor: '#1976d2',
                },
              }}
              variant="outlined"
              error={!!errors['expireTimeMinute']}
              helperText={errors['expireTimeMinute']}
            />
          </Grid>

          {/* Check Verify Try Count Field */}
          <Grid item xs={6}>
            <TextField
              label="Check Verify Try Count"
              type="number"
              value={checkVerifyTryCount ?? ''}
              onChange={(e) => handleInputChange('checkVerifyTryCount', Number(e.target.value))}
              fullWidth
              margin="dense"
              required
              InputLabelProps={{ shrink: true, sx: { color: '#1976d2' } }}
              InputProps={{
                sx: {
                  backgroundColor: 'white',
                  borderColor: '#1976d2',
                },
              }}
              variant="outlined"
              error={!!errors['checkVerifyTryCount']}
              helperText={errors['checkVerifyTryCount']}
            />
          </Grid>

          {/* Generate Limit Quantity Field */}
          <Grid item xs={6}>
            <TextField
              label="Generate Limit Quantity"
              type="number"
              value={generateLimitQuantity ?? ''}
              onChange={(e) => handleInputChange('generateLimitQuantity', Number(e.target.value))}
              fullWidth
              margin="dense"
              required
              InputLabelProps={{ shrink: true, sx: { color: '#1976d2' } }}
              InputProps={{
                sx: {
                  backgroundColor: 'white',
                  borderColor: '#1976d2',
                },
              }}
              variant="outlined"
              error={!!errors['generateLimitQuantity']}
              helperText={errors['generateLimitQuantity']}
            />
          </Grid>

          {/* Generate Limit Time Field */}
          <Grid item xs={6}>
            <TextField
              label="Generate Limit Time (Minutes)"
              type="number"
              value={generateLimitTimeMinute ?? ''}
              onChange={(e) => handleInputChange('generateLimitTimeMinute', Number(e.target.value))}
              fullWidth
              margin="dense"
              required
              InputLabelProps={{ shrink: true, sx: { color: '#1976d2' } }}
              InputProps={{
                sx: {
                  backgroundColor: 'white',
                  borderColor: '#1976d2',
                },
              }}
              variant="outlined"
              error={!!errors['generateLimitTimeMinute']}
              helperText={errors['generateLimitTimeMinute']}
            />
          </Grid>

          {/* Send SMS Checkbox */}
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  color="primary"
                  sx={{ color: '#1976d2' }}
                />
              }
              label="Send SMS"
              sx={{ marginTop: 1 }}
            />
          </Grid>

          {/* SMS Product ID Field */}
          <Grid item xs={6}>
            <TextField
              label="SMS Product ID"
              type="number"
              value={smsProductID ?? ''}
              onChange={(e) => handleInputChange('smsProductID', Number(e.target.value))}
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true, sx: { color: '#1976d2' } }}
              InputProps={{
                sx: {
                  backgroundColor: 'white',
                  borderColor: '#1976d2',
                },
              }}
              variant="outlined"
              error={!!errors['smsProductID']}
              helperText={errors['smsProductID']}
            />
          </Grid>

          {/* Token Length Field */}
          <Grid item xs={6}>
            <TextField
              label="Token Length"
              type="number"
              value={tokenLength ?? ''}
              onChange={(e) => handleInputChange('tokenLength', Number(e.target.value))}
              fullWidth
              margin="dense"
              required
              InputLabelProps={{ shrink: true, sx: { color: '#1976d2' } }}
              InputProps={{
                sx: {
                  backgroundColor: 'white',
                  borderColor: '#1976d2',
                },
              }}
              variant="outlined"
              error={!!errors['tokenLength']}
              helperText={errors['tokenLength']}
            />
          </Grid>

          {/* Generate Limit Without Quantity Time Field */}
          <Grid item xs={6}>
            <TextField
              label="Generate Limit Without Quantity Time (Seconds)"
              type="number"
              value={generateLimitWithoutQuantityTimeSecond ?? ''}
              onChange={(e) =>
                handleInputChange('generateLimitWithoutQuantityTimeSecond', Number(e.target.value))
              }
              fullWidth
              margin="dense"
              required
              InputLabelProps={{ shrink: true, sx: { color: '#1976d2' } }}
              InputProps={{
                sx: {
                  backgroundColor: 'white',
                  borderColor: '#1976d2',
                },
              }}
              variant="outlined"
              error={!!errors['generateLimitWithoutQuantityTimeSecond']}
              helperText={errors['generateLimitWithoutQuantityTimeSecond']}
            />
          </Grid>

          {/* Token String Type ID Field */}
          <Grid item xs={6}>
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel shrink sx={{
                color: errors['tokenStringTypeID'] ? theme.palette.error.main : '#1976d2',
                  backgroundColor: 'white',
                  px: 1,}}>
                Token String Type ID
              </InputLabel>
              <Select
                value={type}
                onChange={handleTypeChange}
                label="Token String Type ID"
                required
                sx={{ backgroundColor: 'white', borderColor: '#1976d2' }}
                error={!!errors['tokenStringTypeID']}
              >
                {tokenStringTypeIDOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="body2" color="error">
                {errors['tokenStringTypeID']}
              </Typography>
            </FormControl>
          </Grid>

          {/* SMS Template Field */}
          <Grid item xs={12}>
            <TextField
              label="SMS Template"
              value={smsTemplate}
              onChange={(e) => handleInputChange('smsTemplate', e.target.value)}
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true, sx: { color: '#1976d2' } }}
              InputProps={{
                sx: {
                  backgroundColor: 'white',
                  borderColor: '#1976d2',
                },
              }}
              variant="outlined"
              error={!!errors['smsTemplate']}
              helperText={errors['smsTemplate']}
            />
          </Grid>

          {/* Error Message Display */}
          {/* {error && (
            <Grid item xs={12}>
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            </Grid>
          )} */}
        </Grid>
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
