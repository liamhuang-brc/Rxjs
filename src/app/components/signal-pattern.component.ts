import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger, state } from '@angular/animations';

@Component({
  selector: 'app-signal-pattern',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container" [@fadeIn]>
      <h2>Understanding Signals & Reactivity</h2>

      <div class="explanation-panel">
        <h3>How Angular Signals Work:</h3>
        <div class="step-explanation">
          <div class="step">
            <span class="step-number">1</span>
            <div class="step-content">
              <h4>Source Signal</h4>
              <p>A writable signal that holds a value and can be updated using:</p>
              <ul>
                <li><code>set(newValue)</code> - Directly set a new value</li>
                <li><code>update(fn)</code> - Update based on current value</li>
                <li><code>mutate(fn)</code> - Mutate the current value</li>
              </ul>
            </div>
          </div>
          
          <div class="step">
            <span class="step-number">2</span>
            <div class="step-content">
              <h4>Computed Signals</h4>
              <p>Derived values that automatically update when their dependencies change:</p>
              <ul>
                <li>Read-only signals</li>
                <li>Calculated from other signals</li>
                <li>Updates automatically</li>
              </ul>
            </div>
          </div>

          <div class="step">
            <span class="step-number">3</span>
            <div class="step-content">
              <h4>Effects</h4>
              <p>Side effects that run automatically when signals change:</p>
              <ul>
                <li>Perfect for DOM updates</li>
                <li>Logging changes</li>
                <li>Integration with external systems</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="visualization-container">
        <!-- Source Signal -->
        <div class="signal-box primary" [class.updating]="isUpdating">
          <div class="title">Source Signal</div>
          <div class="role-description">
            "I am the source of truth"
          </div>
          <div class="value-display">
            count() = {{ count() }}
          </div>
          <div class="controls">
            <button class="action-button increment" (click)="increment()">
              <span class="icon">+</span> Increment
            </button>
            <button class="action-button decrement" (click)="decrement()">
              <span class="icon">-</span> Decrement
            </button>
          </div>
        </div>

        <!-- Dependency Arrows with Labels -->
        <div class="dependency-arrows">
          <div class="arrow-container">
            <div class="arrow-line" [class.active]="isUpdating">
              <div class="arrow"></div>
            </div>
            <div class="dependency-label">Depends On</div>
          </div>
        </div>

        <!-- Computed and Effects Section -->
        <div class="computed-section">
          <div class="signal-box computed" [class.updating]="isUpdating">
            <div class="title">Computed Signal</div>
            <div class="role-description">
              "I update automatically when count changes"
            </div>
            <div class="computation-formula">
              doubled = count × 2
            </div>
            <div class="value-display">
              doubled() = {{ doubled() }}
            </div>
          </div>

          <div class="signal-box effect" [class.updating]="isUpdating">
            <div class="title">Effect</div>
            <div class="role-description">
              "I execute side effects on every change"
            </div>
            <div class="effect-details">
              <div class="effect-trigger">Triggered by: count()</div>
              <div class="effect-action">Action: Log & Update Time</div>
            </div>
            <div class="value-display">
              Last Run: {{ lastEffectRun }}
            </div>
          </div>
        </div>
      </div>

      <div class="updates-panel">
        <div class="updates-header">
          <h3>Signal Updates Timeline</h3>
          <div class="legend">
            <span class="legend-item source">Source Updates</span>
            <span class="legend-item computed">Computed Updates</span>
            <span class="legend-item effect">Effect Runs</span>
          </div>
        </div>
        <div class="updates-log">
          <div *ngFor="let update of updates()" 
               class="update-entry"
               [class.source]="update.type === 'source'"
               [class.computed]="update.type === 'computed'"
               [class.effect]="update.type === 'effect'"
               [@logEntry]>
            <span class="timestamp">{{ update.timestamp | date:'HH:mm:ss' }}</span>
            <span class="update-type">{{ update.type }}</span>
            <span class="message">{{ update.message }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .visualization-container {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 2rem;
      align-items: center;
      margin: 2rem 0;
    }

    .signal-box {
      padding: 1.5rem;
      border-radius: 8px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: all 0.3s;
    }

    .signal-box.primary {
      background: #3498db;
      color: white;
    }

    .signal-box.computed {
      background: #2ecc71;
      color: white;
    }

    .signal-box.effect {
      background: #9b59b6;
      color: white;
      margin-top: 1rem;
    }

    .updating {
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(52, 152, 219, 0.3);
    }

    .value-display {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 1rem 0;
      font-family: monospace;
    }

    .dependency-arrows {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .arrow-line {
      width: 100px;
      height: 2px;
      background: #95a5a6;
      position: relative;
      opacity: 0.3;
      transition: all 0.3s;
    }

    .arrow-line.active {
      opacity: 1;
      background: #3498db;
    }

    .updates-log {
      max-height: 200px;
      overflow-y: auto;
      padding: 1rem;
      background: white;
      border-radius: 8px;
    }

    .update-entry {
      display: grid;
      grid-template-columns: auto auto 1fr;
      gap: 1rem;
      padding: 0.5rem;
      margin: 0.5rem 0;
      border-radius: 4px;
      background: #f8f9fa;
    }

    .update-entry.source { border-left: 4px solid #3498db; }
    .update-entry.computed { border-left: 4px solid #2ecc71; }
    .update-entry.effect { border-left: 4px solid #9b59b6; }

    .step-explanation {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-top: 1rem;
    }

    .step {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .step-number {
      background: #3498db;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .step-content h4 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .step-content p {
      margin: 0 0 0.5rem 0;
      color: #34495e;
    }

    .step-content ul {
      margin: 0;
      padding-left: 1.2rem;
    }

    .step-content li {
      margin: 0.3rem 0;
      color: #7f8c8d;
    }

    code {
      background: #f8f9fa;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: monospace;
      color: #e74c3c;
    }

    .action-button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .action-button.increment {
      background: #2ecc71;
      color: white;
    }

    .action-button.decrement {
      background: #e74c3c;
      color: white;
    }

    .action-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .computation-formula {
      background: rgba(0,0,0,0.1);
      padding: 0.5rem;
      border-radius: 4px;
      font-family: monospace;
      margin: 0.5rem 0;
    }

    .effect-details {
      background: rgba(0,0,0,0.1);
      padding: 0.5rem;
      border-radius: 4px;
      margin: 0.5rem 0;
    }

    .dependency-label {
      text-align: center;
      color: #7f8c8d;
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }

    .legend {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .legend-item::before {
      content: '';
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .legend-item.source::before { background: #3498db; }
    .legend-item.computed::before { background: #2ecc71; }
    .legend-item.effect::before { background: #9b59b6; }

    .arrow-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('logEntry', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SignalPatternComponent {
  count = signal(0);
  doubled = computed(() => this.count() * 2);
  updates = signal<Array<{
    type: string;
    message: string;
    timestamp: Date;
  }>>([]);
  isUpdating = false;
  lastEffectRun = 'Not yet run';

  constructor() {
    // Create an effect to track changes
    effect(() => {
      const value = this.count();
      this.lastEffectRun = new Date().toLocaleTimeString();
      this.logUpdate('effect', `Effect ran with count = ${value}`);
    });
  }

  increment() {
    this.updateSignal(() => {
      this.count.update(value => value + 1);
      this.logUpdate('source', `Incremented count to ${this.count()}`);
    });
  }

  decrement() {
    this.updateSignal(() => {
      this.count.update(value => value - 1);
      this.logUpdate('source', `Decremented count to ${this.count()}`);
    });
  }

  private updateSignal(updateFn: () => void) {
    this.isUpdating = true;
    updateFn();
    this.logUpdate('computed', `Computed doubled = ${this.doubled()}`);
    setTimeout(() => {
      this.isUpdating = false;
    }, 500);
  }

  private logUpdate(type: string, message: string) {
    this.updates.update(updates => [{
      type,
      message,
      timestamp: new Date()
    }, ...updates].slice(0, 10));
  }
} 