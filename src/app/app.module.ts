import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

// Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductDetailComponent } from './components/products/product-detail/product-detail.component';

// Guards (created but not used yet)
// import { AuthGuard } from './guards/auth.guard';
// import { AdminGuard } from './guards/admin.guard';
// import { ConfirmLeaveGuard } from './guards/confirm-leave.guard';

// Resolvers (created but not used yet)
// import { ProductResolver } from './resolvers/product.resolver';

// ============================================
// TODO: Configure routes here
// ============================================
const routes: Routes = [
  // Step 1: Add basic routes
  // { path: 'home', component: HomeComponent },
  // { path: 'about', component: AboutComponent },
  // { path: 'login', component: LoginComponent },

  // Step 2: Add redirect
  // { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Step 3: Add protected route with guard
  // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // Step 4: Add child routes
  // {
  //   path: 'products',
  //   component: ProductsComponent,
  //   children: [
  //     { path: '', component: ProductListComponent },
  //     { path: ':id', component: ProductDetailComponent }
  //   ]
  // },

  // Step 5: Add lazy loaded module
  // {
  //   path: 'admin',
  //   loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
  //   canMatch: [AdminGuard]
  // },

  // Step 6: Add wildcard route (must be last)
  // { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    DashboardComponent,
    NotFoundComponent,
    ProductsComponent,
    ProductListComponent,
    ProductDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
