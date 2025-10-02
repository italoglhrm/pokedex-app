import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <h2>Pokédex Digital</h2>
        <p class="subtitle">Acesse sua conta e explore Pokémons!</p>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <input
              type="text"
              placeholder="Usuário"
              formControlName="username"
            />
          </div>

          <div class="form-group">
            <input
              type="password"
              placeholder="Senha"
              formControlName="password"
            />
          </div>

          <button type="submit" [disabled]="loading() || form.invalid">
            {{ loading() ? 'Entrando...' : 'Entrar' }}
          </button>

          <div class="error" *ngIf="error()">{{ error() }}</div>
        </form>
      </div>
    </div>
  `,
  styles: [`
  .login-wrapper {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('/assets/bg-login.jpg') no-repeat center center;
    background-size: cover;
  }

  .login-card {
    background: rgba(255, 255, 255, 0.92);
    padding: 32px;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 380px;
    text-align: center;
  }

  h2 {
    font-family: 'Roboto', sans-serif;
    margin-top: 8px;
    margin-bottom: 8px;
    font-size: 1.8rem;
    color: #2c3e50;
    font-weight: 700;
  }

  .subtitle {
    font-family: 'Roboto', sans-serif
    margin-bottom: 24px;
    font-size: 0.95rem;
    color: #2c3e50;
    font-weight: 400;
  }

  .form-group {
    margin-bottom: 18px;
    display: flex;
    justify-content: center;
  }

  input {
    width: 100%;
    max-width: 300px;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-family: 'Roboto', sans-serif;
    font-size: 1rem;
    outline: none;
    transition: border 0.2s;
    text-align: left;
  }

  input:focus {
    border-color: #1976d2;
  }

  button {
    width: 100%;
    max-width: 300px;
    padding: 12px;
    border: none;
    border-radius: 8px;
    background: #1976d2;
    color: #fff;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
    margin-bottom: 8px;
  }

  button:hover:not(:disabled) {
    background: #1565c0;
  }

  button:disabled {
    background: #bbb;
    cursor: not-allowed;
  }

  .error {
    margin-top: 12px;
    color: #c00;
    font-size: 0.9rem;
  }
`],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  async submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);

    try {
      const { username, password } = this.form.value;
      await this.auth.login(username!, password!);
      this.router.navigateByUrl('/pokedex'); 
    } catch {
      this.error.set('Usuário ou senha inválidos.');
    } finally {
      this.loading.set(false);
    }
  }
}