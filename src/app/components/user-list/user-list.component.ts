import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { UserService } from '../../services/user.service';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, take, debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgForOf,
    NgClass,
    DatePipe,
  ],
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @ViewChild('addUserModal') addUserModalEl!: ElementRef;
  @ViewChild('editUserModal') editUserModalEl!: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;

  users$: Observable<any[]> | undefined;
  searchTerm: string = '';
  filteredUsers: any[] = [];
  newUser: any = {
    name: '',
    role: '',
    enabled: true
  };
  editedUser: any = {
    id: '',
    name: '',
    role: '',
    enabled: true
  };
  public addUserModal: any;
  public editUserModal: any;
  private searchSubject = new Subject<string>();
  hasUsers: boolean = false;
  sortColumn: string = 'name';
  sortDirection: string = 'asc';

  constructor(
      private userService: UserService,
      @Inject(PLATFORM_ID) private platformId: Object,
      private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
    ).subscribe(() => {
      this.applyFilter();
    });
  }

  loadUsers(): void {
    this.users$ = this.userService.getUsers();
    this.users$.subscribe(users => {
      this.filteredUsers = [...users];
      this.hasUsers = this.filteredUsers.length > 0;
      this.sort(this.sortColumn);
    });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  async openAddUserModal(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const { Modal } = await import('bootstrap');
      this.newUser = { name: '', role: '', enabled: true };
      this.addUserModal = new Modal(this.addUserModalEl.nativeElement);
      this.addUserModal.show();
    }
  }

  async openEditUserModal(user: any, event?: MouseEvent): Promise<void> {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (isPlatformBrowser(this.platformId)) {
      const { Modal } = await import('bootstrap');
      this.editedUser = { ...user };
      this.editUserModal = new Modal(this.editUserModalEl.nativeElement);
      this.editUserModal.show();
    }
    this.closeDropdown();
  }

  onAddUserSubmit(): void {
    this.userService.addUser(this.newUser)
        .then(() => {
          if (this.addUserModal) {
            this.addUserModal.hide();
          }
          this.newUser = { name: '', role: '', enabled: true };
          this.loadUsers();
        })
        .catch(err => console.error('Error adding user:', err));
  }

  onEditUserSubmit(): void {
    this.userService.updateUser(this.editedUser.id, this.editedUser)
        .then(() => {
          if (this.editUserModal) {
            this.editUserModal.hide();
          }
          this.loadUsers();
        })
        .catch(err => console.error('Error updating user:', err));
  }

  toggleUserStatus(user: any): void {
    const updatedStatus = !user.enabled;
    this.userService.updateUser(user.id, { enabled: updatedStatus })
        .then(() => this.loadUsers())
        .catch((err: any) => console.error('Error updating user status:', err));
  }

  async deleteUser(user: any, event?: MouseEvent): Promise<void> {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await this.userService.deleteUser(user.id);
      this.loadUsers();
      alert(`User "${user.name}" deleted successfully`);
    } catch (err) {
      console.error('Error deleting user:', err);
      const errorMessage = (err instanceof Error ? err.message : 'Unknown error') || 'Failed to delete user';
      alert(errorMessage);
    }
    this.closeDropdown();
  }

  applyFilter(): void {
    this.users$?.pipe(take(1)).subscribe(users => {
      if (!this.searchTerm) {
        this.filteredUsers = [...users];
        this.hasUsers = this.filteredUsers.length > 0;
        this.sort(this.sortColumn);
        return;
      }

      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = users.filter(user =>
          user.name.toLowerCase().includes(term) ||
          (user.role && user.role.toLowerCase().includes(term))
      );
      this.hasUsers = this.filteredUsers.length > 0 || !!this.searchTerm;
      this.sort(this.sortColumn);
    });
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredUsers.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  closeDropdown(): void {
    if (this.dropdownMenu) {
      this.renderer.removeClass(this.dropdownMenu.nativeElement, 'show');
    }
  }
}