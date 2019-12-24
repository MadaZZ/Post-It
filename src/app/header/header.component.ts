import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  private isAuthenticated = false;
  constructor( private authService: AuthService ) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListner().subscribe( (result) => {
      this.isAuthenticated = result;
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}
