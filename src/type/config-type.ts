export type ConfigType = {
  id: string;
  identityProvider: IdentityProvider;
  msDynamics: MsDynamics;
  details: ConfigDetails;
  statusAndTransactionCodes: StatusAndTransactionCodes;
};

type IdentityProvider = {
  clientId: string;
  clientSecret: string;
  scope: string;
  authorizationUrl: string;
  accessTokenUrl: string;
  userInfoUrl: string;
};

type MsDynamics = {
  domainName: string;
  apiVersion: string;
  tenantId: string;
  applicationId: string;
  secret: string;
};

type ConfigDetails = {
  appName: string;
  alias: string;
};

export type StatusAndTransactionCodes = {
  delegateConfirmed: ConfigTypeWithCode;
  delegateProvisional: ConfigTypeWithCode;
  delegateWaitList: ConfigTypeWithCode;
  invoice: ConfigTypeWithCode;
  creditNote: ConfigTypeWithCode;
  paymentSource: ConfigTypeWithCode;
  paymentType: ConfigTypeWithCode;
  refundType: ConfigTypeWithCode;
  paymentStatus: ConfigTypeWithCode;
};

export type ConfigTypeWithCode = {
  type: "status" | "transaction";
  code: number;
};
