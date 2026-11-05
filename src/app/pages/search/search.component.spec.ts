import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SearchComponent } from './search.component';

@Component({ template: '' })
class StubResultsComponent {}

describe('SearchComponent', () => {
  let fixture: ComponentFixture<SearchComponent>;
  let el: HTMLElement;
  let location: Location;

  const input = () => el.querySelector<HTMLInputElement>('[data-testid="search-input"]');
  const button = () => el.querySelector<HTMLButtonElement>('[data-testid="search-button"]');
  const error = () => el.querySelector<HTMLElement>('[data-testid="validation-error"]');

  async function search(value: string): Promise<void> {
    const field = input()!;
    field.value = value;
    field.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    button()!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        provideRouter([
          { path: '', component: SearchComponent },
          { path: 'results', component: StubResultsComponent },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(SearchComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('renders a search input and a search button', () => {
    expect(input()).not.toBeNull();
    expect(button()).not.toBeNull();
  });

  it('shows a validation error and does not navigate when the username is invalid', async () => {
    expect(error()).toBeNull();
    await search('john doe');
    expect(error()).not.toBeNull();
    expect(error()!.textContent!.trim().length).toBeGreaterThan(0);
    expect(location.path()).toBe('');
  });

  it('navigates to /results with the username as the "q" query param when valid', async () => {
    await search('john-doe');
    expect(error()).toBeNull();
    expect(location.path()).toBe('/results?q=john-doe');
  });
});
