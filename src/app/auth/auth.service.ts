import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;

  constructor(private http: HttpClient) { }

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
      });
  }

  getToken() {
    return this.token;
  }

}
