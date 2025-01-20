import { Component, signal, computed, effect, Signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger, state, keyframes } from '@angular/animations';

interface SignalNode {
  id: number;
  value: number;
  type: 'signal' | 'computed' | 'effect';
  position: { x: number; y: number };
  description?: string;
  dependencies?: number[];
}

interface SignalMetrics {
  updateCount: number;
  lastUpdateTime: number;
  averageUpdateTime: number;
  peakValue: number;
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
  triggerValue: number;
  computedValue: number;
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
  templateUrl: './signals-animated.component.html',
  styleUrls: ['./signals-animated.component.scss'],
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
export class SignalsAnimatedComponent implements OnInit, OnDestroy {
  // Tab control
  activeTab = signal<'technical' | 'simple'>('technical');

  // Technical View Signals
  currentValue = signal<number>(0);
  computedValue = computed(() => {
    const value = this.currentValue();
    return this.computeMode() === 'multiply' ? value * 2 : value + 2;
  });
  effectCount = signal<number>(0);
  recentEffects = signal<EffectUpdate[]>([]);
  effectStartTime = signal<number>(Date.now());
  effectRunTimes = signal<number[]>([]);
  lastUpdateTime = signal<number>(Date.now());
  storageValue = signal<string>('0');
  storageLastUpdated = signal<string>('Never');
  storageUpdateCount = signal<number>(0);
  hasStoredValue = signal<boolean>(false);
  activeNotifications = signal<Array<{ message: string; type: 'success' | 'info' }>>([]);
  nodes = signal<SignalNode[]>([
    {
      id: 1,
      value: 0,
      type: 'signal',
      position: { x: 150, y: 100 },
      description: 'Root Signal',
      dependencies: []
    },
    {
      id: 2,
      value: 0,
      type: 'computed',
      position: { x: 400, y: 50 },
      description: 'Double Value',
      dependencies: [1]
    },
    {
      id: 3,
      value: 0,
      type: 'computed',
      position: { x: 400, y: 150 },
      description: 'Square Value',
      dependencies: [1]
    },
    {
      id: 4,
      value: 0,
      type: 'effect',
      position: { x: 650, y: 100 },
      description: 'State Monitor',
      dependencies: [2, 3]
    }
  ]);

  // Pizza Example Signals
  pizzaCount = signal<number>(0);
  totalPrice = computed(() => this.pizzaCount() * 10);
  happyCustomers = signal<number>(0);
  kitchenUpdates = signal<string[]>([]);

  // Enhanced Technical Properties
  selectedNode = signal<SignalNode | null>(null);
  activeParticles = signal<Array<{x: number, y: number}>>([]); 
  nodeMetrics = signal<Map<number, SignalMetrics>>(new Map());
  valueHistory = signal<Map<number, number[]>>(new Map());

  // Add compute mode signal
  computeMode = signal<'multiply' | 'add'>('multiply');

  // Technical View Signals
  effectCountByType = signal<Map<string, number>>(new Map());

