import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Observable, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface Subscriber {
  id: number;
  feed: string[];
}

interface ChatParticipant {
  id: number;
  messages: string[];
}

@Component({
  selector: 'app-observable-vs-subject',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="comparison-container">
      <h2>Understanding Observables and Subjects</h2>

      <!-- Technical Explanation -->
      <div class="theory-section">
        <div class="concept-card">
          <h3>Observable (Unicast)</h3>
          <div class="definition">
            <p>An Observable is a unicast data stream that executes independently for each subscriber.</p>
            <ul>
              <li>Creates new data stream for each subscriber</li>
              <li>Lazy evaluation - starts only when subscribed</li>
              <li>Producer of data only</li>
              <li>Immutable data flow</li>
            </ul>
          </div>
        </div>

        <div class="concept-card">
          <h3>Subject (Multicast)</h3>
          <div class="definition">
            <p>A Subject is a multicast data stream that shares execution among all subscribers.</p>
            <ul>
              <li>Broadcasts to all subscribers</li>
              <li>Both producer and consumer</li>
              <li>Shares same data stream</li>
              <li>Active immediately</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Interactive Demos -->
      <div class="demo-section">
        <h3>Interactive Demonstrations</h3>
        
        <!-- News Feed Demo -->
        <div class="demo-card">
          <h4>News Service Example</h4>
          <p class="explanation">
            Observable: Each subscriber gets complete news history (like loading a news app)
          </p>
          <div class="demo-controls">
            <button (click)="startNewsFeedDemo()">Start News Feed</button>
            <button (click)="addNewsSubscriber()">Add New Reader</button>
          </div>
          <div class="subscribers-grid">
            <div class="subscriber-box" *ngFor="let sub of newsSubscribers">
              <h5>Reader {{ sub.id }}</h5>
              <div class="message" *ngFor="let news of sub.feed">{{ news }}</div>
            </div>
          </div>
        </div>

        <!-- Live Chat Demo -->
        <div class="demo-card">
          <h4>Live Chat Example</h4>
          <p class="explanation">
            Subject: Subscribers only see messages after joining (like a chat room)
          </p>
          <div class="demo-controls">
            <input [(ngModel)]="newMessage" 
                   placeholder="Type a message..."
                   (keyup.enter)="sendChatMessage()">
            <button (click)="sendChatMessage()">Send</button>
            <button (click)="addChatParticipant()">Add Participant</button>
          </div>
          <div class="subscribers-grid">
            <div class="subscriber-box" *ngFor="let participant of chatParticipants">
              <h5>User {{ participant.id }}</h5>
              <div class="message" *ngFor="let msg of participant.messages">{{ msg }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Use Cases -->
      <div class="use-cases-section">
        <h3>When to Use What?</h3>
        
        <div class="use-case-grid">
          <div class="use-case-card">
            <h4>Use Observable When:</h4>
            <ul>
              <li>Each subscriber needs fresh data</li>
              <li>HTTP requests</li>
              <li>Form value changes</li>
              <li>Timer or interval operations</li>
              <li>Data transformations</li>
            </ul>
          </div>

          <div class="use-case-card">
            <h4>Use Subject When:</h4>
            <ul>
              <li>Broadcasting events</li>
              <li>Chat applications</li>
              <li>Notifications</li>
              <li>Global state management</li>
              <li>Real-time updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .comparison-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .theory-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .concept-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .definition ul {
      list-style-type: none;
      padding: 0;
    }

    .definition li {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
    }

    .demo-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      margin: 2rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .demo-controls {
      display: flex;
      gap: 1rem;
      margin: 1rem 0;
    }

    .subscribers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .subscriber-box {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      min-height: 150px;
    }

    .message {
      padding: 0.5rem;
      margin: 0.5rem 0;
      background: white;
      border-radius: 4px;
      border-left: 4px solid #3498db;
    }

    input {
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      flex: 1;
    }

    button {
      padding: 0.8rem 1.5rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background: #2980b9;
    }

    .use-case-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 1rem;
    }

    .use-case-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class ObservableVsSubjectComponent implements OnDestroy {
  private subscriptions = new Subscription();
  private chatSubject = new Subject<string>();
  private newsObservable: Observable<string>;

  newsSubscribers: Subscriber[] = [];
  chatParticipants: ChatParticipant[] = [];
  newMessage = '';

  constructor() {
    this.newsObservable = new Observable<string>(subscriber => {
      const news = [
        'Breaking: TypeScript 5.0 Released',
        'Angular Announces New Features',
        'RxJS Best Practices Published',
        'Web Development Trends 2024'
      ];

      news.forEach((item, index) => {
        setTimeout(() => {
          subscriber.next(item);
          if (index === news.length - 1) {
            subscriber.complete();
          }
        }, index * 1500);
      });
    });
  }

  startNewsFeedDemo(): void {
    this.newsSubscribers = [];
    this.addNewsSubscriber();
  }

  addNewsSubscriber(): void {
    const newSubscriber: Subscriber = {
      id: this.newsSubscribers.length + 1,
      feed: []
    };
    this.newsSubscribers.push(newSubscriber);

    this.subscriptions.add(
      this.newsObservable.subscribe(news => {
        newSubscriber.feed.push(news);
      })
    );
  }

  addChatParticipant(): void {
    const newParticipant: ChatParticipant = {
      id: this.chatParticipants.length + 1,
      messages: []
    };
    this.chatParticipants.push(newParticipant);

    this.subscriptions.add(
      this.chatSubject.subscribe(message => {
        newParticipant.messages.push(message);
      })
    );
  }

  sendChatMessage(): void {
    if (this.newMessage.trim()) {
      this.chatSubject.next(this.newMessage);
      this.newMessage = '';
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.chatSubject.complete();
  }
} 