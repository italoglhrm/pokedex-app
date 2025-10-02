import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Me {
  id: number;
  username: string;
  email: string;
  nome: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  user = signal<Me | null>(null);

  async login(username: string, password: string) {
    await firstValueFrom(
      this.http.post('/api/auth/login/', { username, password }, { withCredentials: true })
    );
    await this.fetchMe();
  }

  async logout() {
    await firstValueFrom(this.http.post('/api/auth/logout/', {}, { withCredentials: true }));
    this.user.set(null);
  }

  async refresh() {
    await firstValueFrom(this.http.post('/api/auth/refresh/', {}, { withCredentials: true }));
  }

  async fetchMe() {
    const me = await firstValueFrom(
      this.http.get<Me>('/api/auth/me/', { withCredentials: true })
    );
    this.user.set(me);
    return me;
  }

  isAuthenticated() {
    return !!this.user();
  }
}