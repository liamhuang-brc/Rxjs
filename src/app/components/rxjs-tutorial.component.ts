import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rxjs-tutorial',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tutorial-container">
      <h2>Understanding RxJS and Reactive Programming</h2>

      <div class="section">
        <h3>What is Reactive Programming?</h3>
        <div class="content">
          <p>Reactive programming is a programming paradigm that deals with:</p>
          <ul>
            <li>Asynchronous data streams</li>
            <li>Data flow propagation</li>
            <li>Automatic updates when data changes</li>
          </ul>
          <div class="example-box">
            Think of it like a spreadsheet:
            <code>
              Cell C = Cell A + Cell B
              When A or B changes, C updates automatically
            </code>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>RxJS Core Concepts</h3>
        <div class="concept-grid">
          <div class="concept-card">
            <h4>Observable</h4>
            <p>A stream of values over time</p>
            <div class="visual">
              ----1----2----3----4-->
            </div>
          </div>
          <div class="concept-card">
            <h4>Observer</h4>
            <p>Consumes values from Observable</p>
            <div class="code-example">
              observable.subscribe(value => console.log(value))
            </div>
          </div>
          <div class="concept-card">
            <h4>Operators</h4>
            <p>Transform values in the stream</p>
            <div class="code-example">
              observable.pipe(map(x => x * 2))
            </div>
          </div>
          <div class="concept-card">
            <h4>Subscription</h4>
            <p>Connects Observable to Observer</p>
            <div class="code-example">
              const subscription = observable.subscribe()
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Common Use Cases</h3>
        <div class="use-cases">
          <div class="use-case">
            <h4>Event Handling</h4>
            <code>fromEvent(button, 'click')</code>
          </div>
          <div class="use-case">
            <h4>HTTP Requests</h4>
            <code>http.get('/api/data')</code>
          </div>
          <div class="use-case">
            <h4>Form Values</h4>
            <code>form.valueChanges</code>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tutorial-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .section {
      margin: 3rem 0;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .concept-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin: 2rem 0;
    }

    .concept-card {
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #3498db;
    }

    .visual {
      font-family: monospace;
      padding: 1rem;
      background: #34495e;
      color: white;
      border-radius: 4px;
      margin-top: 1rem;
    }

    .code-example {
      font-family: monospace;
      padding: 1rem;
      background: #34495e;
      color: white;
      border-radius: 4px;
      margin-top: 1rem;
    }

    .use-cases {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .use-case {
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #2ecc71;
    }

    code {
      display: block;
      padding: 1rem;
      background: #34495e;
      color: white;
      border-radius: 4px;
      margin-top: 0.5rem;
    }
  `]
})
export class RxJSTutorialComponent {} 