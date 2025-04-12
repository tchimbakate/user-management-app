import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf, NgClass } from '@angular/common';
import { DatePipe } from '@angular/common';
import { of, Subject } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { Modal } from 'bootstrap';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceMock: any;
  let mockUsers = [
    { id: '1', name: 'John Doe', role: 'Admin', enabled: true, createdAt: new Date() },
    { id: '2', name: 'Jane Smith', role: 'Editor', enabled: false, createdAt: new Date() }
  ];

  beforeEach(waitForAsync(() => {
    userServiceMock = jasmine.createSpyObj('UserService', [
      'getUsers',
      'addUser',
      'updateUser',
      'deleteUser'
    ]);
    userServiceMock.getUsers.and.returnValue(of(mockUsers));

    TestBed.configureTestingModule({
      imports: [FormsModule, NgIf, NgForOf, NgClass, DatePipe, UserListComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(userServiceMock.getUsers).toHaveBeenCalled();
    expect(component.filteredUsers.length).toBe(2);
    expect(component.hasUsers).toBeTrue();
  });

  it('should apply filter based on search term', fakeAsync(() => {
    component.searchTerm = 'john';
    component.onSearchInput();
    tick(300); // debounce time
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('John Doe');
  }));

  it('should sort users by column', () => {
    component.sort('name');
    expect(component.sortColumn).toBe('name');
    expect(component.sortDirection).toBe('asc');
    expect(component.filteredUsers[0].name).toBe('Jane Smith');

    component.sort('name');
    expect(component.sortDirection).toBe('desc');
    expect(component.filteredUsers[0].name).toBe('John Doe');
  });

  it('should open add user modal', async () => {
    spyOn(component, 'openAddUserModal').and.callThrough();
    await component.openAddUserModal();
    expect(component.newUser).toEqual({ name: '', role: '', enabled: true });
  });

  it('should open edit user modal ', async () => {
    spyOn(component, 'openEditUserModal').and.callThrough();
    await component.openEditUserModal(mockUsers[0]);
    expect(component.editedUser).toEqual(mockUsers[0]);
  });

  it('should add a new user', () => {
    userServiceMock.addUser.and.returnValue(Promise.resolve());
    component.newUser = { name: 'New User', role: 'Viewer', enabled: true };
    component.onAddUserSubmit();
    expect(userServiceMock.addUser).toHaveBeenCalledWith(component.newUser);
  });

  it('should update a user', () => {
    userServiceMock.updateUser.and.returnValue(Promise.resolve());
    component.editedUser = { ...mockUsers[0], name: 'Updated Name' };
    component.onEditUserSubmit();
    expect(userServiceMock.updateUser).toHaveBeenCalledWith(component.editedUser.id, component.editedUser);
  });

  it('should toggle user status', () => {
    userServiceMock.updateUser.and.returnValue(Promise.resolve());
    component.toggleUserStatus(mockUsers[0]);
    expect(userServiceMock.updateUser).toHaveBeenCalledWith('1', { enabled: false });
  });

  it('should delete a user after confirmation', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    userServiceMock.deleteUser.and.returnValue(Promise.resolve());
    await component.deleteUser(mockUsers[0]);
    expect(userServiceMock.deleteUser).toHaveBeenCalledWith('1');
  });

  it('should not delete a user if not confirmed', async () => {
    spyOn(window, 'confirm').and.returnValue(false);
    await component.deleteUser(mockUsers[0]);
    expect(userServiceMock.deleteUser).not.toHaveBeenCalled();
  });

  it('should handle empty user list', () => {
    userServiceMock.getUsers.and.returnValue(of([]));
    component.loadUsers();
    expect(component.hasUsers).toBeFalse();
    expect(component.filteredUsers.length).toBe(0);
  });

  it('should handle search with empty term', fakeAsync(() => {
    component.searchTerm = '';
    component.onSearchInput();
    tick(300);
    expect(component.filteredUsers.length).toBe(2);
  }));

});