  constructor() {
    // Initialize signals with proper values
    this.currentValue.set(0);
    this.effectCount.set(0);
    this.effectStartTime.set(Date.now());
    this.effectCountByType.set(new Map([
      ['main', 0],
      ['pizza', 0],
      ['metrics', 0]
    ]));
    this.recentEffects.set([{
      id: 0,
      message: "Initial setup - Watching for signal changes",
      timestamp: Date.now(),
      triggerValue: 0,
      computedValue: 0
    }]);

    // Main effect to track signal and computed values
    this.mainEffect = effect(() => {
      const startTime = performance.now();
      
      // Read values to track changes
      const signalValue = this.currentValue();
      const doubleValue = this.computedValue();
      const squareValue = Math.pow(signalValue, 2);

      // Calculate effect duration
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Update effect metrics
      this.effectRunTimes.update(times => [...times, duration].slice(-100));
      
      // Increment effect count
      const newCount = this.effectCount() + 1;
      this.effectCount.set(newCount);

      // Create detailed log entry
      const effectUpdate: EffectUpdate = {
        id: newCount,
        message: this.createEffectMessage(signalValue, doubleValue, squareValue, newCount),
        timestamp: Date.now(),
        triggerValue: signalValue,
        computedValue: doubleValue
      };

      // Update effect log (keep last 10 entries)
      this.recentEffects.update(effects => {
        const newEffects = [effectUpdate, ...effects];
        return newEffects.slice(0, 10);
      });

      // Update all nodes
      this.updateAllNodes(signalValue, doubleValue, squareValue, newCount);

      // Log to console with performance info
      this.logEffectUpdate(effectUpdate, duration);

      // Update last update time for animations
      this.lastUpdateTime.set(Date.now());
    });

    // Cleanup effect on component destroy
    if (this.ngOnDestroy) {
      const originalOnDestroy = this.ngOnDestroy.bind(this);
      this.ngOnDestroy = () => {
        if (this.mainEffect) {
          this.mainEffect.destroy();
        }
        originalOnDestroy();
      };
    } else {
      this.ngOnDestroy = () => {
        if (this.mainEffect) {
          this.mainEffect.destroy();
        }
      };
    }

    // Pizza Example Effects
    effect(() => {
      const pizzas = this.pizzaCount();
      
      if (pizzas > 0) {
        this.effectCountByType.update(counts => {
          const newCounts = new Map(counts);
          newCounts.set('pizza', (newCounts.get('pizza') || 0) + 1);
          return newCounts;
        });

        this.kitchenUpdates.update(updates => [
          `Chef is making pizza #${pizzas}! 👨‍🍳`,
          ...updates
        ].slice(0, 5));

        this.happyCustomers.update(count => count + 1);
      }
    });

    // Track node metrics
    effect(() => {
      const value = this.currentValue();
      
      this.effectCountByType.update(counts => {
        const newCounts = new Map(counts);
        newCounts.set('metrics', (newCounts.get('metrics') || 0) + 1);
        return newCounts;
      });

      this.nodes().forEach(node => {
        const nodeValue = this.getNodeValue(node);
        const currentMetrics = this.nodeMetrics().get(node.id) || {
          updateCount: 0,
          lastUpdateTime: Date.now(),
          averageUpdateTime: 0,
          peakValue: nodeValue
        };

        const newMetrics = {
          ...currentMetrics,
          updateCount: currentMetrics.updateCount + 1,
          lastUpdateTime: Date.now(),
          peakValue: Math.max(currentMetrics.peakValue, nodeValue)
        };

        this.nodeMetrics.update(metrics => {
          const newMap = new Map(metrics);
          newMap.set(node.id, newMetrics);
          return newMap;
        });

        // Update value history
        this.valueHistory.update(history => {
          const newHistory = new Map(history);
          const nodeHistory = newHistory.get(node.id) || [];
          newHistory.set(node.id, [...nodeHistory, nodeValue].slice(-20));
          return newHistory;
        });

        // Animate data flow
        if (node.dependencies?.length) {
          node.dependencies.forEach(depId => {
            this.animateDataFlow(depId, node.id);
          });
        }
      });
    });
  }

  private mainEffect: any; // Store effect reference

  ngOnDestroy() {
    if (this.mainEffect) {
      this.mainEffect.destroy();
    }
  }

  // Tab Control
  setActiveTab(tab: 'technical' | 'simple') {
    this.activeTab.set(tab);
  }

  // Technical View Methods
  incrementSignal() {
    const current = this.currentValue();
    this.currentValue.set(current + 1);
  }

  resetDemo() {
    // Reset all values
    this.currentValue.set(0);
    this.effectCount.set(0);
    this.effectCountByType.set(new Map([
      ['main', 0],
      ['pizza', 0],
      ['metrics', 0]
    ]));
    
    // Add reset message to effect log
    this.recentEffects.set([{
      id: 0,
      message: `Demo Reset:
• All values cleared
• Effect count reset to 0
• Signal value reset to 0
• Computed values reset
• Watching for new changes...`,
      timestamp: Date.now(),
      triggerValue: 0,
      computedValue: 0
    }]);

    // Reset all nodes
    this.nodes.update(nodes => 
      nodes.map(node => ({
        ...node,
        value: 0
      }))
    );

    // Update timestamp
    this.lastUpdateTime.set(Date.now());
  }

  getNodeValue(node: SignalNode): number {
    switch (node.type) {
      case 'signal':
        return this.currentValue();
      case 'computed':
        return node.id === 2 ? 
          this.computedValue() : 
          Math.pow(this.currentValue(), 2);
      case 'effect':
        return this.effectCount();
      default:
        return 0;
    }
  }

  getNodeState(node: SignalNode): string {
    return `${node.type}-${this.getNodeValue(node)}`;
  }

  updateSignal(node: SignalNode) {
    if (node.type === 'signal') {
      this.incrementSignal();
    }
  }

  getPreviousNode(node: SignalNode): SignalNode {
    const nodes = this.nodes();
    const index = nodes.findIndex(n => n.id === node.id);
    return nodes[index - 1];
  }

  isLineActive(): boolean {
    return Date.now() - this.lastUpdateTime() < 300;
  }

  addNotification(message: string, type: 'success' | 'info') {
    this.activeNotifications.update(notifications => [
      ...notifications,
      { message, type }
    ]);

    setTimeout(() => {
      this.activeNotifications.update(notifications =>
        notifications.filter(n => n.message !== message)
      );
    }, 3000);
  }

  clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
    this.storageValue.set('0');
    this.storageLastUpdated.set('Never');
    this.storageUpdateCount.set(0);
    this.hasStoredValue.set(false);
  }

  // Pizza Example Methods
  addPizza() {
    this.pizzaCount.update(count => count + 1);
  }

  resetOrder() {
    this.pizzaCount.set(0);
    this.kitchenUpdates.set([]);
    this.happyCustomers.set(0);
  }

  // Enhanced Technical Methods
  getNodeById(id: number): SignalNode {
    return this.nodes().find(n => n.id === id) || this.nodes()[0];
  }

