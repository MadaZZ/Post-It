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
  private loginSessionTimer;

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
      .post<{ token: string, expiresIn: number }>('http://localhost:3000/api/user/login', creds)
      .subscribe((response) => {
        this.token = response.token;
        const expTimeLimit = response.expiresIn;
        if (this.token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expTimeLimit * 1000);
          this.saveAuthData(this.token, expirationDate);
          this.setAuthTimer(expTimeLimit * 1000);
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
    clearTimeout(this.loginSessionTimer);
    this.clearAuthData();
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn);
      this.authStatusListener.next(true);
    }
  }

  private saveAuthData(tokenIn: string, expTimeStamp: Date) {
    localStorage.setItem('token', tokenIn);
    localStorage.setItem('expiration', expTimeStamp.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const tokenOut = localStorage.getItem('token');
    const expDate = localStorage.getItem('expiration');
    if (!tokenOut || !expDate) {
      return;
    }
    return {
      token: tokenOut,
      expirationDate: new Date(expDate)
    };
  }

  private setAuthTimer( duration: number) {
      this.loginSessionTimer = setTimeout(() => {
          this.logout();
      }, duration);
  }

}
