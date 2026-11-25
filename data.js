/* Seed data for the VOI prototype (tickets 21081 + 21082).
   Every person exists once. The Directory, the matter header, the Clients and
   Parties tabs and the invite dialog all read the same record, so an invite sent
   from one place shows everywhere. All names, numbers and addresses are invented
   placeholder data taken from the Figma frames. */

window.TODAY = '25 Nov 2026';
window.ME = 'Harry Poole';

/* status keys: notchecked | invited | progress | review | failed | verified | expired */
window.STATUS = {
  notchecked: { icon: 'notchecked', tone: 'neutral', short: 'Not checked', line: 'ID not checked' },
  invited:    { icon: 'invited',    tone: 'secondary', short: 'Invited',   line: 'Invited to verify ID' },
  progress:   { icon: 'progress',   tone: 'secondary', short: 'In progress', line: 'ID check in progress' },
  review:     { icon: 'review',     tone: 'secondary', short: 'In review', line: 'ID check in review' },
  failed:     { icon: 'failed',     tone: 'error',   short: 'Failed',      line: 'ID check failed' },
  verified:   { icon: 'verified',   tone: 'primary', short: 'Verified',    line: 'ID verified' },
  expired:    { icon: 'expired',    tone: 'neutral', short: 'Expired',     line: 'ID check expired' },
};

window.RELATIONSHIPS = ['Buyer', 'Seller', 'Giftor', 'Estate Agent', 'Lender', 'Solicitor', 'Other side', 'Witness', 'Executor', 'Beneficiary'];

const P = (o) => Object.assign({ type: 'Person', middle: '', companyId: null, roles: [], address: '' }, o);
const C = (o) => Object.assign({ type: 'Company', title: '', first: '', middle: '', last: '', companyId: null, roles: [], status: null, address: '' }, o);
const S = (id, addr, aml, date) => ({ id, addr: addr || id, aml: aml || (id === 'verified' ? 'verified' : id), date: date || '' });

