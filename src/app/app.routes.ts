import { Routes } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';

// Route paths are part of the assignment contract (see README). Do not rename them.
export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'results', component: SearchResultsComponent },
];
