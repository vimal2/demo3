# Angular Routing

This document covers Angular routing concepts with practical examples from this demo project.

## Table of Contents

1. [Introduction](#1-introduction)
2. [Setting Up RouterModule](#2-setting-up-routermodule)
3. [Basic Routes and Router Outlet](#3-basic-routes-and-router-outlet)
4. [Navigation with RouterLink](#4-navigation-with-routerlink)
5. [Route Parameters](#5-route-parameters)
6. [Query Parameters and Fragments](#6-query-parameters-and-fragments)
7. [Programmatic Navigation](#7-programmatic-navigation)
8. [Child (Nested) Routes](#8-child-nested-routes)
9. [Lazy Loading Modules](#9-lazy-loading-modules)
10. [Route Guards](#10-route-guards)
11. [Resolvers](#11-resolvers)
12. [Wildcard Routes and Redirects](#12-wildcard-routes-and-redirects)

---

## 1. Introduction

Angular Router enables navigation between views (components) based on the browser URL. It provides:

- **URL-based navigation**: Each view has a unique URL
- **Browser history integration**: Back/forward buttons work
- **Deep linking**: Users can bookmark and share URLs
- **Lazy loading**: Load modules on demand
- **Guards**: Protect routes with conditions
- **Resolvers**: Pre-fetch data before displaying views

### Prerequisites

Ensure `@angular/router` is installed (included by default in Angular CLI projects):

```bash
npm install @angular/router
```

---

## 2. Setting Up RouterModule

### Option A: Configure Routes Directly in AppModule (Recommended for small apps)

```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  declarations: [/* ... */],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)  // Configure routes directly
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Option B: Separate Routing Module (For larger apps)

Create `app-routing.module.ts`:

```typescript
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

Then import in AppModule:

```typescript
// src/app/app.module.ts
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [BrowserModule, AppRoutingModule],
  // ...
})
export class AppModule { }
```

**Key points:**
- `RouterModule.forRoot(routes)` - Used ONLY in the root module
- `RouterModule.forChild(routes)` - Used in feature modules (lazy loading)

---

## 3. Basic Routes and Router Outlet

### Step 1: Define Routes

Add routes to the routes array:

```typescript
// src/app/app-routing.module.ts
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
```

**Route properties:**
- `path`: URL segment (without leading slash)
- `component`: Component to display
- `redirectTo`: Redirect to another path
- `pathMatch`: 'full' or 'prefix'

### Step 2: Add Router Outlet

Place `<router-outlet>` in your app component template:

```html
<!-- src/app/app.component.html -->
<app-navbar></app-navbar>

<main>
  <router-outlet></router-outlet>
</main>

<footer>...</footer>
```

The router outlet is a placeholder where Angular renders the matched component.

---

## 4. Navigation with RouterLink

### Basic RouterLink

```html
<!-- Static link -->
<a routerLink="/home">Home</a>

<!-- Array syntax (for dynamic segments) -->
<a [routerLink]="['/products', productId]">View Product</a>
```

### RouterLinkActive

Add CSS class to active links:

```html
<!-- src/app/components/navbar/navbar.component.html -->
<nav class="navbar">
  <a routerLink="/home" routerLinkActive="active">Home</a>
  <a routerLink="/about" routerLinkActive="active">About</a>
  <a routerLink="/products" routerLinkActive="active">Products</a>
</nav>
```

**Options:**

```html
<!-- Exact match only -->
<a routerLink="/admin"
   routerLinkActive="active"
   [routerLinkActiveOptions]="{exact: true}">
  Admin Dashboard
</a>
```

### CSS for Active State

```css
/* src/app/components/navbar/navbar.component.css */
.nav-link.active {
  font-weight: bold;
  border-bottom: 2px solid white;
}
```

---

## 5. Route Parameters

Route parameters capture dynamic values from the URL.

### Step 1: Define Route with Parameter

```typescript
// src/app/app-routing.module.ts
const routes: Routes = [
  { path: 'products/:id', component: ProductDetailComponent }
];
```

### Step 2: Navigate with Parameter

```html
<!-- Template -->
<a [routerLink]="['/products', product.id]">View Details</a>
```

### Step 3: Access Parameter in Component

```typescript
// src/app/components/products/product-detail/product-detail.component.ts
import { ActivatedRoute } from '@angular/router';

export class ProductDetailComponent implements OnInit {
  productId: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Method 1: Snapshot (static, won't update if param changes)
    this.productId = +this.route.snapshot.paramMap.get('id')!;

    // Method 2: Observable (reactive, updates when param changes)
    this.route.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
    });
  }
}
```

**When to use each method:**
- **Snapshot**: Component destroyed/recreated on param change
- **Observable**: Same component reused (e.g., next/prev navigation)

---

## 6. Query Parameters and Fragments

### Query Parameters

URL format: `/products?search=laptop&category=Electronics`

#### Setting Query Parameters

```typescript
// src/app/components/products/product-list/product-list.component.ts
import { Router, ActivatedRoute } from '@angular/router';

export class ProductListComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  updateFilters(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.searchTerm || null,
        category: this.selectedCategory || null
      },
      queryParamsHandling: 'merge'  // preserve other params
    });
  }
}
```

#### Reading Query Parameters

```typescript
ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    this.searchTerm = params['search'] || '';
    this.category = params['category'] || '';
  });
}
```

### Fragment (Hash) Navigation

URL format: `/about#features`

#### Setting Fragment

```html
<!-- Template -->
<a routerLink="/about" fragment="features">Go to Features</a>
```

#### Reading Fragment

```typescript
// src/app/components/about/about.component.ts
export class AboutComponent {
  constructor(private route: ActivatedRoute) {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
```

#### Enable Anchor Scrolling

```typescript
// src/app/app-routing.module.ts
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
```

---

## 7. Programmatic Navigation

Use the `Router` service to navigate from code.

### Basic Navigation

```typescript
// src/app/components/not-found/not-found.component.ts
import { Router } from '@angular/router';

export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/home']);
  }

  goToProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }
}
```

### Navigation with Extras

```typescript
// With query parameters
this.router.navigate(['/products'], {
  queryParams: { search: 'laptop', page: 1 }
});

// With fragment
this.router.navigate(['/about'], { fragment: 'features' });

// Relative navigation
this.router.navigate(['../sibling'], { relativeTo: this.route });

// Replace current URL in history
this.router.navigate(['/login'], { replaceUrl: true });
```

### Navigate by URL

```typescript
this.router.navigateByUrl('/products/123?tab=details#reviews');
```

---

## 8. Child (Nested) Routes

Child routes allow components to have their own router outlet.

### Step 1: Define Parent with Children

```typescript
// src/app/app-routing.module.ts
const routes: Routes = [
  {
    path: 'products',
    component: ProductsComponent,
    children: [
      { path: '', component: ProductListComponent },
      { path: ':id', component: ProductDetailComponent }
    ]
  }
];
```

### Step 2: Add Router Outlet to Parent

```html
<!-- src/app/components/products/products.component.html -->
<div class="container">
  <h1>Products</h1>
  <hr>

  <!-- Child routes render here -->
  <router-outlet></router-outlet>
</div>
```

### URL Structure

- `/products` → ProductsComponent + ProductListComponent
- `/products/123` → ProductsComponent + ProductDetailComponent

---

## 9. Lazy Loading Modules

Lazy loading loads modules on demand, improving initial load time.

### Step 1: Create Feature Module

```typescript
// src/app/modules/admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [CommonModule, AdminRoutingModule]
})
export class AdminModule {
  constructor() {
    console.log('AdminModule loaded lazily!');
  }
}
```

### Step 2: Create Feature Routing Module

```typescript
// src/app/modules/admin/admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'users', component: AdminUsersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  // forChild!
  exports: [RouterModule]
})
export class AdminRoutingModule { }
```

### Step 3: Configure Lazy Loading in App Routes

```typescript
// src/app/app-routing.module.ts
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module')
      .then(m => m.AdminModule)
  }
];
```

**Key points:**
- Use `loadChildren` with dynamic import
- Feature module uses `RouterModule.forChild()`
- Module is NOT imported in AppModule
- Check Network tab to see separate chunk file

---

## 10. Route Guards

Guards control access to routes.

### Types of Guards

| Guard | Purpose | Interface |
|-------|---------|-----------|
| `canActivate` | Control route access | `CanActivate` |
| `canDeactivate` | Control leaving a route | `CanDeactivate` |
| `canMatch` | Control lazy loading | `CanMatch` |
| `canActivateChild` | Control child route access | `CanActivateChild` |
| `resolve` | Pre-fetch data | `Resolve` |

### CanActivate Guard (Authentication)

```typescript
// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route, state): boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Redirect to login with return URL
    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
}
```

**Apply to route:**

```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [AuthGuard]
}
```

### CanDeactivate Guard (Unsaved Changes)

```typescript
// src/app/guards/confirm-leave.guard.ts
export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmLeaveGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate): boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
```

**Component implementation:**

```typescript
// src/app/components/dashboard/dashboard.component.ts
export class DashboardComponent implements CanComponentDeactivate {
  hasUnsavedChanges = false;

  canDeactivate(): boolean {
    if (this.hasUnsavedChanges) {
      return confirm('You have unsaved changes. Leave anyway?');
    }
    return true;
  }
}
```

**Apply to route:**

```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [AuthGuard],
  canDeactivate: [ConfirmLeaveGuard]
}
```

### CanMatch Guard (Role-based Lazy Loading)

```typescript
// src/app/guards/admin.guard.ts
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanMatch {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canMatch(route, segments): boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/login']);
    }

    if (!this.authService.isAdmin()) {
      return this.router.createUrlTree(['/dashboard']);
    }

    return true;
  }
}
```

**Apply to lazy-loaded route:**

```typescript
{
  path: 'admin',
  loadChildren: () => import('./modules/admin/admin.module')
    .then(m => m.AdminModule),
  canMatch: [AdminGuard]
}
```

---

## 11. Resolvers

Resolvers pre-fetch data before a route activates.

### Step 1: Create Resolver

```typescript
// src/app/resolvers/product.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';

@Injectable({ providedIn: 'root' })
export class ProductResolver implements Resolve<Product | null> {
  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  resolve(route, state): Product | null {
    const id = Number(route.paramMap.get('id'));
    const product = this.productService.getProductById(id);

    if (product) {
      return product;
    } else {
      this.router.navigate(['/products']);
      return null;
    }
  }
}
```

### Step 2: Apply to Route

```typescript
{
  path: ':id',
  component: ProductDetailComponent,
  resolve: {
    product: ProductResolver  // 'product' is the key
  }
}
```

### Step 3: Access Resolved Data

```typescript
// src/app/components/products/product-detail/product-detail.component.ts
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.product = data['product'];  // Use the key from route config
    });
  }
}
```

---

## 12. Wildcard Routes and Redirects

### Wildcard Route (404)

Catches all unmatched URLs:

```typescript
const routes: Routes = [
  // ... other routes

  // Must be LAST
  { path: '**', component: NotFoundComponent }
];
```

### Redirects

```typescript
const routes: Routes = [
  // Redirect root to home
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Redirect old URLs
  { path: 'old-products', redirectTo: '/products', pathMatch: 'full' },

  // Redirect with prefix match (any URL starting with 'legacy/')
  { path: 'legacy', redirectTo: '/home', pathMatch: 'prefix' }
];
```

**pathMatch options:**
- `'full'`: Entire URL must match the path
- `'prefix'`: URL starts with the path

---

## Quick Reference

### Route Configuration

```typescript
{
  path: 'example/:id',           // URL segment
  component: ExampleComponent,   // Component to render
  title: 'Page Title',          // Browser tab title
  redirectTo: '/other',         // Redirect target
  pathMatch: 'full',            // Match strategy
  children: [],                 // Child routes
  loadChildren: () => import(), // Lazy loading
  canActivate: [Guard],         // Entry guard
  canDeactivate: [Guard],       // Exit guard
  canMatch: [Guard],            // Lazy load guard
  resolve: { key: Resolver },   // Data resolver
  data: { custom: 'value' }     // Static data
}
```

### Router Service Methods

```typescript
router.navigate(['/path', param], options);
router.navigateByUrl('/full/url');
router.url;                      // Current URL
router.events.subscribe();       // Navigation events
```

### ActivatedRoute Properties

```typescript
route.paramMap        // Route parameters
route.queryParamMap   // Query parameters
route.fragment        // URL fragment
route.data            // Resolved data + static data
route.url             // URL segments
route.outlet          // Router outlet name
route.parent          // Parent route
route.children        // Child routes
```

---

## Demo Application Structure

```
src/app/
├── app.module.ts              # Routes configured here
├── app.component.ts/html/css
├── components/
│   ├── navbar/           # Navigation with routerLink
│   ├── home/             # Basic route
│   ├── about/            # Fragment navigation
│   ├── login/            # Query params (returnUrl)
│   ├── dashboard/        # Protected + canDeactivate
│   ├── not-found/        # Wildcard route
│   └── products/
│       ├── product-list/   # Query params demo
│       └── product-detail/ # Route params + resolver
├── modules/
│   └── admin/            # Lazy loaded module
├── services/
│   ├── auth.service.ts   # Mock authentication
│   └── product.service.ts
├── guards/
│   ├── auth.guard.ts     # canActivate
│   ├── admin.guard.ts    # canMatch
│   └── confirm-leave.guard.ts  # canDeactivate
└── resolvers/
    └── product.resolver.ts
```

---

## Running the Demo

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Open browser
http://localhost:4200
```

### Testing Features

1. **Basic Routing**: Click nav links (Home, About, Products)
2. **Route Params**: Click on any product to see `/products/:id`
3. **Query Params**: Use filters on Products page
4. **Fragments**: Click section links on About page
5. **Programmatic Nav**: Use buttons on Product Detail page
6. **Guards**: Try accessing Dashboard without login
7. **CanDeactivate**: Type in Dashboard notes, then navigate away
8. **Lazy Loading**: Login as Admin, check Network tab when accessing Admin
9. **404**: Navigate to any invalid URL

---

## References

- [Angular Router Documentation](https://angular.io/guide/router)
- [Route Guards](https://angular.io/guide/router#milestone-5-route-guards)
