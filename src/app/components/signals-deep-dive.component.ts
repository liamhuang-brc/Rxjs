import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal, computed, effect, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface Stock {
  symbol: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-signals-deep-dive',
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'translateY(10px)' })),
      transition(':enter', [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('highlight', [
      state('active', style({ backgroundColor: '#4CAF50', color: 'white' })),
      state('inactive', style({ backgroundColor: 'transparent' })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ])
  ],
  template: `
    <div class="container">
      <h2>Understanding Angular Signals</h2>
      
      <div class="intro">
        <p>Signals are a new way to handle reactivity in Angular. They provide a more direct and efficient way to manage state and updates.</p>
      </div>

      <div class="demo-section">
        <h3>1. Basic Signals</h3>
        <div class="explanation">
          <p>A signal is a wrapper around a value that can notify interested consumers when that value changes.</p>
        </div>
        <div class="demo-box">
          <div class="controls">
            <button (click)="increment()">+</button>
            <span class="value">{{ count() }}</span>
            <button (click)="decrement()">-</button>
          </div>
          <div class="code-preview">
            <pre><code>{{ basicSignalsCode }}</code></pre>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h3>2. Computed Signals</h3>
        <div class="explanation">
          <p>Computed signals automatically derive their value from other signals. They update automatically when their dependencies change.</p>
        </div>
        <div class="demo-box">
          <div class="output">
            <p>Count: {{ count() }}</p>
            <p>Doubled: {{ doubled() }}</p>
            <p>Is Even: {{ isEven() }}</p>
          </div>
          <div class="code-preview">
            <pre><code>{{ computedSignalsCode }}</code></pre>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h3>3. Signal Effects</h3>
        <div class="explanation">
          <p>Effects run side effects whenever their dependent signals change. They're perfect for synchronizing signals with external systems.</p>
        </div>
        <div class="demo-box">
          <div class="output">
            <p>Last Change: {{ lastChange() }}</p>
            <p>Total Updates: {{ updateCount() }}</p>
          </div>
          <div class="code-preview">
            <pre><code>{{ effectsCode }}</code></pre>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h3>4. Signal Collections</h3>
        <div class="explanation">
          <p>Signals can hold any type of value, including arrays and objects. Updates are made immutably.</p>
        </div>
        <div class="demo-box">
          <div class="controls">
            <input #todoInput placeholder="Add todo">
            <button (click)="addTodo(todoInput.value); todoInput.value = ''">Add</button>
          </div>
          <div class="output">
            <p>Todos ({{ todoCount() }}):</p>
            <ul>
              <li *ngFor="let todo of todos()" [@fadeInOut]>
                {{ todo }}
                <button class="remove" (click)="removeTodo(todo)">✕</button>
              </li>
            </ul>
          </div>
          <div class="code-preview">
            <pre><code>{{ collectionsCode }}</code></pre>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h3>5. Real-World Example: Stock Portfolio</h3>
        <div class="explanation">
          <p>This example demonstrates how signals can be used in a real-world scenario to track stock portfolio performance.</p>
        </div>
        <div class="demo-box">
          <div class="portfolio-summary">
            <div class="summary-card" [class.profit]="totalReturn() > 0" [class.loss]="totalReturn() < 0">
              <h4>Portfolio Value</h4>
              <p class="value">{{ portfolioValue() | currency:'USD':'symbol':'1.2-2' }}</p>
              <p class="return" [@highlight]="totalReturn() > 0 ? 'active' : 'inactive'">
                {{ totalReturn() > 0 ? '▲' : '▼' }} {{ totalReturn() | number:'1.2-2' }}%
              </p>
            </div>
          </div>
          
          <div class="stock-list">
            <div class="stock-controls">
              <input #stockSymbol placeholder="Stock Symbol" class="stock-input">
              <input #stockPrice type="number" placeholder="Price" class="stock-input">
              <input #stockQuantity type="number" placeholder="Quantity" class="stock-input">
              <button (click)="addStock(
                stockSymbol.value, 
                +stockPrice.value, 
                +stockQuantity.value
              ); stockSymbol.value = ''; stockPrice.value = ''; stockQuantity.value = ''">
                Add Stock
              </button>
            </div>
            
            <div class="stocks">
              <div *ngFor="let stock of stocks()" class="stock-item" [@fadeInOut]>
                <div class="stock-info">
                  <h4>{{ stock.symbol }}</h4>
                  <p>Quantity: {{ stock.quantity }}</p>
                </div>
                <div class="stock-price">
                  <p>{{ stock.price | currency:'USD':'symbol':'1.2-2' }}</p>
                  <button class="update-price" (click)="simulatePriceChange(stock.symbol)">
                    Update Price
                  </button>
                </div>
                <button class="remove" (click)="removeStock(stock.symbol)">✕</button>
              </div>
            </div>
            
            <div class="code-preview">
              <pre><code>{{ portfolioCode }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .intro {
      background: #e3f2fd;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .demo-section {
      margin: 2rem 0;
      padding: 1.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .explanation {
      margin: 1rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-left: 4px solid #3498db;
      border-radius: 4px;
    }

    .demo-box {
      margin: 1rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .value {
      font-size: 1.5rem;
      font-weight: bold;
      min-width: 3rem;
      text-align: center;
    }

    .code-preview {
      margin-top: 1rem;
      background: #2c3e50;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
    }

    pre {
      margin: 0;
      color: white;
    }

    button {
      padding: 0.5rem 1rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button:hover {
      background: #2980b9;
    }

    button.remove {
      background: #e74c3c;
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
    }

    button.remove:hover {
      background: #c0392b;
    }

    .stock-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .stock-input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      flex: 1;
    }

    .stock-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: white;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .stock-info {
      flex: 1;
    }

    .stock-price {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .portfolio-summary {
      margin-bottom: 2rem;
    }

    .summary-card {
      padding: 1.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }

    .summary-card.profit {
      background: #e8f5e9;
    }

    .summary-card.loss {
      background: #ffebee;
    }

    .return {
      font-weight: bold;
      margin: 0;
    }

    .patterns-list {
      list-style-type: none;
      padding: 0;
    }

    .patterns-list li {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
    }

    .patterns-list li:before {
      content: "→";
      position: absolute;
      left: 0;
      color: #3498db;
    }

    @media (max-width: 600px) {
      .stock-controls {
        flex-direction: column;
      }

      .stock-item {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .stock-price {
        flex-direction: column;
      }
    }
  `]
})
export class SignalsDeepDiveComponent {
  // Basic Signals
  count = signal(0);
  basicSignalsCode = `
  count = signal(0);

  increment() {
    this.count.update(n => n + 1);
  }

  decrement() {
    this.count.update(n => n - 1);
  }`;

