import { Component, OnInit, EventEmitter } from '@angular/core';
import { Post } from '../posts.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredContent = '';
  enteredTitle = '';
  constructor(private postsService: PostsService) { }

  ngOnInit() {
  }

  onAddPost(form: NgForm) {
    const title = form.value.title;
    const content = form.value.content;
    this.postsService.addPost(title, content);
    form.resetForm();
  }
}
