import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../posts.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  private posts: Post[] = [];
  private postSubs: Subscription;
  constructor( private postsService: PostsService ) { }

  ngOnInit() {
    this.posts = this.postsService.getPosts();
    this.postSubs = this.postsService.getPostUpdateListener().subscribe( (posts: Post[]) => {
      this.posts = posts;
    });
  }
  ngOnDestroy(): void {
    this.postSubs.unsubscribe();
  }

}
