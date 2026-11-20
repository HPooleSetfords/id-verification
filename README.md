# Halo: Directory and ID verification prototype (21081 / 21082)

Open `index.html` in Chrome or Edge. No build step and no server needed. It needs an internet connection for the Inter and Material Symbols fonts.

## What it shows
- **Dashboard** (the landing page) is rebuilt from the 20725 User Preferences - Dashboard prototype: Bills & Payments, PAF Deadline, Recent Matters / Recent Clients, Upcoming activities, Recent PAFs and Time Recordings. Recent Matters lists the matters you've opened most recently and opens them. Recent Clients shows each client's ID status and opens them in the Directory. Customise Layout isn't repeated here; it lives in the 20725 prototype.
- **Matters** is rebuilt from the 24520 Permanent Document Preview prototype:
  - the **open-matter tab strip**: All Matters plus a tab for every matter you open. Tabs remember which matter tab (e.g. Parties) you were on. × closes a tab, + opens a searchable picker, and hovering a tab shows its details (3s the first time, then 0.5s);
  - a **search box** at the start of the toolbar (reference, description, any client's name, type, status or fee earner), styled on the 24520 toolbar search, since the side panel that held search was removed;
  - the **matters table**: favourite hearts, All / Open / Favourite / Recent / Closing / Closed / Reopening, and a row menu (also on right-click) with View in new tab, View in new window and Invite to Verify ID.
  The matter pages sit inside the same connected panel, under the tab strip.
- **Directory replaces Clients** in the side nav. It lists every company and person as a separate row, with the Reference, Type, Title, Name, Surname, Company, Role, Phone, Email, ID Verified, Address Verified and AML Check columns. You can:
  - filter with All / Clients / Parties, search, and page 25 at a time;
  - narrow it with the **Filters** popover (Figma `8428:362213`): Type, ID Status, Address Status and AML Status. Reset and Apply stay disabled until something changes; applied filters show as removable chips with Clear all, and a count on the Filters button;
  - select rows and use Invite to Verify ID;
  - open the row menu, which has an **Open matter** list to jump into each matter the person is on.
- **17 matters.** Five of them cover the matter-header rules from `8135:560930`; the other twelve come from the 24520 matters list and give the tabs and filters something to work with:

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
`#/dashboard` · `#/directory` · `#/matters` · `#/matter/<id>/<tab>`, where `<id>` is the reference with `-` for `/` (e.g. `A204-3`, `C14350-1`, `A25-1`), and `<tab>` is `summary`, `clients` or `parties` (other tabs show a placeholder). Example: `#/matter/A204-3/parties`.

## Resetting
Changes (invites, favourites, open tabs) are saved in the browser. Open `index.html#/reset` to put everything back to the starting data.

## Choices made that aren't in the Figma
- Estate agents don't need an ID check. A person whose only role is Estate Agent shows — in every status column (matter tabs and Directory), is left out of the invite dialog, and can't be selected for an invite.
- The Clients and Parties tabs don't show counts, and Add Party is disabled.
- Directory filters are single-choice dropdowns with an Any option. Applied filters show as chips under the toolbar. Choosing a status hides companies, which have no ID checks.
- The 24520 Client Matters side panel is left out of the Matters pages (removed at Harry's request).
- Status wording in tables is short: Verified (Passed for AML), Invited, In progress, In review, Failed, Expired and Not checked. Headers and the dialog use the ID status component's full lines.
- The Directory row menu has an "Open matter" list, and the Parties/Clients row menu has "View in Directory". These were added so you can move freely between the Directory and matters.
- The matters-list row menu gains Invite to Verify ID under the two 24520 items.
- The Recent Clients tab on the Dashboard is populated (it's empty in 20725) so it can show ID status and link to the Directory.
- Pressing Send with a missing email or mobile opens that person's inline editor with the error. Send is disabled while an editor is open.
- The Clients tab lists the people linked to a client company as their own rows ("Contact for client").
- All names, numbers, addresses and references are invented placeholder data.

`reference/` holds the Figma frames used. `archive/v1/` is the first version, before the Dashboard and Matters pages were added.
