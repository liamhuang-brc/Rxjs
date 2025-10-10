import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { signal, computed } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

interface Data {
  id: number;
  name: string;
}

@Component({
  selector: 'app-code-examples',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="container">
      <h2>Angular Code Examples</h2>

      <div class="example-section">
        <h3>Component State Management</h3>
        <div class="code-box">
          <h4>Using Signals</h4>
          <pre><code>{{ counterExample }}</code></pre>
        </div>
      </div>

      <div class="example-section">
        <h3>Data Fetching</h3>
        <div class="code-box">
          <h4>Using RxJS</h4>
          <pre><code>{{ dataServiceExample }}</code></pre>
        </div>
      </div>

      <div class="example-section">
        <h3>Form Handling</h3>
        <div class="code-box">
          <h4>Reactive Forms with Signals</h4>
          <pre><code>{{ formExample }}</code></pre>
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

    .example-section {
      margin: 2rem 0;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h3 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }

    h4 {
      color: #34495e;
      margin: 1rem 0;
    }

    .code-box {
      background: #f8f9fa;
      border-radius: 4px;
      padding: 1rem;
    }

    pre {
      background: #2c3e50;
      color: white;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0;
    }

    code {
      font-family: 'Fira Code', monospace;
      white-space: pre-wrap;
    }
  `]
})
export class CodeExamplesComponent {
  counterExample = `
@Component({
  template: \`
    <div>
      <p>Count: {{ count() }}</p>
      <p>Double: {{ double() }}</p>
      <button (click)="increment()">Increment</button>
    </div>
  \`
})
export class CounterComponent {
  count = signal(0);
  double = computed(() => this.count() * 2);

  increment() {
    this.count.update(n => n + 1);
  }
}`;

  dataServiceExample = `
@Injectable()
export class DataService {
  private dataSubject = new BehaviorSubject<Data[]>([]);
  data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchData() {
    return this.http.get<Data[]>('/api/data').pipe(
      tap(data => this.dataSubject.next(data))
    );
  }
}`;

  formExample = `
@Component({
  template: \`
    <form [formGroup]="form">
      <input formControlName="name">
      <p>Valid: {{ isValid() }}</p>
      <p>Errors: {{ errors() | json }}</p>
    </form>
  \`
})
export class FormComponent {
  form = new FormGroup({
    name: new FormControl('')
  });

  isValid = computed(() => this.form.valid);
  errors = computed(() => this.form.errors);
}`;
} 