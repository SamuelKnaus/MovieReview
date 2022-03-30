import { MasonDoc } from './MasonDoc';

export interface Collection<T> extends MasonDoc {
   items: T[]
}
