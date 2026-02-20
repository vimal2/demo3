import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesHomeComponent } from './components/services-home/services-home.component';
import { StateManagementDemoComponent } from './components/state-management-demo/state-management-demo.component';
import { DiDemoComponent } from './components/di-demo/di-demo.component';
import { RxjsDemoComponent } from './components/rxjs-demo/rxjs-demo.component';
import { APP_CONFIG, DEFAULT_APP_CONFIG } from './tokens/config.token';

@NgModule({
  declarations: [
    ServicesHomeComponent,
    StateManagementDemoComponent,
    DiDemoComponent,
    RxjsDemoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ServicesRoutingModule
  ],
  providers: [
    { provide: APP_CONFIG, useValue: DEFAULT_APP_CONFIG }
  ]
})
export class ServicesModule {
  constructor() {
    console.log('ServicesModule loaded lazily!');
  }
}
