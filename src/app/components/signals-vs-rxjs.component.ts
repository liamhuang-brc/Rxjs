import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Renderer from '@angular/core';

@Component({
  selector: 'app-signals-vs-rxjs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Signals vs RxJS Comparison</h2>

      <div class="comparison-section">
        <div class="feature-card">
          <h3>Signals</h3>
          <ul>
            <li>Simple state management</li>
            <li>Synchronous by default</li>
            <li>Automatic dependency tracking</li>
            <li>Built into Angular</li>
            <li>Perfect for UI state</li>
          </ul>
          <div class="code-example">
            <pre>
const count = signal(0);
const double = computed(() => count() * 2);

// Update
count.set(5);</pre>
          </div>
        </div>

        <div class="feature-card">
          <h3>RxJS</h3>
          <ul>
            <li>Complex data streams</li>
            <li>Asynchronous operations</li>
            <li>Rich operator ecosystem</li>
            <li>Event handling</li>
            <li>Data transformation</li>
          </ul>
          <div class="code-example">
            <pre>
const count$ = new BehaviorSubject(0);
const double$ = count$.pipe(
  map(value => value * 2)
);

// Update
count$.next(5);</pre>
          </div>
        </div>
      </div>

      <div class="use-cases">
        <h3>When to Use What?</h3>
        <div class="use-case-grid">
          <div class="use-case">
            <h4>Use Signals For:</h4>
            <ul>
              <li>Component state</li>
              <li>Derived values</li>
              <li>Template bindings</li>
              <li>Simple reactivity</li>
            </ul>
          </div>
          <div class="use-case">
            <h4>Use RxJS For:</h4>
            <ul>
              <li>HTTP requests</li>
              <li>WebSocket connections</li>
              <li>Complex event handling</li>
              <li>Advanced data streams</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .comparison-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin: 2rem 0;
    }

    .feature-card {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .code-example {
      margin-top: 1rem;
      background: #2c3e50;
      padding: 1rem;
      border-radius: 4px;
    }

    pre {
      color: white;
      margin: 0;
      overflow-x: auto;
    }

    .use-cases {
      margin-top: 3rem;
    }

    .use-case-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 1rem;
    }

    .use-case {
      padding: 1.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    ul {
      list-style-type: none;
      padding: 0;
    }

    li {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
    }

    li:before {
      content: "•";
      color: #3498db;
      position: absolute;
      left: 0;
    }
  `]
})
export class SignalsVsRxJSComponent {
  constructor(private renderer: Renderer2) {
    // Ensure Renderer2 is properly imported
  }
} 