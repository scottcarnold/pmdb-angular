export class LocalStorageConfig {
  key: string;                       // used by local storage service; does not need to be explicitly set
  sessionScope: boolean = true;      // if true, stored data will expire if user logs out or another user logs in
  expireTimeMinutes: number = 20;    // if > 0, stored data will expire after set number of minutes
  lastStoreTime: number;             // used by local storage service
}
