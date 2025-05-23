export type EventType = {
  existsInWebhook: boolean;
  configId?: string | null;
  dynamicsEvent?: string | null;
  memberCategoryField?: string | null;
  memberStatusField?: string | null;
  id: string;
  name: string;
};
