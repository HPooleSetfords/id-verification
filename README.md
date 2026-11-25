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

- **The Clients and Parties tabs** use the new in-matter layout (Figma `8564:704630` clients, `8607:763765` parties):
  - on the left, a list of the people on the matter with their ID status icon. Click a row to select it. The selected row opens to show **Personal details**, **Contact details** and **Client record** (or **Party record**, with Party ref, Party type and Relation to matter). For companies it shows **Company details** instead. Each section opens and closes, and stays that way as you move between people. The › on a row opens that person's own page;
  - under the list, an **Add Client** or **Add Party** text button (Figma `8607:835716`). Neither button opens anything; they show a "Not part of this prototype" message;
  - on the right, an **ID banner** for the selected person, then **Documents**, **Related Matters** and, for clients only, **Recent Bills** (parties don't have bills). Companies also get an **Associated people** card. The cards collapse.
- **The ID banner** follows the person's status: Not checked (Invite to verify), Invited (Resend invite), In progress, Pending review (Review ID), Failed (View Decision), Verified (Approved by … · View Decision) and Expired (Invite to Verify ID). Party banners say "party" instead of "client".
- **ID verification panel** (36685 Manual Review Process, Figma `8564:737000`). **Review ID** opens a side panel with Halo's summary (Clear or Suspicious, with the issues under ID Document, Proof of address and AML checks), the four documents (ID, Selfie, Address, Report) with a large preview, and Notes. The expand button opens the documents in a **picture-in-picture window** that floats above other windows (Chrome and Edge; other browsers get a floating viewer in the page instead). In the viewer you can scroll left and right between documents (trackpad, mouse wheel, the arrows, the dots or the ← → keys), and picking a document in the panel's gallery changes the viewer too. Both always show the same document:
  - **Approve** verifies the person everywhere and the banner turns green ("Approved by Harry Poole on …");
  - **Reject** fails the check and the banner turns red. Reject asks for a note first;
  - **View Decision** reopens the panel read-only and locked, with "Consultant Reviewed as Approved/Rejected", the notes, and who logged it and when.

  To try it: A204/3 (Jenifer Allen, 0 issues, the approval example) and P3311/1 (Grace Okafor, 3 issues, the rejection example) are waiting for review. A902/4 › Robert Ayres and C14350/1 › Kavhan Poduval have rejected decisions, and P3311/1 › Raj Patel has an approved one with notes. In the Directory, Helen Ward and Sophie Hughes are also waiting for review.
- **A person's own page** (`#/person/<key>`, Figma `8607:799008`). Open it from a Reference in the Directory, a row's ⋮ › View details, the › on a matter's Clients or Parties list, Associated people, or Recent Clients on the Dashboard. It has a header (reference, name, ID status, phone, email, type and roles, ⋮ menu with Invite to Verify ID and Open matter), then the same layout with only that person. People who are only ever a party get a Party record (Relation to matter lists each matter) and no Recent Bills.
- **Invite to Verify ID** can be started from four places:
  - the matter Actions menu: Clients and Parties groups, default ticks, + Add new party;
  - the Invite to verify / Invite to Verify ID link in a person's ID banner (on a matter or their own page);
  - a selection in the Directory;
  - a row's ⋮ menu.

  The dialog lets you edit email and mobile inline, with validation. It shows Sending, then Request Sent, then a snackbar. If a company is selected, the invite is blocked with an error.
- **One shared record:** an invite updates the person everywhere at once — the Directory, every matter header and every tab. Daniel Okafor is a Party on A204/3 and a Client on P3311/1, which demonstrates this.

- **Settings** (side nav) has a Preferences card with a **Currency** switch: Pound sterling (£) or US dollar ($). It changes the symbol on the Dashboard's Bills & Payments and on every matter Summary's Balances and Quotes. The amounts aren't converted. The choice is saved with the rest of the prototype data, and `#/reset` sets it back to pounds.

## Routes
`#/dashboard` · `#/directory` · `#/matters` · `#/settings` · `#/person/<key>` (e.g. `#/person/jma`) · `#/matter/<id>/<tab>`, where `<id>` is the reference with `-` for `/` (e.g. `A204-3`, `C14350-1`, `A25-1`), and `<tab>` is `summary`, `clients` or `parties` (other tabs show a placeholder). Example: `#/matter/A204-3/parties`.

## Resetting
Changes (invites, favourites, open tabs) are saved in the browser. Open `index.html#/reset` to put everything back to the starting data.

## Choices made that aren't in the Figma
- Estate agents are treated like any other person: they show ID statuses and can be invited. (An exemption that hid them was tried and retracted on 20 Nov 2026; it can be switched back on with `ESTATE_AGENT_EXEMPT` in app.js.)
- The Clients and Parties tabs don't show counts. The old Parties table (with multi-select invite) has been replaced by the new layout, so inviting several parties at once is done from the matter Actions menu.
- The signed-in user is Harry Poole, so new decisions are logged as Harry Poole. Seeded decisions are by Stuart Lee, as in the Figma.
- Rejecting needs a note; approving doesn't.
- Everyone uses the same four sample ID documents from the Figma. Documents, bills and related matters are generated prototype data (bills are the same four for every client).
- Companies (client or party) have no ID banner, because companies aren't ID checked. Their associated people's statuses show in the Associated people card, and each person's own page has their banner.
- "Resend invite" opens the Invite to Verify ID dialog for that person, so the contact details can be checked before sending again. Sending updates the invite date.
- Directory filters are single-choice dropdowns with an Any option. Applied filters show as chips under the toolbar. Choosing a status hides companies, which have no ID checks.
- The 24520 Client Matters side panel is left out of the Matters pages (removed at Harry's request).
- Status wording in tables is short: Verified (Passed for AML), Invited, In progress, In review, Failed, Expired and Not checked. Headers and the dialog use the ID status component's full lines.
- The Directory row menu has an "Open matter" list, and the Parties/Clients row menu has "View in Directory". These were added so you can move freely between the Directory and matters.
- The matters-list row menu gains Invite to Verify ID under the two 24520 items.
- The Recent Clients tab on the Dashboard is populated (it's empty in 20725) so it can show ID status and link to the Directory.
- Pressing Send with a missing email or mobile opens that person's inline editor with the error. Send is disabled while an editor is open.
- The Clients tab lists the people linked to a client company as their own rows ("Contact for client").
- All names, numbers, addresses and references are invented placeholder data.

`reference/` holds the Figma frames used. `assets/id/` holds the sample ID documents from the 36685 Figma. `archive/v1/` is the first version, before the Dashboard and Matters pages were added. `archive/v2/` is the version before the 25 Nov 2026 update (new Clients/Parties layout, ID review and person pages).
