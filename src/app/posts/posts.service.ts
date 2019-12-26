import { Injectable } from '@angular/core';
import { Post } from './posts.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
    .pipe(
      map((postData) => {
      return {
        posts: postData.posts.map((post) => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }), maxPosts: postData.maxPosts
    };
    }))
    .subscribe((postsDataPiped) => {
      this.posts = postsDataPiped.posts;
      this.postsUpdated.next({posts: [...this.posts], postCount: postsDataPiped.maxPosts});
      this.router.navigate(['/']);
    });
  }

  getPostById( id: string ) {
    // return { ...this.posts.find( p => p.id === id )};
    return this.http.get<{message: string, postFound: Post}>('http://localhost:3000/api/posts/' + id);
  }

  getPostUpdateListener() {
   return this.postsUpdated.asObservable();
  }

  addPost(titleIn: string, contentIn: string, imageIn: File) {
    const postData = new FormData();
    postData.append('title', titleIn);
    postData.append('content', contentIn);
    postData.append('image', imageIn, titleIn);
    this.http
      .post<{ message: string, postedResult: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
    });
  }

  updatePost(idIn: string, titleIn: string, contentIn: string, imageIn: File | string) {
    let postData: Post | FormData;
    if (typeof imageIn === 'object') {
      postData = new FormData();
      postData.append('id', idIn);
      postData.append('title', titleIn);
      postData.append('content', contentIn);
      postData.append('image', imageIn, titleIn);
    } else {
      postData = {
        id: idIn,
        title: titleIn,
        content: contentIn,
        imagePath: imageIn
      };
    }
    this.http.put('http://localhost:3000/api/posts/' + idIn, postData)
    .subscribe((response) => {
      this.router.navigate(['/']);
    });
  }

  deletePost(id: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + id);
    // .subscribe(() => {
    //   const updatedPost = this.posts.filter(post => post.id !== id);
    //   this.posts = updatedPost;
    //   this.postsUpdated.next([...this.posts]);
    // });
  }
}
