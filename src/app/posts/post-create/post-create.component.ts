import { Component, OnInit, EventEmitter } from '@angular/core';
import { Post } from '../posts.model';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredContent = '';
  enteredTitle = '';
  public editPost: Post;
  private mode = 'create';
  private postID: string;

  constructor(private postsService: PostsService, public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postID = paramMap.get('postId');
        this.editPost = this.postsService.getPostById(this.postID);
      } else {
        this.mode = 'create';
        this.postID = null;
        this.editPost = { id: '', title: '', content: '' };
      }
    });
  }

  onAddPost(form: NgForm) {
    const title = form.value.title;
    const content = form.value.content;
    if (this.mode === 'create') {
      this.postsService.addPost(title, content);
    } else {
      this.postsService.updatePost(this.postID, title, content);
    }
    form.resetForm();
  }
}
