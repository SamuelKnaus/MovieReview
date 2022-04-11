import { MasonDoc } from './MasonDoc';

export interface User extends MasonDoc {
  username: string,
  email_address: string,
  role: string
}
