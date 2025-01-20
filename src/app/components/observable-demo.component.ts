import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, timer } from 'rxjs';
import { map, take, takeUntil, filter } from 'rxjs/operators';

type Operator = 'map' | 'filter' | 'both';

@Component({
  selector: 'app-observable-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container">
      <h2>RxJS Operators</h2>

      <!-- Operator Selection & Tutorial -->
      <div class="tutorial-section">
        <div class="operator-controls">
          <button (click)="selectOperator('map')" 
                  [class.active]="selectedOperator === 'map'">Map</button>
          <button (click)="selectOperator('filter')" 
                  [class.active]="selectedOperator === 'filter'">Filter</button>
          <button (click)="selectOperator('both')" 
                  [class.active]="selectedOperator === 'both'">Both</button>
        </div>

        <div class="tutorial-box">
          <div class="tutorial-title">{{ getTutorialTitle() }}</div>
          <div class="tutorial-description">{{ getTutorialDescription() }}</div>
          <div class="tutorial-code">{{ getTutorialCode() }}</div>
        </div>
      </div>
      
      <div class="stream-section">
        <h3>Input Stream</h3>
        <div class="stream-line">
          <div class="marble" 
               *ngFor="let value of inputValues"
               [style.left.%]="(value / 20) * 100">
            {{ value }}
          </div>
        </div>
      </div>

      <div class="operator-section">
        <div class="operator-box">
          <div class="operator-title">{{ selectedOperator }}</div>
          <div class="operator-code">
            {{ showFilter ? 'x => x % 2 === 1' : '' }}
            {{ showMap ? 'x => x * ' + multiplierValue : '' }}
          </div>
        </div>
      </div>

      <div class="stream-section">
        <h3>Output Stream</h3>
        <div class="stream-line">
          <div class="marble" 
               *ngFor="let value of outputValues"
               [style.left.%]="getOutputPosition(value)">
            {{ value }}
          </div>
        </div>
      </div>

      <div class="controls">
        <div class="playback-controls">
          <button (click)="start()" [disabled]="isRunning">Start</button>
          <button (click)="pause()" [disabled]="!isRunning">Pause</button>
          <button (click)="reset()">Reset</button>
        </div>

        <div class="multiplier-control" *ngIf="showMap">
          <label>Multiplier: 
            <input type="number" 
                   [(ngModel)]="multiplierValue" 
                   (ngModelChange)="updateMultiplier($event)"
                   min="1" 
                   max="10">
          </label>
        </div>
      </div>

      <div class="current-operation" *ngIf="currentStep">
        <div class="operation-title">Current Operation:</div>
        <div class="operation-detail">{{ currentStep }}</div>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .stream-section {
      margin: 2rem 0;
    }

    .stream-line {
      height: 80px;
      border-bottom: 2px solid #3498db;
      position: relative;
      margin: 1rem 0;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .marble {
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      transform: translate(-50%, -50%);
      top: 50%;
      transition: all 0.3s ease-out;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .marble:nth-child(5n+1) { background-color: #e74c3c; }
    .marble:nth-child(5n+2) { background-color: #f1c40f; }
    .marble:nth-child(5n+3) { background-color: #2ecc71; }
    .marble:nth-child(5n+4) { background-color: #3498db; }
    .marble:nth-child(5n+5) { background-color: #9b59b6; }

    .operator-section {
      margin: 2rem 0;
      padding: 1rem;
      background: #34495e;
      color: white;
      border-radius: 4px;
    }

    .operator-title {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }

    .operator-code {
      font-family: monospace;
      background: rgba(255,255,255,0.1);
      padding: 0.5rem;
      border-radius: 4px;
    }

    .controls {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 2rem;
    }

    .operator-controls, .playback-controls {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    button {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 4px;
      background: #3498db;
      color: white;
      cursor: pointer;
      transition: all 0.3s;
    }

    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    button.active {
      background: #2980b9;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .multiplier-control {
      text-align: center;
      margin-top: 1rem;
    }

    .multiplier-control input {
      width: 60px;
      padding: 0.5rem;
      margin-left: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    h2, h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .tutorial-section {
      margin: 2rem 0;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #3498db;
    }

    .tutorial-box {
      margin-top: 1.5rem;
    }

    .tutorial-title {
      font-size: 1.2rem;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .tutorial-description {
      color: #34495e;
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    .tutorial-code {
      font-family: monospace;
      background: #34495e;
      color: white;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 0.5rem;
    }

    .current-operation {
      margin-top: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid #2ecc71;
    }

    .operation-title {
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .operation-detail {
      color: #34495e;
      font-family: monospace;
    }
  `]
})
export class ObservableDemoComponent implements OnDestroy {
  selectedOperator: Operator = 'map';
  multiplierValue = 2;
  currentStep = '';
  inputValues: number[] = [];
  outputValues: number[] = [];
  isRunning = false;
  private destroy$ = new Subject<void>();
  private interval: any;

  get showMap(): boolean {
    return this.selectedOperator === 'map' || this.selectedOperator === 'both';
  }

  get showFilter(): boolean {
    return this.selectedOperator === 'filter' || this.selectedOperator === 'both';
  }

  selectOperator(operator: Operator) {
    this.selectedOperator = operator;
    this.reset();
  }

  start() {
    this.isRunning = true;
    this.inputValues = [];
    this.outputValues = [];

    this.interval = timer(0, 1000).pipe(
      take(20),
      map(value => Number(value)),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      // Add new value to input stream
      this.inputValues.push(value);

      // Process the value based on selected operators
      let outputValue = value;
      let shouldOutput = true;

      // Apply filter if active
      if (this.showFilter) {
        shouldOutput = value % 2 === 1;
        this.currentStep = shouldOutput 
          ? `${value} is odd ✅ Passes filter`
          : `${value} is even ❌ Filtered out`;
      }

      // Apply map if active and value passed filter
      if (shouldOutput && this.showMap) {
        outputValue = value * this.multiplierValue;
        this.currentStep = this.showFilter
          ? `${this.currentStep}\nThen multiplied by ${this.multiplierValue} = ${outputValue}`
          : `${value} multiplied by ${this.multiplierValue} = ${outputValue}`;
      }

      // Add to output if value passed operators
      if (shouldOutput) {
        this.outputValues.push(outputValue);
      }

      // Keep only last 10 values
      if (this.inputValues.length > 10) {
        this.inputValues = this.inputValues.slice(-10);
        this.outputValues = this.outputValues.slice(-10);
      }
    });
  }

  updateMultiplier(value: number) {
    this.multiplierValue = value;
    if (this.isRunning) {
      // Recalculate all outputs with new multiplier
      this.outputValues = this.inputValues
        .filter(v => !this.showFilter || v % 2 === 1)
        .map(v => this.showMap ? v * this.multiplierValue : v);
    }
  }

  getOutputPosition(value: number): number {
    if (this.showMap) {
      // For mapped values, adjust position based on original value
      return ((value / this.multiplierValue) / 20) * 100;
    }
    // For filtered values, use value directly
    return (value / 20) * 100;
  }

  getMarbleColor(value: number): string {
    const colors = [
      '#e74c3c', // red
      '#f1c40f', // yellow
      '#2ecc71', // green
      '#3498db', // blue
      '#9b59b6'  // purple
    ];
    return colors[Math.abs(value) % colors.length];
  }

  pause() {
    if (this.interval) {
      this.interval.unsubscribe();
    }
    this.isRunning = false;
  }

  reset() {
    this.pause();
    this.inputValues = [];
    this.outputValues = [];
    this.currentStep = '';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTutorialTitle(): string {
    switch(this.selectedOperator) {
      case 'map':
        return 'Map Operator - Transform Values';
      case 'filter':
        return 'Filter Operator - Select Values';
      case 'both':
        return 'Operator Chaining - Filter then Map';
      default:
        return '';
    }
  }

  getTutorialDescription(): string {
    switch(this.selectedOperator) {
      case 'map':
        return 'The map operator transforms each value in the stream using a given function. In this example, we multiply each value by a number.';
      case 'filter':
        return 'The filter operator only allows values that satisfy a condition to pass through. Here, we only allow odd numbers to continue in the stream.';
      case 'both':
        return 'Operators can be chained together. In this example, we first filter for odd numbers, then multiply the results by our multiplier.';
      default:
        return '';
    }
  }

  getTutorialCode(): string {
    switch(this.selectedOperator) {
      case 'map':
        return `stream$.pipe(
  map(x => x * ${this.multiplierValue})
)`;
      case 'filter':
        return `stream$.pipe(
  filter(x => x % 2 === 1)
)`;
      case 'both':
        return `stream$.pipe(
  filter(x => x % 2 === 1),
  map(x => x * ${this.multiplierValue})
)`;
      default:
        return '';
    }
  }
} 