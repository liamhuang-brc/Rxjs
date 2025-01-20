import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal, computed, effect } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-signal-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container" [@fadeIn]>
      <h2>Signal Reactivity Visualization</h2>
      
      <div class="visualization-container">
        <!-- Source Signal -->
        <div class="signal-box">
          <div class="signal-label">Source Signal</div>
          <div class="signal-value" [@valueChange]="counter()">
            {{ counter() }}
          </div>
        </div>

        <!-- Dependency Arrows -->
        <div class="dependency-arrows">
          <div class="arrow left"></div>
          <div class="arrow right"></div>
        </div>

        <!-- Computed Values -->
        <div class="computed-signals">
          <div class="signal-box">
            <div class="signal-label">Doubled</div>
            <div class="computed-value" [@valueChange]="doubledValue()">
              {{ doubledValue() }}
            </div>
          </div>
          <div class="signal-box">
            <div class="signal-label">Is Even</div>
            <div class="computed-value" [class.true]="isEven()" [@valueChange]="isEven()">
              {{ isEven() ? 'Yes' : 'No' }}
            </div>
          </div>
        </div>
      </div>

      <div class="controls">
        <button (click)="increment()" class="increment">
          <i class="fas fa-plus"></i>
        </button>
        <button (click)="decrement()" class="decrement">
          <i class="fas fa-minus"></i>
        </button>
        <button (click)="reset()" class="reset">
          <i class="fas fa-undo"></i>
        </button>
      </div>

      <div class="updates-panel">
        <h3>Signal Updates Log</h3>
        <div class="updates-list">
          <div *ngFor="let update of updates()" 
               class="update-item" 
               [@updateAnimation]>
            <span class="timestamp">{{ update.timestamp | date:'HH:mm:ss' }}</span>
            <span class="message">{{ update.message }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .visualization-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 8px;
      margin: 2rem 0;
    }

    .signal-box {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
      min-width: 150px;
    }

    .signal-label {
      font-size: 0.9rem;
      color: #7f8c8d;
      margin-bottom: 0.5rem;
    }

    .signal-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: #3498db;
    }

    .computed-value {
      font-size: 2rem;
      color: #2ecc71;
      &.true {
        color: #27ae60;
      }
    }

    .dependency-arrows {
      display: flex;
      justify-content: space-between;
      width: 100%;
      position: relative;
    }

    .arrow {
      width: 40%;
      height: 2px;
      background: #34495e;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        right: -5px;
        top: -4px;
        width: 0;
        height: 0;
        border-left: 6px solid #34495e;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
      }
    }

    .computed-signals {
      display: flex;
      gap: 2rem;
    }

    .updates-panel {
      margin-top: 2rem;
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
    }

    .update-item {
      display: flex;
      gap: 1rem;
      align-items: center;
      .timestamp {
        color: #7f8c8d;
        font-size: 0.9rem;
      }
      .message {
        color: #2c3e50;
      }
    }

    .controls {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin: 1rem 0;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      background: #3498db;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover {
      background: #2980b9;
    }

    .info {
      margin-top: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .updates-list {
      max-height: 200px;
      overflow-y: auto;
    }

    .update-item {
      padding: 0.5rem;
      margin: 0.5rem 0;
      background: white;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('valueChange', [
      transition('* => *', [
        style({ transform: 'scale(1.2)', color: '#3498db' }),
        animate('300ms ease-out', style({ transform: 'scale(1)', color: '#2c3e50' }))
      ])
    ]),
    trigger('updateAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class SignalDemoComponent {
  counter = signal(0);
  updates = signal<Array<{timestamp: Date, message: string}>>([]);
  
  doubledValue = computed(() => this.counter() * 2);
  isEven = computed(() => this.counter() % 2 === 0);

  constructor() {
    effect(() => {
      const value = this.counter();
      this.logUpdate(`Counter changed to: ${value}`);
    });
  }

  increment() {
    this.counter.update(value => value + 1);
  }

  decrement() {
    this.counter.update(value => value - 1);
  }

  reset() {
    this.counter.set(0);
  }

  private logUpdate(message: string) {
    this.updates.update(updates => [
      { timestamp: new Date(), message },
      ...updates
    ].slice(0, 5));
  }
} 