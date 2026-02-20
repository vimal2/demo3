import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { FormsRoutingModule } from './forms-routing.module';
import { FormsHomeComponent } from './components/forms-home/forms-home.component';
import { TemplateFormsDemoComponent } from './components/template-forms-demo/template-forms-demo.component';
import { ReactiveFormsDemoComponent } from './components/reactive-forms-demo/reactive-forms-demo.component';
import { AdvancedFormsDemoComponent } from './components/advanced-forms-demo/advanced-forms-demo.component';
import { EnvironmentDemoComponent } from './components/environment-demo/environment-demo.component';

@NgModule({
  declarations: [
    FormsHomeComponent,
    TemplateFormsDemoComponent,
    ReactiveFormsDemoComponent,
    AdvancedFormsDemoComponent,
    EnvironmentDemoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormsRoutingModule
  ]
})
export class FormsFeatureModule {
  constructor() {
    console.log('FormsFeatureModule loaded lazily!');
  }
}
