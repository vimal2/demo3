import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsHomeComponent } from './components/forms-home/forms-home.component';
import { TemplateFormsDemoComponent } from './components/template-forms-demo/template-forms-demo.component';
import { ReactiveFormsDemoComponent } from './components/reactive-forms-demo/reactive-forms-demo.component';
import { AdvancedFormsDemoComponent } from './components/advanced-forms-demo/advanced-forms-demo.component';
import { EnvironmentDemoComponent } from './components/environment-demo/environment-demo.component';

const routes: Routes = [
  {
    path: '',
    component: FormsHomeComponent
  },
  {
    path: 'template',
    component: TemplateFormsDemoComponent,
    title: 'Template-Driven Forms - Angular Demo'
  },
  {
    path: 'reactive',
    component: ReactiveFormsDemoComponent,
    title: 'Reactive Forms - Angular Demo'
  },
  {
    path: 'advanced',
    component: AdvancedFormsDemoComponent,
    title: 'Advanced Forms - Angular Demo'
  },
  {
    path: 'environment',
    component: EnvironmentDemoComponent,
    title: 'Environment Config - Angular Demo'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
