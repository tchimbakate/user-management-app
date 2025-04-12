import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import {UserListComponent} from './components/user-list/user-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [ NgIf, RouterLink, UserListComponent], // Importing necessary modules
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public router: Router) {}
}
