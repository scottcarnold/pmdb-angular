import { User }  from './user';

export interface AuthData {
  user: User;
  xAuthToken: string;
}
