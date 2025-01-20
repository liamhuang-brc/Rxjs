import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="comparison-container" [@fadeIn]>
      <h2>Observables vs Signals</h2>
      
      <div class="comparison-grid">
        <div class="feature-card">
          <h3>Push vs Pull</h3>
          <div class="comparison">
            <div class="side">
              <h4>Observables (Push)</h4>
              <p>Data is pushed to consumers when available</p>
            </div>
            <div class="side">
              <h4>Signals (Pull)</h4>
              <p>Data is pulled by consumers when needed</p>
            </div>
          </div>
        </div>

        <div class="feature-card">
          <h3>Execution Model</h3>
          <div class="comparison">
            <div class="side">
              <h4>Observables</h4>
              <p>Lazy evaluation, needs subscription</p>
            </div>
            <div class="side">
              <h4>Signals</h4>
              <p>Eager evaluation, automatic dependency tracking</p>
            </div>
          </div>
        </div>

        <div class="feature-card">
          <h3>Use Cases</h3>
          <div class="comparison">
            <div class="side">
              <h4>Observables</h4>
              <ul>
                <li>Async operations</li>
                <li>Event handling</li>
                <li>Complex data streams</li>
              </ul>
            </div>
            <div class="side">
              <h4>Signals</h4>
              <ul>
                <li>UI state management</li>
                <li>Derived values</li>
                <li>Simple reactive state</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .comparison-container {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 2rem;
    }

    .comparison-grid {
      display: grid;
      gap: 2rem;
    }

    .feature-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      transition: transform 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .comparison {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 1rem;
    }

    .side {
      padding: 1rem;
      background: white;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    h3 {
      color: #3498db;
      margin-bottom: 1rem;
    }

    h4 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
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
      content: "•";
      position: absolute;
      left: 0.5rem;
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
export class ComparisonComponent {} 