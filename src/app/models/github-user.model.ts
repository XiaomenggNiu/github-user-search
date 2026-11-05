/**
 * A GitHub user as displayed by this app.
 * Field names match the GitHub Search Users API response items.
 */
export interface GithubUser {
  id: number;
  login: string;
  html_url: string;
}
