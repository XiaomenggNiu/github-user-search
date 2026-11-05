import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GithubUserService } from './github-user.service';
import { GithubUser } from '../models/github-user.model';

describe('GithubUserService', () => {
  it('calls the GitHub search users API and emits the response items', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const service = TestBed.inject(GithubUserService);
    const httpMock = TestBed.inject(HttpTestingController);

    let result: GithubUser[] | undefined;
    service.searchUsers('octo').subscribe((users) => (result = users));

    const req = httpMock.expectOne((r) => r.urlWithParams === 'https://api.github.com/search/users?q=octo');
    expect(req.request.method).toBe('GET');
    req.flush({
      total_count: 2,
      incomplete_results: false,
      items: [
        { id: 583231, login: 'octocat', html_url: 'https://github.com/octocat', type: 'User' },
        { id: 1024, login: 'octo-dev', html_url: 'https://github.com/octo-dev', type: 'User' },
      ],
    });

    expect(result!.length).toBe(2);
    expect(result![1]).toEqual(
      jasmine.objectContaining({ id: 1024, login: 'octo-dev', html_url: 'https://github.com/octo-dev' }),
    );
    httpMock.verify();
  });
});
