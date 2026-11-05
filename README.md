## Requirements

### 1. Search page

- When the user opens the website (route `/`), they see a text input and a **Search** button.
- The input accepts a GitHub username.

### 2. Username validation

A GitHub username is valid only if it:

- is not empty, and
- contains **only** alphanumeric characters (`a–z`, `A–Z`, `0–9`) or hyphens (`-`).

Any other character (spaces, underscores, dots, symbols, non-ASCII letters, etc.) makes it invalid. The input value is validated as typed; it is not trimmed.

### 3. Searching

When the Search button is clicked, validate the input.

- **If the input is invalid:** show a validation error message on the search page. Do not navigate and do not call the API.
- **If the input is valid:** go to the search results page at `/results?q=<username>`. Any previously shown validation error must no longer be displayed.

The search results page queries GitHub for users whose username contains the searched text, using:

```
GET https://api.github.com/search/users?q=<username>
```

The users are in the `items` array of the response. See the [GitHub Search Users API docs](https://docs.github.com/en/rest/search/search#search-users).

### 4. Search results page

Display the results on the search results page (route `/results`) in a simple table, one row per user, in the order the API returns them.

### 5. Table columns

The table must have exactly these columns, in this order:

| Header text   | Content                                                   |
| ------------- | --------------------------------------------------------- |
| `User ID`     | the user's `id`                                           |
| `Username`    | the user's `login`                                        |
| `Profile URL` | a link (`<a>`) whose `href` and visible text are the user's `html_url` |

### 6. Filter

Add a filter input on the search results page.

- As the user types, the table shows only the rows where **any** field (User ID, Username or Profile URL) contains the typed text.
- Matching is case-insensitive and matches text anywhere in the field (including partial IDs, e.g. `102` matches ID `1024`).
- An empty filter shows all rows.
- Filtering works on the results already loaded; it must not call the API again.


### Required `data-testid` attributes

| Page    | Element                                  | `data-testid`       |
| ------- | ---------------------------------------- | ------------------- |
| Search  | username input                           | `search-input`      |
| Search  | search button                            | `search-button`     |
| Search  | validation error message (only rendered when there is an error) | `validation-error`  |
| Results | the `<table>`                            | `results-table`     |
| Results | each data row (`<tr>`)                   | `result-row`        |
| Results | filter input                             | `filter-input`      |

Column headers must be `<th>` elements and row cells must be `<td>` elements, in the column order listed above.

---

## Rules

- Do **not** modify any `*.spec.ts` file.
- Keep the technical contract above intact.
- Wire up any providers your solution needs.
- You may use any Angular feature (template-driven or reactive forms, signals, RxJS, etc.).
- No third-party UI or table libraries.
- Styling is optional; a clean, usable layout is a plus.
