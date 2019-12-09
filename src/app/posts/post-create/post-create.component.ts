import { Component, OnInit, EventEmitter } from '@angular/core';
import { Post } from '../posts.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  public isLoading = false;
  myForm: FormGroup;

  constructor(private postsService: PostsService, public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.myForm = new FormGroup({
      'title': new FormControl(null,
        {
          validators: [Validators.required, Validators.minLength(3)]
        }),
      'content': new FormControl(null,
        {
          validators: [Validators.required]
        }),
    });
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postID = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPostById(this.postID).subscribe((response) => {
          this.isLoading = false;
          this.editPost = response.postFound;
          this.myForm.setValue({
            title: this.editPost.title,
            content: this.editPost.content,
          })
        });
      } else {
        this.mode = 'create';
        this.postID = null;
      }
    });
  }


  onAddPost( ) {
    const title = this.myForm.value.title;
    const content = this.myForm.value.content;
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(title, content);
    } else {
      this.postsService.updatePost(this.postID, title, content);
    }
    this.myForm.reset();
  }
}
