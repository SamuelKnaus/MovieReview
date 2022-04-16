export interface MasonDoc {
    '@controls': MasonControls
 }

export type MasonControls = {
   'moviereviewmeta:add-category'?: MasonControl,
   'moviereviewmeta:categories-all'?: MasonControl,
   'moviereviewmeta:add-movie'?: MasonControl,
   'moviereviewmeta:movies-all'?: MasonControl,
   'moviereviewmeta:add-user'?: MasonControl,
   'moviereviewmeta:users-all'?: MasonControl,
   'moviereviewmeta:add-review'?: MasonControl,
   'moviereviewmeta:reviews-for-movie'?: MasonControl,
   'moviereviewmeta:reviews-of-user'?: MasonControl,
   'moviereviewmeta:delete'?: MasonControl,
   'moviereviewmeta:current-user'?: MasonControl,
   'moviereviewmeta:login'?: MasonControl,
   'self'?: MasonControl,
   'up'?: MasonControl,
   'edit'?: MasonControl,
   'collection'?: MasonControl,
 }

export type MasonControl = {
    title: string,
    href: string,
    encoding?: string,
    method?: string,
    schema?: any
 }
