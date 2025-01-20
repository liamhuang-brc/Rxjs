import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger, state, keyframes } from '@angular/animations';

@Component({
  selector: 'app-observer-pattern',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container" [@fadeIn]>
      <h2>Understanding the Observer Pattern</h2>

      <div class="explanation-panel">
        <h3>How the Pattern Works:</h3>
        <ol>
          <li><strong>Subscription:</strong> The Observer subscribes to the Observable to receive updates</li>
          <li><strong>Notification:</strong> The Observable notifies all subscribed Observers when:
            <ul>
              <li>New value is available (next)</li>
              <li>Error occurs (error)</li>
              <li>Stream completes (complete)</li>
            </ul>
          </li>
        </ol>
      </div>
      
      <div class="tutorial-controls">
        <button (click)="subscribe()" [disabled]="isSubscribed">
          <span class="icon">🔗</span> Subscribe Observer
        </button>
        <button (click)="startEmitting()" [disabled]="!isSubscribed || isEmitting">
          <span class="icon">▶️</span> Start Notifications
        </button>
        <button (click)="emitError()" [disabled]="!isSubscribed || hasError || isCompleted">
          <span class="icon">⚠️</span> Trigger Error
        </button>
        <button (click)="complete()" [disabled]="!isSubscribed || hasError || isCompleted">
          <span class="icon">✅</span> Complete
        </button>
        <button (click)="reset()">
          <span class="icon">🔄</span> Reset Demo
        </button>
      </div>

      <div class="visualization-container">
        <!-- Observable -->
        <div class="observable-box" [class.active]="isEmitting">
          <div class="title">Observable (Publisher)</div>
          <div class="role-description">
            "I notify my subscribers when I have new data"
          </div>
          <div class="stream-content">
            <ng-container *ngIf="!hasError && !isCompleted">
              <div class="value-bubble" 
                   *ngFor="let value of emittedValues"
                   [@valueEmission]>
                {{ value }}
              </div>
            </ng-container>
            <div class="error-state" *ngIf="hasError" [@errorState]>
              ⚠️ Error: Network Failed
            </div>
            <div class="complete-state" *ngIf="isCompleted" [@completeState]>
              ✓ No More Data
            </div>
          </div>
        </div>

        <!-- Subscription Line -->
        <div class="subscription-line" [class.active]="isSubscribed">
          <div class="subscription-status">
            {{ isSubscribed ? '🔔 Subscribed' : '🔕 Not Subscribed' }}
          </div>
          <div class="arrow" [class.flowing]="isEmitting"></div>
        </div>

        <!-- Observer -->
        <div class="observer-box" [class.subscribed]="isSubscribed" [class.receiving]="isEmitting">
          <div class="title">Observer (Subscriber)</div>
          <div class="role-description">
            "I listen for updates from the Observable"
          </div>
          <div class="callback-methods">
            <div class="method" [class.active]="isEmitting && !hasError && !isCompleted">
              <div class="method-header">next(value)</div>
              <div class="method-description">Received: {{ currentValue }}</div>
            </div>
            <div class="method error" [class.active]="hasError">
              <div class="method-header">error(err)</div>
              <div class="method-description">{{ errorMessage || 'Waiting for errors...' }}</div>
            </div>
            <div class="method complete" [class.active]="isCompleted">
              <div class="method-header">complete()</div>
              <div class="method-description">
                {{ isCompleted ? 'Stream ended' : 'Waiting for completion...' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="events-panel">
        <div class="events-header">
          <h3>Subscription Timeline</h3>
        </div>
        <div class="events-log">
          <div *ngFor="let log of eventLogs" 
               class="log-entry"
               [class.subscription]="log.type === 'subscription'"
               [class.notification]="log.type === 'next'"
               [class.error]="log.type === 'error'"
               [class.complete]="log.type === 'complete'"
               [@logEntry]>
            <span class="timestamp">{{ log.timestamp | date:'HH:mm:ss' }}</span>
            <span class="type-indicator">{{ getEventIcon(log.type) }}</span>
            <span class="message">{{ log.message }}</span>
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

    .tutorial-controls {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin: 2rem 0;
    }

    .visualization-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 3rem 0;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .observable-box, .observer-box {
      width: 250px;
      padding: 1.5rem;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .observable-box {
      background: #3498db;
      color: white;
    }

    .observer-box {
      background: #2ecc71;
      color: white;
    }

    .active {
      box-shadow: 0 0 20px rgba(52, 152, 219, 0.5);
    }

    .receiving {
      box-shadow: 0 0 20px rgba(46, 204, 113, 0.5);
    }

    .stream-content {
      display: flex;
      align-items: center;
      min-height: 50px;
      position: relative;
    }

    .value-bubble {
      background: white;
      color: #3498db;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      position: absolute;
    }

    .connection-line {
      flex: 1;
      height: 2px;
      background: #95a5a6;
      margin: 0 2rem;
      position: relative;
      opacity: 0.5;
      transition: opacity 0.3s;
    }

    .connection-line.active {
      opacity: 1;
      background: #3498db;
    }

    .arrow {
      position: absolute;
      right: -10px;
      top: -4px;
      width: 0;
      height: 0;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 10px solid #3498db;
    }

    .callback-methods {
      margin-top: 1rem;
    }

    .method {
      padding: 0.5rem;
      margin: 0.5rem 0;
      border-radius: 4px;
      background: rgba(255,255,255,0.1);
      opacity: 0.7;
      transition: all 0.3s;
    }

    .method.active {
      opacity: 1;
      background: rgba(255,255,255,0.2);
      transform: scale(1.05);
    }

    .error-state, .complete-state {
      width: 100%;
      text-align: center;
      font-weight: bold;
      padding: 1rem;
    }

    .events-log {
      margin-top: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .log-entries {
      max-height: 200px;
      overflow-y: auto;
    }

    .log-entry {
      padding: 0.5rem;
      margin: 0.5rem 0;
      background: white;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .log-entry.error {
      color: #e74c3c;
      border-left: 4px solid #e74c3c;
    }

    .log-entry.complete {
      color: #f39c12;
      border-left: 4px solid #f39c12;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      background: #3498db;
      color: white;
      cursor: pointer;
      transition: all 0.3s;
    }

    button:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .explanation-panel {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin: 1rem 0;
    }

    .explanation-panel ol {
      margin: 0;
      padding-left: 1.5rem;
    }

    .explanation-panel li {
      margin: 0.5rem 0;
      color: #2c3e50;
    }

    .events-panel {
      margin-top: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .events-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    .event-types {
      display: flex;
      gap: 1rem;
    }

    .event-type {
      padding: 0.25rem 0.75rem;
      border-radius: 15px;
      font-size: 0.9rem;
    }

    .event-type.next { background: #e8f5e9; color: #2e7d32; }
    .event-type.error { background: #ffebee; color: #c62828; }
    .event-type.complete { background: #fff3e0; color: #f57c00; }

    .events-log {
      max-height: 300px;
      overflow-y: auto;
      padding: 1rem;
    }

    .log-entry {
      display: grid;
      grid-template-columns: auto auto 1fr;
      gap: 1rem;
      align-items: center;
      padding: 0.75rem;
      margin: 0.5rem 0;
      background: #f8f9fa;
      border-radius: 4px;
      font-family: monospace;
    }

    .timestamp {
      color: #7f8c8d;
    }

    .type-indicator {
      font-size: 1.2rem;
    }

    .message {
      color: #2c3e50;
    }

    .method-description {
      font-size: 0.8rem;
      opacity: 0.8;
      margin-top: 0.25rem;
    }

    .icon {
      margin-right: 0.5rem;
    }

    .role-description {
      font-size: 0.9rem;
      font-style: italic;
      margin: 0.5rem 0;
      opacity: 0.8;
    }

    .subscription-line {
      position: relative;
      width: 200px;
      height: 4px;
      background: #95a5a6;
      margin: 0 2rem;
      opacity: 0.3;
      transition: all 0.3s;
    }

    .subscription-line.active {
      opacity: 1;
      background: #3498db;
    }

    .subscription-status {
      position: absolute;
      top: -25px;
      width: 100%;
      text-align: center;
      font-size: 0.9rem;
    }

    .arrow {
      position: absolute;
      right: -10px;
      top: -3px;
      width: 0;
      height: 0;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 10px solid #3498db;
    }

    .arrow.flowing {
      animation: flowPulse 1s infinite;
    }

    @keyframes flowPulse {
      0% { opacity: 0.3; }
      50% { opacity: 1; }
      100% { opacity: 0.3; }
    }

    .log-entry.subscription { border-left: 4px solid #3498db; }
    .log-entry.notification { border-left: 4px solid #2ecc71; }
    .log-entry.error { border-left: 4px solid #e74c3c; }
    .log-entry.complete { border-left: 4px solid #f1c40f; }

    .method-header {
      font-weight: bold;
      margin-bottom: 0.25rem;
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('valueEmission', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('500ms ease-out', 
          keyframes([
            style({ opacity: 1, transform: 'translateX(0)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateX(300px)', offset: 1 })
          ])
        )
      ])
    ]),
    trigger('errorState', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('completeState', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
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
export class ObserverPatternComponent {
  isSubscribed = false;
  isEmitting = false;
  hasError = false;
  isCompleted = false;
  currentValue: number | null = null;
  errorMessage: string | null = null;
  emittedValues: number[] = [];
  eventLogs: Array<{
    message: string;
    type: string;
    timestamp: Date;
  }> = [];
  private interval: any;

  subscribe() {
    this.isSubscribed = true;
    this.addLog('Observer subscribed to Observable', 'subscription');
  }

  startEmitting() {
    if (!this.isSubscribed) {
      this.addLog('Cannot start: Observer not subscribed', 'error');
      return;
    }
    
    this.isEmitting = true;
    this.addLog('Observable started emitting values', 'next');
    this.emitValues();
  }

  private emitValues() {
    let count = 0;
    this.interval = setInterval(() => {
      if (count < 10 && !this.hasError && !this.isCompleted) {
        const value = Math.floor(Math.random() * 100);
        this.emittedValues = [...this.emittedValues, value];
        this.currentValue = value;
        this.addLog(`Observable notified Observer with value: ${value}`, 'next');
        
        setTimeout(() => {
          this.emittedValues = this.emittedValues.filter(v => v !== value);
        }, 500);
        
        count++;
      } else {
        clearInterval(this.interval);
        this.isEmitting = false;
      }
    }, 1000);
  }

  emitError() {
    this.hasError = true;
    this.errorMessage = 'Network connection failed';
    this.addLog('Error: Network connection failed', 'error');
    clearInterval(this.interval);
  }

  complete() {
    this.isCompleted = true;
    this.addLog('Observable stream completed successfully', 'complete');
    clearInterval(this.interval);
  }

  reset() {
    this.isSubscribed = false;
    this.isEmitting = false;
    this.hasError = false;
    this.isCompleted = false;
    this.currentValue = null;
    this.errorMessage = null;
    this.emittedValues = [];
    this.eventLogs = [];
    this.addLog('Demo reset', 'info');
    clearInterval(this.interval);
  }

  private addLog(message: string, type: string) {
    this.eventLogs = [{
      message,
      type,
      timestamp: new Date()
    }, ...this.eventLogs].slice(0, 10);
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'next': return '📤';
      case 'error': return '⚠️';
      case 'complete': return '✅';
      default: return '📋';
    }
  }
} 