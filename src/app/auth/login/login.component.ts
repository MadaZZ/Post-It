import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private authSub: Subscription;

  isLoading = false;
  constructor( private authService: AuthService ) { }

  ngOnInit() {
    this.authSub = this.authService.getAuthStatusListner().subscribe(result => {
      this.isLoading = false;
    });
  }
  onLogin(form: NgForm) {
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