  // Computed Signals
  doubled = computed(() => this.count() * 2);
  isEven = computed(() => this.count() % 2 === 0);
  computedSignalsCode = `
  doubled = computed(() => this.count() * 2);
  isEven = computed(() => this.count() % 2 === 0);`;

  // Effects
  lastChange = signal(new Date().toLocaleTimeString());
  updateCount = signal(0);
  effectsCode = `
  constructor() {
    effect(() => {
      // Runs whenever count changes
      this.lastChange.set(new Date().toLocaleTimeString());
      this.updateCount.update(n => n + 1);
    });
  }`;

  constructor() {
    effect(() => {
      // Track changes to count
      this.count();
      this.lastChange.set(new Date().toLocaleTimeString());
      this.updateCount.update(n => n + 1);
    });
  }

  // Collections
  todos = signal<string[]>([]);
  todoCount = computed(() => this.todos().length);
  collectionsCode = `
  todos = signal<string[]>([]);
  todoCount = computed(() => this.todos().length);

  addTodo(todo: string) {
    this.todos.update(todos => [...todos, todo]);
  }

  removeTodo(todo: string) {
    this.todos.update(todos => 
      todos.filter(t => t !== todo)
    );
  }`;

  // Stock Portfolio
  stocks = signal<Stock[]>([]);
  portfolioValue = computed(() => 
    this.stocks().reduce((sum, stock) => 
      sum + (stock.price * stock.quantity), 0)
  );
  totalReturn = computed(() => {
    const initial = this.stocks().reduce((sum, stock) => 
      sum + (stock.price * stock.quantity), 0);
    return initial === 0 ? 0 : ((initial - 1000) / 1000) * 100;
  });

  portfolioCode = `
  interface Stock {
    symbol: string;
    price: number;
    quantity: number;
  }

  stocks = signal<Stock[]>([]);
  portfolioValue = computed(() => 
    this.stocks().reduce((sum, stock) => 
      sum + (stock.price * stock.quantity), 0)
  );

  addStock(symbol: string, price: number, quantity: number) {
    this.stocks.update(stocks => [...stocks, { symbol, price, quantity }]);
  }

  removeStock(symbol: string) {
    this.stocks.update(stocks => stocks.filter(s => s.symbol !== symbol));
  }

  simulatePriceChange(symbol: string) {
    this.stocks.update(stocks => 
      stocks.map(stock => 
        stock.symbol === symbol
          ? { ...stock, price: stock.price * (1 + (Math.random() * 0.2 - 0.1)) }
          : stock
      )
    );
  }`;

  // Methods
  increment() {
    this.count.update(n => n + 1);
  }

  decrement() {
    this.count.update(n => n - 1);
  }

  addTodo(todo: string) {
    if (todo.trim()) {
      this.todos.update(todos => [...todos, todo.trim()]);
    }
  }

  removeTodo(todo: string) {
    this.todos.update(todos => todos.filter(t => t !== todo));
  }

  addStock(symbol: string, price: number, quantity: number) {
    if (symbol && price && quantity) {
      this.stocks.update(stocks => [...stocks, { symbol, price, quantity }]);
    }
  }

  removeStock(symbol: string) {
    this.stocks.update(stocks => stocks.filter(s => s.symbol !== symbol));
  }

  simulatePriceChange(symbol: string) {
    this.stocks.update(stocks => 
      stocks.map(stock => 
        stock.symbol === symbol
          ? { ...stock, price: stock.price * (1 + (Math.random() * 0.2 - 0.1)) }
          : stock
      )
    );
  }
} 