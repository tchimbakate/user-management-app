import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';  // <-- Add this import
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import {UserListComponent} from "./components/user-list/user-list.component";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        UserListComponent,
    ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-angular-firebase-app';

  constructor() {
    AngularFireModule.initializeApp(environment.firebaseConfig);
  }
}
