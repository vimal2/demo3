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

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ConfirmLeaveGuard } from './guards/confirm-leave.guard';

// Resolvers
import { ProductResolver } from './resolvers/product.resolver';

// Route Configuration
const routes: Routes = [
  // Redirect root to home
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },

  // Basic routes
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home - Angular Routing Demo'
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About - Angular Routing Demo'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login - Angular Routing Demo'
  },

  // Protected route with canActivate and canDeactivate guards
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    canDeactivate: [ConfirmLeaveGuard],
    title: 'Dashboard - Angular Routing Demo'
  },

  // Products with child routes
  {
    path: 'products',
    component: ProductsComponent,
    title: 'Products - Angular Routing Demo',
    children: [
      {
        path: '',
        component: ProductListComponent
      },
      {
        path: ':id',
        component: ProductDetailComponent,
        resolve: {
          product: ProductResolver
        },
        title: 'Product Detail - Angular Routing Demo'
      }
    ]
  },

  // Lazy loaded admin module with canMatch guard
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canMatch: [AdminGuard],
    title: 'Admin - Angular Routing Demo'
  },

  // Wildcard route - must be last
  {
    path: '**',
    component: NotFoundComponent,
    title: '404 Not Found'
  }
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