window.SEED_CONTACTS = [
  /* ---- A204/3: Ms Jenifer Moir Allen (21082 matter flow + parties tab) ---- */
  P({ key: 'jma', ref: 'A204', title: 'Ms', first: 'Jenifer', middle: 'Moir', last: 'Allen', dob: '22/06/1984', phone: '07700 897802', email: 'JMAllen@outlook.com', address: '17 Wickham Avenue, Ramsgate CT11 8RX', status: S('review', 'review', 'review', '21 Nov 2026') }),
  C({ key: 'callards', ref: 'C40112', company: 'Callards Worplesdon Office', phone: '01483 456111', email: 'worplesdon@callards.net', address: '12b Worplesdon Road, Guildford GU3 3RE' }),
  P({ key: 'sarah', ref: 'C40113', title: 'Mrs', first: 'Sarah', last: 'Callard', companyId: 'callards', phone: '07700 900561', email: 's.callard@callards.co.uk', address: '12b Worplesdon Road, Guildford GU3 3RJ', status: S('verified', 'verified', 'verified', '2 Feb 2026') }),
  C({ key: 'wright', ref: 'W30218', company: 'Wright and Wright', phone: '01483 531264', email: '', address: 'DX 83153 Guildford 2' }),
  P({ key: 'thomas', ref: 'R50217', title: 'Mr', first: 'Thomas', last: 'Reid', phone: '07946 112380', email: 'thomas.reid@btinternet.com', address: '4 Ash Grove, Woking GU21 4QP', status: S('verified', 'verified', 'verified', '12 Mar 2025') }),
  P({ key: 'emma', ref: 'H50218', title: 'Mrs', first: 'Emma', last: 'Hart', phone: '07812 445903', email: '', address: '22 Mill Lane, Guildford GU1 3XB', status: S('failed', 'verified', 'failed', '3 Nov 2026') }),
  P({ key: 'daniel', ref: 'O50219', title: 'Mr', first: 'Daniel', last: 'Okafor', phone: '07700 900417', email: 'd.okafor@gmail.com', address: '9 Station Road, Woking GU22 7AA', status: S('invited', 'invited', 'invited', '14 Nov 2026') }),

  /* ---- A902/4: Mrs Kirsty Ayres & Mr Robert Ayres ---- */
  P({ key: 'kirsty', ref: 'A902', title: 'Mrs', first: 'Kirsty', last: 'Ayres', phone: '07968 980324', email: 'kirstylharvey@hotmail.co.uk', address: '6 Elm Close, Margate CT9 2QL', status: S('verified', 'verified', 'verified', '9 Oct 2026') }),
  P({ key: 'robert', ref: 'A903', title: 'Mr', first: 'Robert', last: 'Ayres', phone: '07811 254019', email: 'r.ayres@btinternet.com', address: '6 Elm Close, Margate CT9 2QL', status: S('failed', 'verified', 'review', '11 Oct 2026') }),
  C({ key: 'brookfield', ref: '19', company: 'Brookfield Lettings Ltd', roles: ['Client'], phone: '01483 555201', email: 'lettings@brookfield.example.com', address: '3 Market Street, Guildford GU1 4LB' }),
  P({ key: 'owen', ref: 'B10234', title: 'Mr', first: 'Owen', last: 'Brook', companyId: 'brookfield', phone: '07700 900113', email: 'o.brook@brookfield.example.com', address: '3 Market Street, Guildford GU1 4LB', status: S('invited', 'invited', 'invited', '17 Nov 2026') }),
  P({ key: 'hannah', ref: 'P8657', title: 'Ms', first: 'Hannah', last: 'Doyle', phone: '07700 900115', email: 'h.doyle@example.com', address: '41 Hythe Road, Dover CT17 0DA', status: S('failed', 'verified', 'failed', '14 Nov 2026') }),

  /* ---- S25995/2: Surve + two companies ---- */
  P({ key: 'abhijit', ref: 'S25995', title: 'Mr', first: 'Abhijit', last: 'Surve', phone: '+44 874 5129 8562', email: 'abhijit.surve@xperate.com', address: '88 Canal Walk, London N1 5QA', status: S('verified', 'verified', 'verified', '1 Sep 2026') }),
  C({ key: 'sp', ref: 'S25996', company: 'SP Ltd', phone: '020 7946 0182', email: 'office@spltd.example.com', address: '88 Canal Walk, London N1 5QA' }),
  C({ key: 'spholdings', ref: 'S25997', company: 'SP Holdings Ltd', phone: '020 7946 0183', email: '', address: '88 Canal Walk, London N1 5QA' }),
  C({ key: 'fairway', ref: 'S26477', company: 'Fairway Holdings Ltd', phone: '020 7946 0321', email: 'legal@fairway.example.com', address: '1 Fairway Court, London EC2A 4NE' }),
  P({ key: 'liam', ref: 'G20567', title: 'Mr', first: 'Liam', last: 'Grant', companyId: 'fairway', phone: '07700 900117', email: 'l.grant@fairway.example.com', address: '1 Fairway Court, London EC2A 4NE', status: S('expired', 'expired', 'expired', '4 Jan 2024') }),
  P({ key: 'aisha', ref: 'O1010', title: 'Mrs', first: 'Aisha', last: 'Begum', roles: ['Client'], phone: '07700 900112', email: 'a.begum@example.com', address: '27 Rosebery Road, London N10 2LE', status: S('progress', 'progress', 'review', '12 Nov 2026') }),

  /* ---- P3311/1: four clients ---- */
  P({ key: 'anita', ref: 'P3311', title: 'Mrs', first: 'Anita', last: 'Patel', phone: '07700 900123', email: 'anita.patel@example.com', address: '17 Wickham Avenue, Ramsgate CT11 8RX', status: S('progress', 'progress', 'progress', '15 Nov 2026') }),
  P({ key: 'raj', ref: 'P3312', title: 'Mr', first: 'Raj', last: 'Patel', phone: '07700 900124', email: 'raj.patel@example.com', address: '17 Wickham Avenue, Ramsgate CT11 8RX', status: S('verified', 'verified', 'verified', '15 Nov 2026') }),
  P({ key: 'grace', ref: 'O3313', title: 'Mrs', first: 'Grace', last: 'Okafor', phone: '07700 900125', email: 'grace.okafor@example.com', address: '9 Station Road, Woking GU22 7AA', status: S('review', 'review', 'review', '22 Nov 2026') }),
  C({ key: 'marlowest', ref: 'T12025', company: 'Marlow Estates Ltd', roles: ['Client'], phone: '01628 555740', email: 'office@marlow.example.com', address: '2 High Street, Marlow SL7 1AX' }),
  P({ key: 'oliver', ref: 'M30871', title: 'Mr', first: 'Oliver', last: 'Marlow', companyId: 'marlowest', phone: '07700 900120', email: 'o.marlow@marlow.example.com', address: '2 High Street, Marlow SL7 1AX', status: S('expired', 'expired', 'expired', '30 Jun 2024') }),
  P({ key: 'chloe', ref: 'P51903', title: 'Ms', first: 'Chloe', last: 'Patel', phone: '07700 900122', email: 'c.patel@example.com', address: '11 Kings Road, Ramsgate CT11 7QL', status: S('invited', 'invited', 'invited', '18 Nov 2026') }),

  /* ---- C14350/1: ten clients (matter header + more-clients popover) ---- */
  P({ key: 'mcguir', ref: 'C14350', title: 'Mr', first: 'Ross', last: 'McGuir', phone: '07700 900321', email: 'r.mcguir@example.com', address: '107 Dartmouth Road, London SE23 3HX', status: S('verified', 'verified', 'verified', '29 Oct 2025') }),
  P({ key: 'curley', ref: 'C14351', title: 'Mr', first: 'Matthew', last: 'Curley', phone: '07700 900322', email: 'm.curley@example.com', address: '107 Dartmouth Road, London SE23 3HX', status: S('verified', 'verified', 'verified', '29 Oct 2025') }),
  P({ key: 'ruwan', ref: 'J14352', title: 'Mr', first: 'Ruwan', last: 'Jayawardena', phone: '07700 900323', email: 'r.jayawardena@example.com', address: '109 Dartmouth Road, London SE23 3HX', status: S('verified', 'verified', 'verified', '30 Oct 2025') }),
  P({ key: 'kwakye', ref: 'K14353', title: 'Mr', first: 'Michael Ernest Nana Yaw Adofo', last: 'Kwakye', phone: '07700 900403', email: '', address: '109 Dartmouth Road, London SE23 3HX', status: S('verified', 'verified', 'verified', '30 Oct 2025') }),
  P({ key: 'poduval', ref: 'P14354', title: 'Mr', first: 'Kavhan', last: 'Poduval', phone: '07700 900405', email: 'k.poduval@example.com', address: '14 Honor Oak Park, London SE23 1DY', status: S('failed', 'failed', 'review', '13 Nov 2026') }),
  P({ key: 'field', ref: 'F14355', title: 'Mr', first: 'Andrew', last: 'Field', phone: '07700 900402', email: 'a.field@example.com', address: '3 Wood Vale, London SE23 3DS', status: S('progress', 'progress', 'progress', '16 Nov 2026') }),
  P({ key: 'rachel', ref: 'M14356', title: 'Ms', first: 'Rachel', last: 'McGuire', phone: '07700 900404', email: 'r.mcguire@example.com', address: '5 Thorpewood Avenue, London SE26 4BU', status: S('invited', 'invited', 'invited', '17 Nov 2026') }),
  P({ key: 'fagan', ref: 'F14357', title: 'Mr', first: 'XYZ123', last: 'Fagan', phone: '', email: '', address: '', status: S('notchecked') }),
  C({ key: 'dartmouth', ref: 'D14358', company: '107/109 Dartmouth Road Management Limited', phone: '888 3451 4722 20', email: '', address: '107 Dartmouth Road, London SE23 3HX' }),
  P({ key: 'aldridge', ref: 'A14359', title: 'Mr', first: 'Stuart', last: 'Aldridge', companyId: 'dartmouth', phone: '+44 777 3457 842', email: '', address: '107 Dartmouth Road, London SE23 3HX', status: S('verified', 'verified', 'verified', '2 Nov 2025') }),
  P({ key: 'sinead', ref: 'E14360', title: 'Ms', first: 'Sinead', last: 'Evans', phone: '07700 900401', email: 's.evans@example.com', address: '22 Perry Vale, London SE23 2NE', status: S('verified', 'verified', 'verified', '1 Nov 2025') }),
  P({ key: 'priya', ref: 'P9196', title: 'Dr', first: 'Priya', last: 'Chandra', roles: ['Client'], phone: '07700 900114', email: 'p.chandra@example.com', address: '60 Lordship Lane, London SE22 8HJ', status: S('verified', 'review', 'verified', '6 Nov 2026') }),
  P({ key: 'kowalski', ref: '10015', title: 'Mr', first: 'Daniel', last: 'Kowalski', phone: '07700 900119', email: 'd.kowalski@example.com', address: '8 Kirkdale, London SE26 4BB', status: S('verified', 'failed', 'review', '10 Nov 2026') }),

  /* ---- Clients of the other matters on the Matters list (24520 dataset) ---- */
  C({ key: 'c121', ref: 'E776787', company: '121E143LH LTD', phone: '020 7946 0121', email: 'accounts@121e143lh.co.uk', address: 'Unit 4, 143 Lower High Street, Hastings TN34 3EU' }),
  P({ key: 'leehale', ref: 'E776788', title: 'Mr', first: 'Lee', last: 'Hanley', companyId: 'c121', phone: '07700 900611', email: 'l.hanley@121e143lh.co.uk', address: 'Unit 4, 143 Lower High Street, Hastings TN34 3EU', status: S('verified', 'verified', 'verified', '14 Mar 2026') }),
  P({ key: 'alsheikh', ref: 'M782874', title: 'Mr', first: 'Mohamed', last: 'Alsheikh', phone: '07700 900612', email: 'm.alsheikh@example.com', address: '14 Durham Road, Guildford GU1 2QN', status: S('verified', 'verified', 'verified', '3 Jun 2026') }),
  P({ key: 'appleton', ref: 'M841196', title: 'Mr', first: 'Mark', last: 'Appleton', phone: '07700 900613', email: 'mark.appleton@example.com', address: '41 Mayfield Road, Brighton BN1 6PD', status: S('expired', 'verified', 'verified', '2 Oct 2024') }),
  P({ key: 'adamson', ref: 'A069322', title: 'Mr', first: 'Adrian', last: 'Adamson', phone: '07700 900614', email: 'a.adamson@example.com', address: '8 Bloomsbury Court, London WC1A 2NS', status: S('verified', 'verified', 'verified', '22 Jul 2026') }),
  P({ key: 'anderson', ref: 'D889402', title: 'Mr', first: 'David', last: 'Anderson', phone: '07700 900615', email: 'd.anderson@example.com', address: 'Flat 3, 12 Upper Market Street, Hove BN3 1AS', status: S('invited', 'invited', 'invited', '18 Nov 2026') }),
  C({ key: 'hale', ref: 'H694266', company: 'Hale Estate', phone: '01273 555210', email: '', address: 'c/o 9 Preston Park Avenue, Brighton BN1 6HJ' }),
  P({ key: 'halex', ref: 'H694267', title: 'Mrs', first: 'Joanna', last: 'Hale', companyId: 'hale', phone: '07700 900616', email: 'joanna.hale@example.com', address: '9 Preston Park Avenue, Brighton BN1 6HJ', status: S('verified', 'verified', 'verified', '9 Jan 2025') }),
  P({ key: 'msmith', ref: 'M967686', title: 'Mr', first: 'Marcus', last: 'Smith', phone: '07700 900617', email: 'marcus.smith@example.com', address: '27 Coldean Lane, Brighton BN1 9GD', status: S('notchecked') }),
  C({ key: 'pinewood', ref: 'P430287', company: 'Pinewood Holdings Ltd', phone: '01622 300450', email: 'legal@pinewoodholdings.co.uk', address: 'Pinewood Industrial Estate, Maidstone ME16 0LQ' }),
  P({ key: 'pwdir', ref: 'P430288', title: 'Ms', first: 'Helen', last: 'Ward', companyId: 'pinewood', phone: '07700 900618', email: 'h.ward@pinewoodholdings.co.uk', address: 'Pinewood Industrial Estate, Maidstone ME16 0LQ', status: S('review', 'verified', 'progress', '15 Nov 2026') }),
  C({ key: 'greenway', ref: 'G944855', company: 'Greenway Retail', phone: '01892 410022', email: 'property@greenwayretail.co.uk', address: '22 High Street, Tunbridge Wells TN1 1UX' }),
  P({ key: 'gwdir', ref: 'G944856', title: 'Mr', first: 'Tom', last: 'Greenway', companyId: 'greenway', phone: '07700 900619', email: 't.greenway@greenwayretail.co.uk', address: '22 High Street, Tunbridge Wells TN1 1UX', status: S('verified', 'verified', 'verified', '30 Apr 2026') }),

  /* ---- Directory-only contacts (no matter in this prototype) ---- */
  P({ key: 'abbott', ref: 'R14055', title: 'Mr', first: 'James', last: 'Abbott', roles: ['Client'], phone: '07700 900111', email: 'j.abbott@example.com', address: '12 Queens Road, Brighton BN1 3XE', status: S('verified', 'verified', 'verified', '20 Aug 2026') }),
  P({ key: 'sophie', ref: 'M25142', title: 'Miss', first: 'Sophie', last: 'Hughes', roles: ['Client'], phone: '07700 900118', email: 's.hughes@example.com', address: '7 Chapel Street, Canterbury CT1 2NR', status: S('review', 'progress', 'progress', '13 Nov 2026') }),
  P({ key: 'fatima', ref: 'N44120', title: 'Mrs', first: 'Fatima', last: 'Noor', roles: ['Client'], phone: '07700 900121', email: 'f.noor@example.com', address: '19 Tower Hamlets Road, Dover CT17 0BP', status: S('verified', 'review', 'verified', '8 Nov 2026') }),
];

