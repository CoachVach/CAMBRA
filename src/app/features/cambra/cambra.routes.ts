import { Routes } from '@angular/router';
import { CambraPage } from './pages/cambra-page/cambra-page';
import { Dashboard } from './pages/dashboard/dashboard';
import { GroupList } from './pages/group-list/group-list';
import { GroupDetail } from './pages/group-detail/group-detail';

export const CAMBRA_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'evaluation', component: CambraPage },
  { path: 'groups', component: GroupList },
  { path: 'groups/:id', component: GroupDetail },
];
