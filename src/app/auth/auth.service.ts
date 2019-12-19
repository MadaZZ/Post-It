import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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
}
