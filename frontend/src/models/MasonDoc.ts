export interface MasonDoc {
    '@controls': Controls
 }

 type Controls = {
    'moviereviewmeta:add-category'?: Control,
    'moviereviewmeta:categories-all'?: Control,
    'moviereviewmeta:add-movie'?: Control,
    'moviereviewmeta:movies-all'?: Control,
    'moviereviewmeta:add-user'?: Control,
    'moviereviewmeta:users-all'?: Control,
    'moviereviewmeta:add-review'?: Control,
    'moviereviewmeta:reviews-for-movie'?: Control,
    'moviereviewmeta:reviews-of-user'?: Control,
    'moviereviewmeta:delete'?: Control,
    'self'?: Control,
    'up'?: Control,
    'item'?: Control,
    'collection'?: Control,
 }

 type Control = {
    encoding: string,
    href: string,
    method: string,
    schema: any,
    title: string
 }
