import { BehaviorSubject, combineLatestWith, map } from 'rxjs';

export interface IPost {
    userId: number;
    id: number;
    title: string;
    body: string;
    selected?: boolean;
}

const postsList$ = new BehaviorSubject<IPost[]>([]);
export const selected$ = new BehaviorSubject<number[]>([]);
export const posts$ = postsList$.pipe(
    combineLatestWith(selected$),
    map(([post, selected]) =>
        post.map((p) => ({
            ...p,
            selected: selected.includes(p.id),
        }))
    )
);

fetch('https://jsonplaceholder.typicode.com/posts')
    .then((res) => res.json())
    .then((data) => postsList$.next(data));