/* clients: first is the primary. parties carry the relationship to the matter. */
window.SEED_MATTERS = [
  { id: 'A204-3', ref: 'A204/3', description: 'Purchase of 17 Wickham Avenue, Ramsgate', type: 'Property / Residential / Purchase', opened: '01/01/2025', closed: 'current', status: 'Open', feeEarner: 'Stuart Aldridge',
    clients: ['jma'],
    parties: [['callards', 'Estate Agent'], ['sarah', 'Estate Agent'], ['wright', 'Solicitor'], ['thomas', 'Giftor'], ['emma', 'Giftor'], ['daniel', 'Giftor']] },
  { id: 'A902-4', ref: 'A902/4', description: 'Sale of 6 Elm Close, Margate', type: 'Property / Residential / Sale', opened: '14/09/2026', closed: 'current', status: 'Open', feeEarner: 'Mehreen Akhtar',
    clients: ['kirsty', 'robert'],
    parties: [['brookfield', 'Estate Agent'], ['owen', 'Estate Agent'], ['hannah', 'Buyer']] },
  { id: 'S25995-2', ref: 'S25995/2', description: 'Dispute with Fairway Holdings Ltd', type: 'Litigation / Commercial / General', opened: '25/08/2026', closed: '25/08/2026', status: 'Open', feeEarner: 'Stuart Copeland',
    clients: ['abhijit', 'sp', 'spholdings'],
    parties: [['fairway', 'Other side'], ['liam', 'Other side'], ['aisha', 'Witness']] },
  { id: 'P3311-1', ref: 'P3311/1', description: 'Purchase of 2 Harbour Parade, Ramsgate', type: 'Property / Residential / Purchase', opened: '01/01/2025', closed: 'current', status: 'Open', feeEarner: 'Stuart Aldridge',
    clients: ['anita', 'raj', 'grace', 'daniel'],
    parties: [['marlowest', 'Estate Agent'], ['oliver', 'Estate Agent'], ['chloe', 'Giftor']] },
  { id: 'C14350-1', ref: 'C14350/1', description: 'Right of First Refusal - Purchase 107 & 109 Dartmouth Road, Greater London, SE23 3HX', type: 'Property / Residential / Purchase', opened: '28/10/2025', closed: 'Current', status: 'Open', feeEarner: 'Stuart Copeland',
    clients: ['mcguir', 'curley', 'ruwan', 'kwakye', 'poduval', 'field', 'rachel', 'fagan', 'dartmouth', 'sinead'],
    parties: [['priya', 'Seller'], ['kowalski', 'Seller']] },

  /* ---- The rest of the Matters list (from the 24520 dataset). Fully openable. ---- */
  { id: '110-1', ref: '110/1', description: 'Ground Floor Retail Unit Lease', type: 'Property / Commercial / Lease', opened: '12/03/2026', closed: 'current', status: 'Open', feeEarner: 'Fiasal Aslam', recent: true,
    clients: ['c121'], parties: [['brookfield', 'Estate Agent']] },
  { id: '110-2', ref: '110/2', description: 'First Floor Office Lease', type: 'Property / Commercial / Lease', opened: '04/06/2026', closed: 'current', status: 'Closing', feeEarner: 'Fiasal Aslam',
    clients: ['c121'], parties: [] },
  { id: 'A1-1', ref: 'A1/1', description: 'Purchase of 14 Durham Road', type: 'Property / Residential / Purchase', opened: '02/06/2026', closed: 'current', status: 'Open', feeEarner: 'Guy Setford',
    clients: ['alsheikh'], parties: [['callards', 'Estate Agent']] },
  { id: 'A8-7', ref: 'A8/7', description: 'Dispute with Mrs Mayhew', type: 'Litigation / General / Dispute', opened: '19/02/2026', closed: 'current', status: 'Open', feeEarner: 'Tessie Bennett',
    clients: ['appleton'], parties: [['wright', 'Other side']] },
  { id: 'A25-1', ref: 'A25/1', description: 'Purchase 8 Bloomsbury Court', type: 'Property / Residential / Purchase', opened: '20/07/2026', closed: 'current', status: 'Open', feeEarner: 'Guy Setford', recent: true,
    clients: ['adamson'], parties: [['marlowest', 'Estate Agent']] },
  { id: 'A25-2', ref: 'A25/2', description: 'Remortgage of 8 Bloomsbury Court', type: 'Property / Residential / Remortgage', opened: '01/10/2026', closed: 'current', status: 'Open', feeEarner: 'Guy Setford',
    clients: ['adamson'], parties: [] },
  { id: 'A204-4', ref: 'A204/4', description: 'Sale of 8 Home Croft Drive', type: 'Property / Residential / Sale', opened: '01/01/2025', closed: 'current', status: 'Closing', feeEarner: 'Sarah Gillbe', recent: true,
    clients: ['jma'], parties: [['brookfield', 'Estate Agent'], ['owen', 'Estate Agent']] },
  { id: 'A419-3', ref: 'A419/3', description: 'Lease extension and consent', type: 'Landlord & Tenant / Lease extension', opened: '07/11/2026', closed: 'current', status: 'Open', feeEarner: 'Crispin Davies',
    clients: ['anderson'], parties: [] },
  { id: 'B12-2', ref: 'B12/2', description: 'Estate of Mrs Beatrice Hale', type: 'Probate / Estates / Administration', opened: '09/01/2025', closed: '30/09/2026', status: 'Closed', feeEarner: 'Sally Wood',
    clients: ['hale'], parties: [] },
  { id: 'C99-4', ref: 'C99/4', description: 'Reopen — Smith v Jones', type: 'Litigation / General / Dispute', opened: '11/11/2026', closed: 'current', status: 'Reopening', feeEarner: 'Tessie Bennett',
    clients: ['msmith'], parties: [['fairway', 'Other side']] },
  { id: 'D45-1', ref: 'D45/1', description: 'Sale of Pinewood Industrial Unit', type: 'Property / Commercial / Sale', opened: '28/08/2026', closed: 'current', status: 'Closing', feeEarner: 'Paul Reynolds',
    clients: ['pinewood'], parties: [['brookfield', 'Estate Agent']] },
  { id: 'F11-9', ref: 'F11/9', description: 'Lease renewal — 22 High Street', type: 'Landlord & Tenant / Lease renewal', opened: '03/11/2026', closed: 'current', status: 'Reopening', feeEarner: 'Crispin Davies',
    clients: ['greenway'], parties: [] },
];

