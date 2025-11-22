import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessCodeService {
  private readonly STORAGE_KEY = 'accessCode';

  constructor() { }

  setAccessCode(code: string): void {
    localStorage.setItem(this.STORAGE_KEY, code);
  }

  getAccessCode(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  clearAccessCode(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    const code = this.getAccessCode();
    return code === environment.accessCode;
  }
}
