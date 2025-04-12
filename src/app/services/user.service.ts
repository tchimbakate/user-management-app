import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  updateDoc,
  Timestamp
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: string;
  name: string;
  role: string;
  createdAt: Date;
  enabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore = inject(Firestore);
  private functions = inject(Functions);

  getUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'id' }).pipe(
      map(users => users.map((user: any) => ({
        id: user.id,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt?.toDate() || user.createdAt,
        enabled: user.enabled !== undefined ? user.enabled : true
      })))
    );
  }

  addUser(user: Omit<User, 'id'>): Promise<any> {
    const usersRef = collection(this.firestore, 'users');
    return addDoc(usersRef, {
      ...user,
      createdAt: Timestamp.now(),
      enabled: true
    });
  }

  updateUser(id: string, user: Partial<User>): Promise<void> {
    const userDoc = doc(this.firestore, `users/${id}`);
    return updateDoc(userDoc, user);
  }

  async deleteUser(userId: string): Promise<void> {
    const deleteUserCallable = httpsCallable<{ userId: string }, { success: boolean }>(
      this.functions,
      'deleteUser'
    );
    try {
      const result = await deleteUserCallable({ userId });
      if (!result.data.success) {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Cloud Function error:', error);
      if (error instanceof Error && 'code' in error) {
        switch (error.code) {
          case 'invalid-argument':
            throw new Error('Invalid user ID');
          case 'internal':
            throw new Error('Server error occurred');
          default:
            throw new Error('Failed to delete user');
        }
      }
      throw error;
    }
  }
}
