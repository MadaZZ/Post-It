import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../posts.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  public posts: Post[] = [];
  private postSubs: Subscription;
  public isLoading = false;
  constructor( private postsService: PostsService, private router: Router ) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postSubs = this.postsService.getPostUpdateListener().subscribe( (posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
  }
  ngOnDestroy(): void {
    this.postSubs.unsubscribe();
  }
  onDelete(id: string) {
    this.postsService.deletePost(id);
  }

  onEdit(id: string) {
    const Path = '/edit/' + id;
    this.router.navigate([Path]);
  }
}
