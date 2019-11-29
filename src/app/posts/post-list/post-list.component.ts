import { Component, OnInit } from '@angular/core';
import { Post } from '../posts.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  // posts = [
  //   {title: 'Hello Header q1', content: 'Dummy content Dummy content Dummy content Dummy content Dummy content'},
  //   {title: 'Hello Header q2', content: 'Dummy content Dummy content Dummy content Dummy content Dummy content'},
  //   {title: 'Hello Header q3', content: 'Dummy content Dummy content Dummy content Dummy content Dummy content'},
  //   {title: 'Hello Header q4', content: 'Dummy content Dummy content Dummy content Dummy content Dummy content'},
  //   {title: 'Hello Header q5', content: 'Dummy content Dummy content Dummy content Dummy content Dummy content'}
  // ];
  posts: Post[] = [];
  constructor( private postsService: PostsService ) { }

  ngOnInit() {
    this.posts = this.postsService.getPosts();
  }

}
