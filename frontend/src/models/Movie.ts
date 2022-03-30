import { MasonDoc } from './MasonDoc';

export interface Movie extends MasonDoc {
  id: number,
  title: string,
  director: string
  length: number,
  release_date: string,
  category_id: number
}
