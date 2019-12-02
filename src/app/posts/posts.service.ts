import { Injectable } from '@angular/core';
import { Post } from './posts.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor() { }

  getPosts() {
    return [...this.posts];
  }

  getPostUpdateListener() {
   return this.postsUpdated.asObservable();
  }

  addPost(titleIn: string, contentIn: string) {
    const post: Post = { title: titleIn, content: contentIn };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
