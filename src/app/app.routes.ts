import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page';
import { TypeList } from './components/type-list/type-list';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'type/:name',
    component: TypeList,
  },
  {
    path: '404',
    component: NotFound,
  },
  {
    path: '**',
    component: NotFound,
  },
];
