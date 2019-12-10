import { Component, OnInit, EventEmitter } from '@angular/core';
import { Post } from '../posts.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';

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
  public imgPreview: any;
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
      'image': new FormControl(null,
        {
          validators: [Validators.required],
          asyncValidators: [mimeType]
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
            image: this.editPost.imagePath
          })
        });
      } else {
        this.mode = 'create';
        this.postID = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.myForm.patchValue({image: file});
    this.myForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onAddPost() {
    const title = this.myForm.value.title;
    const content = this.myForm.value.content;
    const image = this.myForm.value.image;
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(title, content, image);
    } else {
      this.postsService.updatePost(this.postID, title, content, image);
    }
    this.myForm.reset();
  }
}
