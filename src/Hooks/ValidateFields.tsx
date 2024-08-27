import { RowData } from "../Types/RowDataType";

    const validateFields = (key: keyof RowData, value: any): string | null => {
        switch (key) {
          case 'tokenLength':
            if (value === undefined || value === null || value < 1) {
              return 'Token length must be at least 1';
            }
            if (!Number.isInteger(value)) {
              return 'Token length must be an integer';
            }
            break;
          case 'name':
            if (value.trim() === '') {
                return 'Name is required';
              }
              break;
          case 'tokenIdentityParams':
            if (value === '') {
              return 'Token Identity Params is required';
            }
            break;
          case 'channelID':
            if (value === undefined || value === null) {
              return 'Channel ID is required';
            }
            break;
          case 'expireTimeMinute':
            if (value === undefined || value === null) {
              return 'Expire Time (Minutes) is required';
            }
            break;
          case 'checkVerifyTryCount':
            if (value === undefined || value === null) {
              return 'Check Verify Try Count is required';
            }
            break;
          case 'generateLimitQuantity':
            if (value === undefined || value === null) {
              return 'Generate Limit Quantity is required';
            }
            break;
          case 'generateLimitTimeMinute':
            if (value === undefined || value === null) {
              return 'Generate Limit Time (Minutes) is required';
            }
            break;
          case 'smsProductID':
            if (value === undefined || value === null) {
              return 'SMS Product ID is required';
            }
            break;
          case 'generateLimitWithoutQuantityTimeSecond':
            if (value === undefined || value === null) {
              return 'Generate Limit Without Quantity Time (Seconds) is required';
            }
            break;
          case 'type':
            if (value === '') {
              return 'Token String Type ID is required';
            }
            break;
          case 'smsTemplate':
            if (value === '') {
              return 'SMS Template is required';
            }
            if (!value.includes('{{otpCode}}')) {
                return 'SMS Template must contain "{{otpCode}}"';
              }
              break;
          case 'tokenStringTypeID':
            if (value === undefined || value === null) {
              return 'TokenStringTypeID is required';
            }
            break;
          default:
            return null;
        }
        return null;
      };
export default validateFields;