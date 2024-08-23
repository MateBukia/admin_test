export interface RowData {
    id: number;
    name: string;
    channelID: number;
    tokenIdentityParams: string;
    expireTimeMinute: number;
    checkVerifyTryCount: number;
    generateLimitQuantity: number;
    generateLimitTimeMinute: number;
    isSendSms: boolean;
    smsProductID: number;
    tokenLength: number;
    generateLimitWithoutQuantityTimeSecond: number;
    tokenStringTypeID: number;
    smsTemplate: string;
    [key: string]: any;
  }