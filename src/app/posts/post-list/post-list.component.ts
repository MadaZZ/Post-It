import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material';

import { Post } from '../posts.model';
import { PostsService } from '../posts.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  public posts: Post[] = [];
  private postSubs: Subscription;
  private authStatusSub: Subscription;
  public isAuthenticated = false;
  public isLoading = false;
  public paginationParams = {
    totalPosts: 0,
    postsPerPage: 2,
    currentPage: 1,
    postsPerPageOptions: [1, 2, 5, 10],
  };
  public userId: string;

  constructor( private postsService: PostsService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.paginationParams.postsPerPage, this.paginationParams.currentPage);
    this.postSubs = this.postsService.getPostUpdateListener().subscribe( ( postsData: {posts: Post[], postCount: number} ) => {
      this.isLoading = false;
      this.posts = postsData.posts;
      this.paginationParams.totalPosts = postsData.postCount;
    });
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService.getAuthStatusListner().subscribe( (result) => {
      this.isAuthenticated = result;
      this.userId = this.authService.getUserId();
    });
  }
  ngOnDestroy(): void {
    this.postSubs.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
  onDelete(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.paginationParams.postsPerPage, this.paginationParams.currentPage);
    });
  }

  onEdit(id: string) {
    const Path = '/edit/' + id;
    this.router.navigate([Path]);
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.paginationParams.postsPerPage = pageData.pageSize;
    this.paginationParams.currentPage = pageData.pageIndex + 1;
    this.postsService.getPosts(this.paginationParams.postsPerPage, this.paginationParams.currentPage);    
  }
}
