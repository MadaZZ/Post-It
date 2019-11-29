import { Injectable } from '@angular/core';
import { Post } from './posts.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[];
  constructor() { }

  getPosts() {
    return [...this.posts];
  }
  addPost(titleIn: string, contentIn: string) {
    const post: Post = { title: titleIn, content: contentIn };
    this.posts.push(post);
  }
}
