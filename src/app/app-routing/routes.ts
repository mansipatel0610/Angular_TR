import { Routes } from "@angular/router";

import { AboutComponent } from '../about/about.component';
import { DishDetailComponent } from '../dish-detail/dish-detail.component';
import { MenuComponent } from '../menu/menu.component';
import { HomeComponent } from '../home/home.component';
import { ContactComponent } from '../contact/contact.component';

export const routes: Routes = [
    { path: 'home',  component: HomeComponent },
    { path: 'menu',     component: MenuComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
  ];