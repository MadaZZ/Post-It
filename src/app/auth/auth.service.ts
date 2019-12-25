import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated;
  constructor(private http: HttpClient, private router: Router) { }

  createUser(emailIn: string, passwordIn: string) {
    const creds: AuthData = {
      email: emailIn,
      password: passwordIn
    };
    this.http
      .post<{ message: string }>('http://localhost:3000/api/user/signup', creds)
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(emailIn: string, passwordIn: string) {
    const creds: AuthData = {
      email: emailIn,
      password: passwordIn
    };
    this.http
      .post<{ token: string }>('http://localhost:3000/api/user/login', creds)
      .subscribe((response) => {
        this.token = response.token;
        if (this.token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListner() {
    return this.authStatusListener.asObservable();
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
  }

}
