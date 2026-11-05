import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GithubUser } from '../models/github-user.model';

@Injectable({ providedIn: 'root' })
export class GithubUserService {
  /**
   * Searches GitHub users whose username contains `query`.
   */
  searchUsers(query: string): Observable<GithubUser[]> {
    // TODO: implement
    throw new Error('Not implemented');
  }
}
