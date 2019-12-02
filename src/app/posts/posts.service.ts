import { Injectable } from '@angular/core';
import { Post } from './posts.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient) { }

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts').subscribe((postsData) => {
      this.posts = postsData.posts;
      this.postsUpdated.next([...this.posts]);
    });
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
