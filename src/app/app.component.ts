import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {UserListComponent} from './components/user-list/user-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [ RouterLink, UserListComponent],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public router: Router) {}
}
