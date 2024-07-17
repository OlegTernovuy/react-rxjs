import { BehaviorSubject, combineLatestWith, map } from 'rxjs';
import { useObservableState } from 'observable-hooks';
import { useMemo } from 'react';

import { posts$, selected$ } from '../apiStore';

const Posts = () => {
    const search$ = useMemo(() => new BehaviorSubject(''), []);

    const [filterPosts] = useObservableState(
        () =>
            posts$.pipe(
                combineLatestWith(search$),
                map(([post, search]) =>
                    post.filter((p) =>
                        p.title.toLowerCase().includes(search.toLowerCase())
                    )
                )
            ),
        []
    );

    return (
        <div>
            <input
                type="text"
                value={search$.value}
                onChange={(e) => search$.next(e.target.value)}
            />
            <ul>
                {filterPosts &&
                    filterPosts.map((post) => (
                        <li key={post.id}>
                            <input
                                type="checkbox"
                                checked={post.selected}
                                onChange={() => {
                                    if (selected$.value.includes(post.id)) {
                                        selected$.next(
                                            selected$.value.filter(
                                                (id) => id !== post.id
                                            )
                                        );
                                    } else {
                                        selected$.next([
                                            ...selected$.value,
                                            post.id,
                                        ]);
                                    }
                                }}
                            />
                            {post.title}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default Posts;
