import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="intro-container" [@fadeIn]>
      <h1>Understanding Observables and Signals in Angular</h1>
      <div class="content">
        <section>
          <h2>RxJS Observables</h2>
          <p>Observables are push-based data streams that can emit multiple values over time.</p>
          <ul>
            <li>Multicasting capabilities</li>
            <li>Rich operator ecosystem</li>
            <li>Lazy evaluation</li>
          </ul>
        </section>

        <section>
          <h2>Angular Signals</h2>
          <p>Signals are reactive primitives that hold values and notify dependents when those values change.</p>
          <ul>
            <li>Fine-grained reactivity</li>
            <li>Synchronous by default</li>
            <li>Simpler mental model</li>
          </ul>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .intro-container {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h1 {
      color: #2c3e50;
      text-align: center;
      margin-bottom: 2rem;
    }

    .content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    section {
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
      transition: transform 0.3s;
    }

    section:hover {
      transform: translateY(-5px);
    }

    h2 {
      color: #34495e;
      margin-bottom: 1rem;
    }

    ul {
      list-style-type: none;
      padding-left: 0;
    }

    li {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
    }

    li:before {
      content: "→";
      position: absolute;
      left: 0;
      color: #3498db;
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class IntroComponent {} 