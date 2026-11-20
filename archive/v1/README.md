# Halo: Directory and ID verification prototype (21081 / 21082)

Open `index.html` in Chrome or Edge. No build step and no server needed. It needs an internet connection for the Inter and Material Symbols fonts.

## What it shows
- **Directory replaces Clients** in the side nav. It lists every company and person as a separate row, with the Reference, Type, Title, Name, Surname, Company, Role, Phone, Email, ID Verified, Address Verified and AML Check columns. You can:
  - filter with All / Clients / Parties, search, and page 25 at a time;
  - select rows and use Invite to Verify ID;
  - open the row menu, which has an **Open matter** list to jump into each matter the person is on.
- **Five matters** cover the matter-header rules from `8135:560930`:

  | Matter | Clients | How the header shows them |
  |---|---|---|
  | A204/3 | 1 client | Status line |
  | A902/4 | 2 clients, one failed | Name layout |
  | S25995/2 | 1 person and 2 companies | Companies show "No associated person(s)" |
  | P3311/1 | 4 clients | Primary in full, the other three by name |
  | C14350/1 | 10 clients | "+ 7 more" and "n checks needed", with the More clients popover and its ID verification summary |

- **Clients and Parties tabs** use the same table structure as the Directory, with Relationship and Address columns. Click a Reference to open that person in the Directory.
- **Invite to Verify ID** can be started from four places:
  - the matter Actions menu: Clients and Parties groups, default ticks, + Add new party;
  - a selection on the Clients or Parties tab;
  - a selection in the Directory;
  - a row's ⋮ menu.

  The dialog lets you edit email and mobile inline, with validation. It shows Sending, then Request Sent, then a snackbar. If a company is selected, the invite is blocked with an error.
- **One shared record:** an invite updates the person everywhere at once — the Directory, every matter header and every tab. Daniel Okafor is a Party on A204/3 and a Client on P3311/1, which demonstrates this.

## Routes
`#/directory` · `#/matters` · `#/matter/<id>/<tab>`, where `<id>` is one of `A204-3`, `A902-4`, `S25995-2`, `P3311-1` or `C14350-1`, and `<tab>` is `summary`, `clients` or `parties` (other tabs show a placeholder). Example: `#/matter/A204-3/parties`.

## Prototype controls (bottom of the side nav)
- **Next send fails:** the next send shows the error footer. It only fails once.
- **Move invites on a step:** moves every check on one step, from Invited to In progress to In review to Verified, so you can watch status tracking (21081) update.
- **Reset data:** changes are saved in the browser. This puts everything back to the starting data.

## Choices made that aren't in the Figma
- Status wording in tables is short: Verified (Passed for AML), Invited, In progress, In review, Failed, Expired and Not checked. Headers and the dialog use the ID status component's full lines.
- The Directory row menu has an "Open matter" list, and the Parties/Clients row menu has "View in Directory". These were added so you can move freely between the Directory and matters.
- A Matters list page was added as the way into the five matters.
- Pressing Send with a missing email or mobile opens that person's inline editor with the error. Send is disabled while an editor is open.
- The Clients tab lists the people linked to a client company as their own rows ("Contact for client").
- All names, numbers, addresses and references are invented placeholder data.

`reference/` holds the Figma frames used.
