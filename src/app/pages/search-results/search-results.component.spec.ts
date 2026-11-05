import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { SearchResultsComponent } from './search-results.component';
import { GithubUserService } from '../../services/github-user.service';
import { GithubUser } from '../../models/github-user.model';

const USERS: GithubUser[] = [
  { id: 583231, login: 'octocat', html_url: 'https://github.com/octocat' },
  { id: 1024, login: 'octo-dev', html_url: 'https://github.com/octo-dev' },
  { id: 777, login: 'Doctor-Who', html_url: 'https://github.com/Doctor-Who' },
];

describe('SearchResultsComponent', () => {
  let harness: RouterTestingHarness;
  let serviceSpy: jasmine.SpyObj<GithubUserService>;
  let el: HTMLElement;

  const table = () => el.querySelector<HTMLTableElement>('[data-testid="results-table"]');
  const rows = () => Array.from(el.querySelectorAll<HTMLTableRowElement>('[data-testid="result-row"]'));
  const cells = (row: HTMLTableRowElement) => Array.from(row.querySelectorAll('td'));
  const logins = () => rows().map((r) => cells(r)[1].textContent!.trim());

  async function filter(text: string): Promise<void> {
    const field = el.querySelector<HTMLInputElement>('[data-testid="filter-input"]')!;
    field.value = text;
    field.dispatchEvent(new Event('input'));
    harness.detectChanges();
    await harness.fixture.whenStable();
    harness.detectChanges();
  }

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj<GithubUserService>('GithubUserService', ['searchUsers']);
    serviceSpy.searchUsers.and.returnValue(of(USERS));
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'results', component: SearchResultsComponent }]),
        { provide: GithubUserService, useValue: serviceSpy },
      ],
    });
    harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/results?q=octocat', SearchResultsComponent);
    await harness.fixture.whenStable();
    harness.detectChanges();
    el = harness.routeNativeElement as HTMLElement;
  });

  it('renders a table with User ID, Username and Profile URL columns and one row per user', () => {
    const headers = Array.from(table()!.querySelectorAll('th')).map((th) => th.textContent!.trim());
    expect(headers).toEqual(['User ID', 'Username', 'Profile URL']);
    expect(rows().length).toBe(3);

    const [id, login, url] = cells(rows()[0]);
    expect(id.textContent!.trim()).toBe('583231');
    expect(login.textContent!.trim()).toBe('octocat');
    expect(url.querySelector('a')!.getAttribute('href')).toBe('https://github.com/octocat');
  });

  it('filters the table rows by the text typed in the filter input', async () => {
    await filter('dev');
    expect(logins()).toEqual(['octo-dev']);
  });

  it('searches with the "q" query param once and does not refetch while filtering', async () => {
    expect(serviceSpy.searchUsers).toHaveBeenCalledOnceWith('octocat');
    await filter('dev');
    expect(serviceSpy.searchUsers).toHaveBeenCalledTimes(1);
  });

  it('filter matches any field, including partial user ID and profile URL', async () => {
    await filter('102');
    expect(logins()).toEqual(['octo-dev']);
    await filter('github.com/octocat');
    expect(logins()).toEqual(['octocat']);
  });

  it('filter is case-insensitive, handles no matches, and restores all rows when cleared', async () => {
    await filter('DOCTOR');
    expect(logins()).toEqual(['Doctor-Who']);
    await filter('no-such-user');
    expect(rows().length).toBe(0);
    await filter('');
    expect(rows().length).toBe(3);
  });
});
