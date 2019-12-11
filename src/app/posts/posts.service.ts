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
  private postsUpdated = new Subject<Post[]>();
  
  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts'+queryParams)
    .pipe(map((postData) => {
      return postData.posts.map((post) => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
        };
      });
    }))
    .subscribe((postsDataPiped) => {
      this.posts = postsDataPiped;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
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
    var postData = new FormData();
    postData.append("title", titleIn);
    postData.append("content", contentIn);
    postData.append("image", imageIn, titleIn);
    this.http
      .post<{ message: string, postedResult: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((response) => {
        const post: Post = {id: response.postedResult.id, title: titleIn, content: contentIn, imagePath: response.postedResult.imagePath};
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  updatePost(idIn: string, titleIn: string, contentIn: string, imageIn: File | string) {
    let postData: Post | FormData;
    if (typeof imageIn === 'object') {
      postData = new FormData();
      postData.append("id", idIn);
      postData.append("title", titleIn);
      postData.append("content", contentIn);
      postData.append("image", imageIn, titleIn);
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
      this.router.navigate(["/"]);
      // post.id = response.postedResult._id;
      // this.posts.push(post);
      // this.postsUpdated.next([...this.posts]);
      // console.log(response);
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
