/* Seed data for the VOI prototype (tickets 21081 + 21082).
   Every person exists once. The Directory, the matter header, the Clients and
   Parties tabs and the invite dialog all read the same record, so an invite sent
   from one place shows everywhere. All names, numbers and addresses are invented
   placeholder data taken from the Figma frames. */

window.TODAY = '19 Nov 2026';

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
  P({ key: 'jma', ref: 'A204', title: 'Ms', first: 'Jenifer', middle: 'Moir', last: 'Allen', phone: '07700 897802', email: 'JMAllen@outlook.com', address: '17 Wickham Avenue, Ramsgate CT11 8RX', status: S('notchecked') }),
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
  P({ key: 'grace', ref: 'O3313', title: 'Mrs', first: 'Grace', last: 'Okafor', phone: '07700 900125', email: 'grace.okafor@example.com', address: '9 Station Road, Woking GU22 7AA', status: S('failed', 'failed', 'review', '16 Nov 2026') }),
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
];
