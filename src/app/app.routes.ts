import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cambra',
    pathMatch: 'full',
  },
  {
    path: 'cambra',
    loadChildren: () =>
      import('./features/cambra/cambra.routes').then(
        (m) => m.CAMBRA_ROUTES
      ),
  },
];
