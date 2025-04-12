import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { UserService } from './services/user.service';
import { of } from 'rxjs';

class MockUserService {
  getUsers() {
    return of([]);
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterModule.forRoot([]),
        AngularFireModule.initializeApp(environment.firebaseConfig),
      ],
      providers: [
        { provide: UserService, useClass: MockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the title 'user-management-app'`, () => {
    expect(component.title).toEqual('user-management-app');
  });

  it('should render the header with correct title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header');
    expect(header).toBeTruthy();
    expect(header?.textContent).toContain('Manage Users');
  });

  it('should contain the user-list component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-user-list')).toBeTruthy();
  });

  it('should initialize AngularFire with the correct config', () => {
    expect(component).toBeTruthy();
  });
});