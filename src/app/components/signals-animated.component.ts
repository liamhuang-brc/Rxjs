import { Component, signal, computed, effect, Signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger, state, keyframes } from '@angular/animations';

interface SignalNode {
  id: number;
  value: number;
  type: 'signal' | 'computed' | 'effect';
  position: { x: number; y: number };
}

interface LogEntry {
  timestamp: number;
  message: string;
  type: 'signal' | 'computed' | 'effect';
}

interface EffectUpdate {
  id: number;
  message: string;
  timestamp: number;
}

const STORAGE_KEY = 'signalDemo';

interface StorageData {
  value: number;
  lastUpdated: string;
  updateCount: number;
}

@Component({
  selector: 'app-signals-animated',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Understanding Signals with Animations</h2>
      
      <div class="visualization-container">
        <!-- Notification Banner -->
        <div *ngFor="let notification of activeNotifications()"
             class="notification-banner"
             [class.success]="notification.type === 'success'"
             [class.info]="notification.type === 'info'"
             [@notificationAnimation]>
          {{ notification.message }}
        </div>

        <!-- Signal Graph -->
        <div class="signal-graph">
          <!-- Connection Lines -->
          <svg class="connections">
            <g *ngFor="let node of nodes()">
              <line *ngIf="node.type !== 'signal'"
                [attr.x1]="getPreviousNode(node).position.x + 50"
                [attr.y1]="getPreviousNode(node).position.y + 50"
                [attr.x2]="node.position.x + 50"
                [attr.y2]="node.position.y + 50"
                class="connection-line"
                [class.active]="isLineActive()"
              />
            </g>
          </svg>

          <!-- Signal Nodes -->
          <div *ngFor="let node of nodes()"
               [class]="'node ' + node.type"
               [style.left.px]="node.position.x"
               [style.top.px]="node.position.y"
               [@nodeAnimation]="getNodeState(node)"
               (click)="updateSignal(node)">
            <div class="node-content">
              <div class="node-type">{{ node.type | uppercase }}</div>
              <div class="node-value">{{ getNodeValue(node) }}</div>
              <div class="node-description" *ngIf="node.type === 'computed'">
                ({{ currentValue() }} × 2)
              </div>
              <div class="node-description" *ngIf="node.type === 'effect'">
                Effects Run
              </div>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="controls">
          <button (click)="incrementSignal()" class="action-btn">
            Increment Signal ({{ currentValue() }})
          </button>
          <button (click)="resetDemo()" class="action-btn reset">
            Reset Demo
          </button>
        </div>

        <!-- Effect Monitoring -->
        <div class="effect-monitoring">
          <h3>Effect Monitoring</h3>
          <div class="effect-stats">
            <div class="stat-item">
              <div class="label">Signal Value</div>
              <div class="value">{{ currentValue() }}</div>
            </div>
            <div class="stat-item">
              <div class="label">Computed Value</div>
              <div class="value">{{ computedValue() }}</div>
            </div>
            <div class="stat-item">
              <div class="label">Effects Run</div>
              <div class="value">{{ effectCount() }}</div>
            </div>
          </div>

          <div class="effect-timeline">
            <h4>Recent Effects</h4>
            <div class="timeline">
              <div *ngFor="let effect of recentEffects()"
                   class="timeline-item"
                   [@effectItemAnimation]>
                <div class="time">{{ formatTimestamp(effect.timestamp) }}</div>
                <div class="message">{{ effect.message }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Storage Section -->
        <div class="storage-section">
          <h3>Local Storage</h3>
          <div class="storage-info">
            <div class="info-item">
              <span class="label">Stored Value:</span>
              <span class="value">{{ storageValue() }}</span>
            </div>
            <div class="info-item">
              <span class="label">Last Updated:</span>
              <span class="value">{{ storageLastUpdated() }}</span>
            </div>
            <div class="info-item">
              <span class="label">Update Count:</span>
              <span class="value">{{ storageUpdateCount() }}</span>
            </div>
          </div>
          <div class="storage-controls">
            <button (click)="loadFromStorage()" 
                    [disabled]="!hasStoredValue()"
                    class="storage-btn">
              Load from Storage
            </button>
            <button (click)="clearStorage()" 
                    [disabled]="!hasStoredValue()"
                    class="storage-btn clear">
              Clear Storage
            </button>
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

    .visualization-container {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      margin-top: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: relative;
    }

    .signal-graph {
      height: 300px;
      position: relative;
      background: #f8f9fa;
      border-radius: 8px;
      margin: 2rem 0;
      padding: 1rem;
    }

    .connections {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .connection-line {
      stroke: #95a5a6;
      stroke-width: 2;
      transition: all 0.3s ease;
    }

    .connection-line.active {
      stroke: #3498db;
      stroke-width: 3;
      stroke-dasharray: 5;
      animation: dash 1s linear infinite;
    }

    @keyframes dash {
      to {
        stroke-dashoffset: -10;
      }
    }

    .node {
      position: absolute;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .node:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .node.signal {
      background: #3498db;
      color: white;
    }

    .node.computed {
      background: #2ecc71;
      color: white;
    }

    .node.effect {
      background: #e74c3c;
      color: white;
    }

    .node-content {
      text-align: center;
    }

    .node-type {
      font-size: 0.8rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;
    }

    .node-value {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .controls {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin: 2rem 0;
    }

    .action-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: #3498db;
      color: white;
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
    }

    .action-btn.reset {
      background: #e74c3c;
    }

    .effect-monitoring {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin: 2rem 0;
    }

    .effect-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin: 1rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-item .label {
      font-size: 0.8rem;
      color: #7f8c8d;
      margin-bottom: 0.5rem;
    }

    .stat-item .value {
      font-size: 1.2rem;
      font-weight: bold;
      color: #2c3e50;
    }

    .effect-timeline {
      margin-top: 1.5rem;
    }

    .timeline {
      max-height: 200px;
      overflow-y: auto;
      padding: 1rem;
      background: white;
      border-radius: 4px;
    }

    .timeline-item {
      display: flex;
      align-items: flex-start;
      padding: 0.5rem;
      border-left: 3px solid #3498db;
      margin: 0.5rem 0;
      background: #f8f9fa;
    }

    .timeline-item .time {
      min-width: 100px;
      color: #7f8c8d;
      font-size: 0.8rem;
    }

    .timeline-item .message {
      flex: 1;
      margin-left: 1rem;
    }

    .storage-section {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin: 2rem 0;
    }

    .storage-info {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }

    .storage-info p {
      margin: 0.5rem 0;
      font-size: 0.9rem;
    }

    .storage-controls {
      display: flex;
      gap: 1rem;
      margin: 1rem 0;
    }

    .storage-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #3498db;
      color: white;
      flex: 1;
    }

    .storage-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .storage-btn.clear {
      background: #e74c3c;
    }

    .storage-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
    }

    .notification-banner {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 2rem;
      border-radius: 8px;
      color: white;
      z-index: 1000;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      min-width: 300px;
    }

    .notification-banner.success {
      background: #2ecc71;
    }

    .notification-banner.info {
      background: #3498db;
    }

    .node-description {
      font-size: 0.8rem;
      opacity: 0.8;
      margin-top: 0.3rem;
    }
  `],
  animations: [
    trigger('nodeAnimation', [
      transition('* => *', [
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.2)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ]),
    trigger('effectItemAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-20px)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('notificationAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class SignalsAnimatedComponent implements OnInit {
  // Core signals
  currentValue = signal<number>(0);
  computedValue = computed(() => this.currentValue() * 2);
  effectCount = signal<number>(0);

  // Effect tracking
  recentEffects = signal<EffectUpdate[]>([]);
  lastUpdateTime = signal<number>(Date.now());

  // Storage signals
  storageValue = signal<string>('0');
  storageLastUpdated = signal<string>('Never');
  storageUpdateCount = signal<number>(0);
  hasStoredValue = signal<boolean>(false);

  // Notifications
  activeNotifications = signal<Array<{ message: string; type: 'success' | 'info' }>>([]);

  // Nodes state
  nodes = signal<SignalNode[]>([
    {
      id: 1,
      value: 0,
      type: 'signal',
      position: { x: 150, y: 100 }
    },
    {
      id: 2,
      value: 0,
      type: 'computed',
      position: { x: 400, y: 100 }
    },
    {
      id: 3,
      value: 0,
      type: 'effect',
      position: { x: 650, y: 100 }
    }
  ]);

  constructor() {
    // Track signal and computed updates
    effect(() => {
      const value = this.currentValue();
      const computed = this.computedValue();
      
      // Count this effect execution
      this.effectCount.update(count => count + 1);
      this.lastUpdateTime.set(Date.now());

      // Record the effect
      const effectUpdate: EffectUpdate = {
        id: this.effectCount(),
        message: `Signal changed to ${value}, computed updated to ${computed}`,
        timestamp: Date.now()
      };
      this.recentEffects.update(effects => [effectUpdate, ...effects].slice(0, 5));

      // Update node values
      this.nodes.update(nodes => nodes.map(node => ({
        ...node,
        value: this.getNodeValue(node)
      })));

      // Show notification
      if (value > 0) {
        if (value % 5 === 0) {
          this.addNotification(`Milestone: Signal = ${value}, Computed = ${computed}!`, 'success');
        } else {
          this.addNotification(`Signal = ${value}, Computed = ${computed}`, 'info');
        }
      }
    });

    // Storage synchronization effect
    effect(() => {
      const value = this.currentValue();
      
      // Count this effect execution
      this.effectCount.update(count => count + 1);

      // Update storage
      const storageData: StorageData = {
        value,
        lastUpdated: new Date().toLocaleString(),
        updateCount: this.storageUpdateCount() + 1
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
      this.storageValue.set(value.toString());
      this.storageLastUpdated.set(storageData.lastUpdated);
      this.storageUpdateCount.update(count => count + 1);
      this.hasStoredValue.set(true);

      // Record storage effect
      const effectUpdate: EffectUpdate = {
        id: this.effectCount(),
        message: `Stored value ${value} in localStorage`,
        timestamp: Date.now()
      };
      this.recentEffects.update(effects => [effectUpdate, ...effects].slice(0, 5));
    });
  }

  ngOnInit() {
    // Check for existing storage data on init
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        const data: StorageData = JSON.parse(storedData);
        this.currentValue.set(data.value);
        this.storageValue.set(data.value.toString());
        this.storageLastUpdated.set(data.lastUpdated);
        this.storageUpdateCount.set(data.updateCount);
        this.hasStoredValue.set(true);
      } catch (e) {
        console.error('Error parsing storage data:', e);
      }
    }
  }

  getNodeValue(node: SignalNode): number {
    switch (node.type) {
      case 'signal':
        return this.currentValue();
      case 'computed':
        return this.computedValue();
      case 'effect':
        return this.effectCount();
      default:
        return 0;
    }
  }

  getNodeState(node: SignalNode): string {
    return `${node.type}-${this.getNodeValue(node)}`;
  }

  incrementSignal() {
    this.currentValue.update(v => v + 1);
  }

  updateSignal(node: SignalNode) {
    if (node.type === 'signal') {
      this.incrementSignal();
    }
  }

  resetDemo() {
    this.currentValue.set(0);
    this.effectCount.set(0);
    this.lastUpdateTime.set(Date.now());
    this.clearStorage();
  }

  loadFromStorage() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        const data: StorageData = JSON.parse(storedData);
        this.currentValue.set(data.value);
      } catch (e) {
        console.error('Error loading from storage:', e);
      }
    }
  }

  clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
    this.storageValue.set('0');
    this.storageLastUpdated.set('Never');
    this.storageUpdateCount.set(0);
    this.hasStoredValue.set(false);
  }

  addNotification(message: string, type: 'success' | 'info') {
    this.activeNotifications.update(notifications => [
      ...notifications,
      { message, type }
    ]);

    // Remove notification after 3 seconds
    setTimeout(() => {
      this.activeNotifications.update(notifications =>
        notifications.filter(n => n.message !== message)
      );
    }, 3000);
  }

  getPreviousNode(node: SignalNode): SignalNode {
    const nodes = this.nodes();
    const index = nodes.findIndex(n => n.id === node.id);
    return nodes[index - 1];
  }

  isLineActive(): boolean {
    return Date.now() - this.lastUpdateTime() < 300;
  }

  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  }
} 