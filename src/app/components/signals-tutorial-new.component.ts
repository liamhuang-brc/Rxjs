import { Component, signal, computed, effect, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger, state, keyframes } from '@angular/animations';

interface LogEntry {
  id: number;
  time: Date;
  type: 'signal' | 'computed' | 'effect';
  message: string;
  values: {
    signal: number;
    computed: number;
    previousSignal?: number;
    action: string;
  };
}

@Component({
  selector: 'app-signals-tutorial-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tutorial-container">
      <!-- Header Section -->
      <header class="header">
        <h1>Angular Signals Tutorial</h1>
        <p class="subtitle">Learn how signals work with interactive examples</p>
      </header>

      <!-- Interactive Demo Section -->
      <section class="demo-section">
        <div class="signal-container" [@signalState]="counterSignal()">
          <h2>Basic Signal</h2>
          <div class="signal-value">{{ counterSignal() }}</div>
          <div class="controls">
            <button (click)="increment()" [@buttonPress]="buttonState">+1</button>
            <button (click)="multiply()" [@buttonPress]="buttonState">×2</button>
            <button (click)="reset()" [@buttonPress]="buttonState">Reset</button>
          </div>
        </div>

        <div class="computed-container" [@computedState]="computedValue()">
          <h2>Computed Signal</h2>
          <div class="computed-value">{{ computedValue() }}</div>
          <p class="explanation">= Counter × 2 + 10</p>
        </div>

        <div class="effect-container">
          <h2>Effect Log</h2>
          <div class="effect-log">
            <div *ngFor="let log of effectLogs(); let i = index" 
                 class="effect-entry"
                 [@effectEntry]="i"
                 [class.new-log]="isNewLog(log)">
              <div class="log-content">
                <span class="timestamp" [@timeStamp]="log.time">{{ log.time | date:'HH:mm:ss.SSS' }}</span>
                <span class="message" [@messageSlide]="log.message">{{ log.message }}</span>
              </div>
              <div class="log-indicator" [@pulseAnimation]="log.time"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Explanation Section -->
      <section class="explanation-section">
        <div class="explanation-card" *ngFor="let explanation of explanations">
          <h3>{{ explanation.title }}</h3>
          <p>{{ explanation.content }}</p>
          <code *ngIf="explanation.code">{{ explanation.code }}</code>
        </div>
      </section>

      <section class="logging-section">
        <div class="logging-header">
          <h2>Signal Flow Visualization</h2>
          <div class="logging-controls">
            <button (click)="clearLogs()" class="clear-btn">Clear Logs</button>
            <div class="filter-controls">
              <label>
                <input type="checkbox" [(ngModel)]="showSignals"> Signals
              </label>
              <label>
                <input type="checkbox" [(ngModel)]="showComputed"> Computed
              </label>
              <label>
                <input type="checkbox" [(ngModel)]="showEffects"> Effects
              </label>
            </div>
          </div>
        </div>

        <div class="logging-container">
          <div class="logging-timeline">
            <div *ngFor="let log of filteredLogs(); let i = index" 
                 class="log-entry"
                 [class.signal-log]="log.type === 'signal'"
                 [class.computed-log]="log.type === 'computed'"
                 [class.effect-log]="log.type === 'effect'"
                 [@logEntry]="i">
              
              <div class="log-time">
                <span class="time">{{ log.time | date:'HH:mm:ss.SSS' }}</span>
                <div class="log-type-indicator" [class]="log.type"></div>
              </div>

              <div class="log-content">
                <div class="log-header">
                  <span class="log-type">{{ log.type | titlecase }}</span>
                  <span class="log-id">#{{ log.id }}</span>
                </div>

                <div class="log-message">{{ log.message }}</div>

                <div class="log-details">
                  <div class="value-change" *ngIf="log.values.previousSignal !== undefined">
                    {{ log.values.previousSignal }} → {{ log.values.signal }}
                    <span class="action-label">{{ log.values.action }}</span>
                  </div>
                  <div class="computed-value" *ngIf="log.type !== 'signal'">
                    Computed: {{ log.values.computed }}
                  </div>
                </div>
              </div>

              <div class="log-flow-line" *ngIf="i < filteredLogs().length - 1"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .tutorial-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .subtitle {
      color: #666;
      font-size: 1.2rem;
    }

    .demo-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .signal-container, .computed-container, .effect-container {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .signal-value, .computed-value {
      font-size: 3rem;
      font-weight: bold;
      margin: 1rem 0;
      color: #2196F3;
    }

    .controls {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      background: #2196F3;
      color: white;
      cursor: pointer;
      transition: transform 0.1s;
    }

    button:hover {
      background: #1976D2;
    }

    .effect-log {
      max-height: 300px;
      overflow-y: auto;
      text-align: left;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .effect-entry {
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      border-radius: 6px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      gap: 1rem;
      position: relative;
      overflow: hidden;
    }

    .log-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .timestamp {
      color: #666;
      font-size: 0.8rem;
      font-family: 'Courier New', monospace;
    }

    .message {
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .log-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4CAF50;
      flex-shrink: 0;
    }

    .new-log {
      border-left: 3px solid #4CAF50;
    }

    .effect-entry:hover {
      background: #f8f9fa;
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.5); opacity: 0.5; }
      100% { transform: scale(1); opacity: 1; }
    }

    .explanation-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .explanation-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    code {
      display: block;
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 6px;
      margin-top: 1rem;
      font-family: 'Courier New', Courier, monospace;
    }

    .logging-section {
      margin-top: 2rem;
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .logging-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .logging-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .filter-controls {
      display: flex;
      gap: 1rem;
    }

    .clear-btn {
      padding: 0.5rem 1rem;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .logging-container {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
      max-height: 500px;
      overflow-y: auto;
    }

    .logging-timeline {
      position: relative;
      padding-left: 2rem;
    }

    .log-entry {
      position: relative;
      padding: 1rem;
      margin-bottom: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: transform 0.2s;
    }

    .log-entry:hover {
      transform: translateX(5px);
    }

    .log-time {
      position: absolute;
      left: -2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .time {
      font-size: 0.8rem;
      color: #666;
      font-family: 'Courier New', monospace;
    }

    .log-type-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .log-type-indicator.signal { background: #2196F3; }
    .log-type-indicator.computed { background: #4CAF50; }
    .log-type-indicator.effect { background: #FF9800; }

    .log-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .log-type {
      font-weight: bold;
      color: #2c3e50;
    }

    .log-id {
      color: #666;
      font-size: 0.9rem;
    }

    .log-message {
      color: #2c3e50;
      font-size: 0.95rem;
    }

    .log-details {
      display: flex;
      gap: 1rem;
      font-size: 0.9rem;
      color: #666;
      background: #f8f9fa;
      padding: 0.5rem;
      border-radius: 4px;
    }

    .value-change {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .action-label {
      background: #e9ecef;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
    }

    .log-flow-line {
      position: absolute;
      left: -1.5rem;
      top: 100%;
      width: 2px;
      height: 1rem;
      background: #dee2e6;
    }

    .signal-log { border-left: 3px solid #2196F3; }
    .computed-log { border-left: 3px solid #4CAF50; }
    .effect-log { border-left: 3px solid #FF9800; }
  `],
  animations: [
    trigger('signalState', [
      transition('* => *', [
        style({ transform: 'scale(1)' }),
        animate('200ms ease-out', style({ transform: 'scale(1.1)' })),
        animate('200ms ease-in', style({ transform: 'scale(1)' }))
      ])
    ]),
    trigger('computedState', [
      transition('* => *', [
        style({ opacity: 0.6, transform: 'translateY(0)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(-5px)' })),
        animate('200ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('effectEntry', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'translateX(-20px)',
          height: 0,
          padding: 0
        }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ 
          opacity: 1, 
          transform: 'translateX(0)',
          height: '*',
          padding: '0.75rem'
        }))
      ])
    ]),
    trigger('timeStamp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms 100ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('messageSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('300ms 200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('pulseAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', keyframes([
          style({ transform: 'scale(0.5)', opacity: 0, offset: 0 }),
          style({ transform: 'scale(1.2)', opacity: 0.5, offset: 0.5 }),
          style({ transform: 'scale(1)', opacity: 1, offset: 1 })
        ]))
      ])
    ]),
    trigger('buttonPress', [
      state('pressed', style({ transform: 'scale(0.95)' })),
      state('released', style({ transform: 'scale(1)' })),
      transition('released => pressed', animate('100ms ease-in')),
      transition('pressed => released', animate('100ms ease-out'))
    ]),
    trigger('logEntry', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'translateX(-20px)',
          height: 0,
        }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ 
          opacity: 1, 
          transform: 'translateX(0)',
          height: '*',
        }))
      ])
    ])
  ]
})
export class SignalsTutorialNewComponent {
  // Basic signal
  counterSignal = signal<number>(0);

  // Computed signal
  computedValue = computed(() => this.counterSignal() * 2 + 10);

  // Effect logs
  effectLogs = signal<Array<{ time: Date; message: string }>>([]);

  // Button animation state
  buttonState = 'released';

  // Explanations for the tutorial
  explanations = [
    {
      title: 'What are Signals?',
      content: 'Signals are a new way to handle reactivity in Angular. They are wrappers around values that can notify interested consumers when that value changes.',
      code: 'const mySignal = signal<number>(0);'
    },
    {
      title: 'Computed Signals',
      content: 'Computed signals automatically update when their dependencies change. They are perfect for derived state.',
      code: 'const doubled = computed(() => mySignal() * 2);'
    },
    {
      title: 'Effects',
      content: 'Effects run side effects whenever their signal dependencies change. They are great for logging, saving to localStorage, or updating the DOM.',
      code: 'effect(() => console.log(`Value changed: ${mySignal()}`));'
    }
  ];

  // Track new logs for animation
  private newLogTimeout = 2000; // 2 seconds
  private newLogs = new Set<Date>();

  // Logging controls
  showSignals = true;
  showComputed = true;
  showEffects = true;

  // Enhanced logging
  private logCounter = 0;
  logs = signal<LogEntry[]>([]);

  constructor() {
    effect(() => {
      const count = this.counterSignal();
      const computed = this.computedValue();
      
      const newLog = {
        time: new Date(),
        message: `Counter: ${count} → Computed: ${computed}`
      };

      this.effectLogs.update(logs => [newLog, ...logs].slice(0, 10));
      
      // Track new log for animation
      this.newLogs.add(newLog.time);
      setTimeout(() => {
        this.newLogs.delete(newLog.time);
      }, this.newLogTimeout);
    });

    // Initialize effect logging
    effect(() => {
      const currentValue = this.counterSignal();
      const computedValue = this.computedValue();
      const previousValue = this.getPreviousValue();
      
      // Log signal change
      this.addLog({
        type: 'signal',
        message: `Signal value changed`,
        values: {
          signal: currentValue,
          computed: computedValue,
          previousSignal: previousValue,
          action: this.getActionType(currentValue, previousValue)
        }
      });

      // Log computed update
      this.addLog({
        type: 'computed',
        message: `Computed value updated`,
        values: {
          signal: currentValue,
          computed: computedValue,
          action: 'Update'
        }
      });

      // Log effect execution
      this.addLog({
        type: 'effect',
        message: `Effect executed`,
        values: {
          signal: currentValue,
          computed: computedValue,
          action: 'Execute'
        }
      });
    });
  }

  // Helper method to check if a log is new
  isNewLog(log: { time: Date; message: string }): boolean {
    return this.newLogs.has(log.time);
  }

  // Actions
  increment() {
    this.animateButton();
    this.counterSignal.update(count => count + 1);
  }

  multiply() {
    this.animateButton();
    this.counterSignal.update(count => count * 2);
  }

  reset() {
    this.animateButton();
    this.counterSignal.set(0);
  }

  private animateButton() {
    this.buttonState = 'pressed';
    setTimeout(() => this.buttonState = 'released', 100);
  }

  // Helper methods
  private addLog(log: Partial<LogEntry>) {
    this.logCounter++;
    const newLog: LogEntry = {
      id: this.logCounter,
      time: new Date(),
      ...log
    } as LogEntry;

    this.logs.update(logs => [newLog, ...logs].slice(0, 50));
  }

  private getPreviousValue(): number {
    const logs = this.logs();
    const lastSignalLog = logs.find(log => log.type === 'signal');
    return lastSignalLog?.values.signal ?? 0;
  }

  private getActionType(current: number, previous: number): string {
    if (current === 0) return "Reset";
    if (current === previous + 1) return "Increment";
    if (current === previous * 2) return "Multiply";
    return "Update";
  }

  // Computed value for filtered logs
  filteredLogs = computed(() => {
    return this.logs().filter(log => {
      switch (log.type) {
        case 'signal': return this.showSignals;
        case 'computed': return this.showComputed;
        case 'effect': return this.showEffects;
        default: return true;
      }
    });
  });

  clearLogs() {
    this.logs.set([]);
    this.logCounter = 0;
  }
} 