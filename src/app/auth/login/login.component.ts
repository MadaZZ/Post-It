import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading = false;
  constructor() { }

  ngOnInit() {
  }
  onLogin(form: NgForm){
    const creds = {
      email: form.value.email,
      password: form.value.password
    };
    debugger;
  }

}
