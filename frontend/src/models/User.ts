import { MasonDoc } from './MasonDoc';

export interface User extends MasonDoc {
  username: string,
  email_address: string,
  role: UserType
}

export enum UserType {
  ADMIN = 'Admin',
  BASIC_USER = 'Basic User'
}
