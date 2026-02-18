import { Component } from '@angular/core';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent {
  users: User[] = [
    { id: 1, username: 'john_doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, username: 'bob_wilson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
    { id: 4, username: 'alice_jones', email: 'alice@example.com', role: 'Moderator', status: 'Active' },
    { id: 5, username: 'charlie_brown', email: 'charlie@example.com', role: 'User', status: 'Pending' }
  ];

  searchTerm = '';

  get filteredUsers(): User[] {
    if (!this.searchTerm) return this.users;
    return this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Active': return 'bg-success';
      case 'Inactive': return 'bg-secondary';
      case 'Pending': return 'bg-warning text-dark';
      default: return 'bg-primary';
    }
  }
}
