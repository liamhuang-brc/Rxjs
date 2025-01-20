import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-container">
      <header>
        <h1>RxJS & Signals Learning Hub</h1>
        <nav class="navigation">
          <ul>
            <li>
              <a routerLink="/intro" routerLinkActive="active">
                <span class="icon">📚</span>
                Introduction
              </a>
            </li>
            <li>
              <a routerLink="/rxjs-tutorial" routerLinkActive="active">
                <span class="icon">🎓</span>
                RxJS Tutorial
              </a>
            </li>
            <li>
              <a routerLink="/observable-vs-subject" routerLinkActive="active">
                <span class="icon">🔄</span>
                Observable vs Subject
              </a>
            </li>
            <li>
              <a routerLink="/observer-pattern" routerLinkActive="active">
                <span class="icon">👀</span>
                Observer Pattern
              </a>
            </li>
            <li>
              <a routerLink="/observable-demo" routerLinkActive="active">
                <span class="icon">🛠️</span>
                Observable Operations
              </a>
            </li>
            <li>
              <a routerLink="/signals-tutorial" routerLinkActive="active">
                <span class="icon">✨</span>
                Signals Tutorial
              </a>
            </li>
            <li>
              <a routerLink="/signals-deep-dive" routerLinkActive="active">
                <span class="icon">🔍</span>
                Signals Deep Dive
              </a>
            </li>
            <li>
              <a routerLink="/signals-vs-rxjs" routerLinkActive="active">
                <span class="icon">⚖️</span>
                Signals vs RxJS
              </a>
            </li>
            <li>
              <a routerLink="/signals-animated" routerLinkActive="active">
                <span class="icon">✨</span>
                Animated Signals
              </a>
            </li>
            <li>
              <a routerLink="/code-examples" routerLinkActive="active">
                <span class="icon">💻</span>
                Code Examples
              </a>
            </li>
          </ul>
        </nav>
      </header>
      
      <main [@routeAnimations]="getRouteState()">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    header {
      margin-bottom: 2rem;
      text-align: center;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      font-size: 2.5rem;
      font-weight: bold;
    }

    .navigation {
      background: white;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .navigation ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }

    .navigation a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #34495e;
      text-decoration: none;
      font-size: 1rem;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      background-color: #f8f9fa;
    }

    .navigation a:hover {
      background-color: #e9ecef;
      transform: translateY(-2px);
    }

    .navigation a.active {
      background-color: #3498db;
      color: white;
      box-shadow: 0 2px 4px rgba(52, 152, 219, 0.3);
    }

    .icon {
      font-size: 1.2rem;
    }

    main {
      position: relative;
      min-height: 400px;
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    @media (max-width: 768px) {
      .navigation ul {
        flex-direction: column;
        align-items: stretch;
      }

      .navigation a {
        justify-content: center;
      }

      h1 {
        font-size: 2rem;
      }
    }
  `],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AppComponent {
  getRouteState() {
    return window.location.pathname;
  }
}