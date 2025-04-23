export type ConfigType = {
  id: string;
  identityProvider: IdentityProvider;
  msDynamics: MsDynamics;
  details: ConfigDetails;
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
  url: string;
  redirectUri: string;
};