  getNodeMetrics(node: SignalNode): SignalMetrics {
    return this.nodeMetrics().get(node.id) || {
      updateCount: 0,
      lastUpdateTime: 0,
      averageUpdateTime: 0,
      peakValue: 0
    };
  }

  animateDataFlow(fromId: number, toId: number) {
    const from = this.getNodeById(fromId);
    const to = this.getNodeById(toId);
    const steps = 20;
    
    for (let i = 0; i <= steps; i++) {
      setTimeout(() => {
        const x = from.position.x + (to.position.x - from.position.x) * (i / steps);
        const y = from.position.y + (to.position.y - from.position.y) * (i / steps);
        
        this.activeParticles.update(particles => [
          ...particles,
          { x: x + 50, y: y + 50 }
        ]);
      }, i * (1000 / steps));
    }

    setTimeout(() => {
      this.activeParticles.update(particles => particles.slice(1));
    }, 1000);
  }

  getUpdateFrequency(): number {
    const metrics = this.nodeMetrics().get(1);
    if (!metrics) return 0;
    const timeWindow = 1000; // 1 second
    return Math.round((metrics.updateCount / timeWindow) * 100) / 100;
  }

  getAverageEffectTime(): number {
    const metrics = this.nodeMetrics().get(4);
    return metrics ? Math.round(metrics.averageUpdateTime) : 0;
  }

  getMemoryUsage(): number {
    // Simulate memory usage based on history size
    const totalHistory = Array.from(this.valueHistory().values())
      .reduce((sum, arr) => sum + arr.length, 0);
    return Math.round(totalHistory * 0.5); // Simulate KB usage
  }

  getSignalChainDepth(): number {
    const findDepth = (nodeId: number, visited = new Set<number>()): number => {
      if (visited.has(nodeId)) return 0;
      visited.add(nodeId);
      
      const node = this.getNodeById(nodeId);
      if (!node.dependencies?.length) return 1;
      
      return 1 + Math.max(...node.dependencies.map(depId => 
        findDepth(depId, visited)
      ));
    };

    return findDepth(4);
  }

  ngOnInit() {
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

  selectNode(node: SignalNode) {
    this.selectedNode.set(node);
  }

  closeInspector() {
    this.selectedNode.set(null);
  }

  // Update multiply method
  multiplySignal() {
    const current = this.currentValue();
    this.currentValue.set(current * 2);
  }

  // Enhanced log method
  private logEffectUpdate(effect: EffectUpdate, duration: number) {
    const timeFromStart = ((Date.now() - this.effectStartTime()) / 1000).toFixed(2);
    
    console.group(`%cEffect Update #${effect.id}`, 'color: #4CAF50; font-weight: bold');
    console.log('Message:', effect.message);
    console.log('Time:', new Date(effect.timestamp).toLocaleTimeString());
    console.log('Duration:', `${duration.toFixed(2)}ms`);
    console.log('Time since start:', `${timeFromStart}s`);
    console.log('Values:', {
      signal: effect.triggerValue,
      computed: effect.computedValue,
      totalEffects: this.effectCount(),
      avgDuration: this.getAverageEffectDuration()
    });
    console.groupEnd();
  }

  // Add helper method to calculate average effect duration
  private getAverageEffectDuration(): number {
    const times = this.effectRunTimes();
    if (times.length === 0) return 0;
    const sum = times.reduce((acc, time) => acc + time, 0);
    return sum / times.length;
  }

  // Add helper methods for effect visualization
  getEffectTime(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    return seconds === 0 ? 'just now' : `${seconds}s ago`;
  }

  getEffectClass(effect: EffectUpdate): string {
    const age = Date.now() - effect.timestamp;
    return age < 1000 ? 'effect-new' : 'effect-old';
  }

  // Helper method to determine action type
  private getActionType(newValue: number): string {
    const prevValue = this.getPreviousValue();
    if (newValue === 0) return "Reset";
    if (newValue === prevValue + 1) return "Increment (+1)";
    if (newValue === prevValue * 2) return "Multiply (×2)";
    return "Value Change";
  }

  // Helper method to get previous value
  private getPreviousValue(): number {
    const effects = this.recentEffects();
    return effects.length > 0 ? effects[0].triggerValue : 0;
  }

  // Helper method to create effect message
  private createEffectMessage(signal: number, double: number, square: number, effectCount: number): string {
    const action = this.getActionType(signal);
    return `Effect #${effectCount}:
• Signal value: ${signal}
• Double value (×2): ${double}
• Square value (n²): ${square}
• Action: ${action}`;
  }

  // Helper method to update all nodes
  private updateAllNodes(signal: number, double: number, square: number, effectCount: number) {
    this.nodes.update(nodes => 
      nodes.map(node => {
        switch (node.type) {
          case 'signal':
            return { ...node, value: signal };
          case 'computed':
            return { 
              ...node, 
              value: node.id === 2 ? double : square 
            };
          case 'effect':
            return { ...node, value: effectCount };
          default:
            return node;
        }
      })
    );
  }
}