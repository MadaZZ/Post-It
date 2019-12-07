import { Injectable } from '@angular/core';
import { Post } from './posts.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { post } from 'selenium-webdriver/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient) { }

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map((post) => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    }))
    .subscribe((postsDataPiped) => {
      this.posts = postsDataPiped;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostById( id: string ) {
    return { ...this.posts.find( p => p.id === id )};
  }

  getPostUpdateListener() {
   return this.postsUpdated.asObservable();
  }

  addPost(titleIn: string, contentIn: string) {
    const post: Post = { id: null, title: titleIn, content: contentIn };
    this.http.post<{message: string, postedResult: any}>('http://localhost:3000/api/posts', post)
    .subscribe((response) => {
      post.id = response.postedResult._id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }

  updatePost(idIn: string, titleIn: string, contentIn: string) {
    const post: Post = { id: idIn, title: titleIn, content: contentIn };
    this.http.put('http://localhost:3000/api/posts/' + idIn, post)
    .subscribe((response) => {
      // post.id = response.postedResult._id;
      // this.posts.push(post);
      // this.postsUpdated.next([...this.posts]);
      console.log(response);
    });
  }

  deletePost(id: string) {
    this.http.delete('http://localhost:3000/api/posts/' + id)
    .subscribe(() => {
      const updatedPost = this.posts.filter(post => post.id !== id);
      this.posts = updatedPost;
      this.postsUpdated.next([...this.posts]);
    });
  }
}
