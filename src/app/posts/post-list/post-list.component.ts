import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material';

import { Post } from '../posts.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  public posts: Post[] = [];
  private postSubs: Subscription;
  public isLoading = false;
  public paginationParams = {
    totalPosts: 10,
    postsPerPage: 2,
    currentPage: 1,
    postsPerPageOptions: [1, 2, 5, 10],
  }
  constructor( private postsService: PostsService, private router: Router ) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.paginationParams.postsPerPage, this.paginationParams.currentPage);
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

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.paginationParams.postsPerPage = pageData.pageSize;
    this.paginationParams.currentPage = pageData.pageIndex + 1;
    this.postsService.getPosts(this.paginationParams.postsPerPage, this.paginationParams.currentPage);    
  }
}
