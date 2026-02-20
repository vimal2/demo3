import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesHomeComponent } from './components/services-home/services-home.component';
import { StateManagementDemoComponent } from './components/state-management-demo/state-management-demo.component';
import { DiDemoComponent } from './components/di-demo/di-demo.component';
import { RxjsDemoComponent } from './components/rxjs-demo/rxjs-demo.component';

const routes: Routes = [
  {
    path: '',
    component: ServicesHomeComponent
  },
  {
    path: 'state',
    component: StateManagementDemoComponent,
    title: 'State Management - Angular Demo'
  },
  {
    path: 'di',
    component: DiDemoComponent,
    title: 'Dependency Injection - Angular Demo'
  },
  {
    path: 'rxjs',
    component: RxjsDemoComponent,
    title: 'RxJS Operators - Angular Demo'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
