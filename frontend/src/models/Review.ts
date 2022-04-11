import { MasonDoc } from './MasonDoc';

export interface Review extends MasonDoc {
    id: number
    rating: number
    comment: string
    date: string
    author: string,
    movie_id: number
}