/* Matters list order (natural reference order, like the live list) */
(function () {
  const key = (r) => r.replace(/(\d+)/g, (n) => n.padStart(6, '0'));
  window.SEED_MATTERS.sort((a, b) => key(a.ref).localeCompare(key(b.ref)));
})();

/* favourites + recents for the Matters list filters, and the tabs open on first load */
window.SEED_FAVOURITES = ['A204-3', 'C14350-1', 'A25-1'];
window.SEED_RECENTS = ['A204-3', 'C14350-1', 'P3311-1', 'A902-4', 'S25995-2', 'A204-4', '110-1', 'A25-1'];
window.SEED_OPEN_TABS = ['A204-3', 'C14350-1'];

/* ID check reviews (36685 Manual Review Process). One per person who has submitted
   documents. issues lists what Halo flagged in each area; an empty list shows Clear.
   decision is filled in once someone approves or rejects. People without an entry get
   a generated record from their status (verified = approved, failed = rejected). */
window.SEED_REVIEWS = {
  jma:     { submitted: '21 Nov 2026, 09:42', issues: { id: [], addr: [], aml: [] } },
  grace:   { submitted: '22 Nov 2026, 14:05', issues: { id: ['Visual Authenticity: Digital Tampering', 'Data Comparison: Last Name'], addr: ['Document Classification: Valid Document Date'], aml: [] } },
  pwdir:   { submitted: '15 Nov 2026, 11:20', issues: { id: ['Visual Authenticity: Digital Tampering'], addr: [], aml: [] } },
  sophie:  { submitted: '13 Nov 2026, 16:48', issues: { id: [], addr: ['Document Classification: Valid Document Date'], aml: [] } },
  robert:  { submitted: '10 Oct 2026, 10:12', issues: { id: ['Visual Authenticity: Digital Tampering', 'Data Comparison: Last Name'], addr: [], aml: [] },
             decision: { outcome: 'rejected', by: 'Stuart Lee', at: '11 Oct 2026, 15:30', notes: "The passport photo page looks edited and the surname doesn't match the one we hold. I've asked Robert to come into the office with his passport so we can verify him in person." } },
  poduval: { submitted: '12 Nov 2026, 08:55', issues: { id: ['Data Comparison: Date of Birth'], addr: ['Document Classification: Valid Document Date'], aml: [] },
             decision: { outcome: 'rejected', by: 'Stuart Lee', at: '13 Nov 2026, 09:40', notes: 'The date of birth on the passport is different to the one on file, and the proof of address is more than 3 months old. Asked the client to send something more up to date.' } },
  raj:     { submitted: '14 Nov 2026, 19:02', issues: { id: ['Visual Authenticity: Glare'], addr: [], aml: [] },
             decision: { outcome: 'approved', by: 'Stuart Lee', at: '15 Nov 2026, 09:12', notes: 'The glare covers part of the photo page but the details are readable and match the client record.' } },
};
