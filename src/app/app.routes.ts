import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'intro', pathMatch: 'full' },
  { 
    path: 'intro',
    loadComponent: () => import('./components/intro.component').then(m => m.IntroComponent)
  },
  { 
    path: 'rxjs-tutorial',
    loadComponent: () => import('./components/rxjs-tutorial.component').then(m => m.RxJSTutorialComponent)
  },
  { 
    path: 'observable-vs-subject',
    loadComponent: () => import('./components/observable-vs-subject.component').then(m => m.ObservableVsSubjectComponent)
  },
  { 
    path: 'observer-pattern',
    loadComponent: () => import('./components/observer-pattern.component').then(m => m.ObserverPatternComponent)
  },
  { 
    path: 'observable-demo',
    loadComponent: () => import('./components/observable-demo.component').then(m => m.ObservableDemoComponent)
  },
  { 
    path: 'signals-deep-dive',
    loadComponent: () => import('./components/signals-deep-dive.component').then(m => m.SignalsDeepDiveComponent)
  },
  { 
    path: 'signals-vs-rxjs',
    loadComponent: () => import('./components/signals-vs-rxjs.component').then(m => m.SignalsVsRxJSComponent)
  },
  { 
    path: 'signals-animated',
    loadComponent: () => import('./components/signals-animated.component').then(m => m.SignalsAnimatedComponent)
  },
  { 
    path: 'code-examples',
    loadComponent: () => import('./components/code-examples.component').then(m => m.CodeExamplesComponent)
  },
  // Catch all route for unmatched paths
  { path: '**', redirectTo: 'intro' }
];