const leads = [
  { id: 'L001', name: 'Alice Johnson', email: 'alice.j@corp.com', status: 'Hot', owner: 'Sarah Chen', businessUnit: 'Retail' },
  { id: 'L002', name: 'Bob Williams', email: 'bob.w@tech.io', status: 'Warm', owner: 'Mike Davis', businessUnit: 'Alliance' },
  { id: 'L003', name: 'Carol Martinez', email: 'carol.m@enterprise.net', status: 'Cold', owner: 'Sarah Chen', businessUnit: 'Enterprise' },
  { id: 'L004', name: 'David Brown', email: 'david.b@retail.co', status: 'Hot', owner: 'Jane Smith', businessUnit: 'Retail' },
  { id: 'L005', name: 'Eva Garcia', email: 'eva.g@partners.com', status: 'Warm', owner: 'Mike Davis', businessUnit: 'Alliance' },
  { id: 'L006', name: 'Frank Lee', email: 'frank.l@bigcorp.com', status: 'Cold', owner: 'Jane Smith', businessUnit: 'Enterprise' },
  { id: 'L007', name: 'Grace Kim', email: 'grace.k@shop.net', status: 'Hot', owner: 'Sarah Chen', businessUnit: 'Retail' },
  { id: 'L008', name: 'Henry Taylor', email: 'henry.t@alliance.io', status: 'Warm', owner: 'Mike Davis', businessUnit: 'Alliance' },
]

const opportunities = [
  { id: 'O001', name: 'Retail Expansion Deal', email: 'contact@retail-expansion.com', status: 'Hot', owner: 'Jane Smith', businessUnit: 'Retail', stage: 'Proposal' },
  { id: 'O002', name: 'Alliance Partner Program', email: 'partner@alliance.io', status: 'Warm', owner: 'Mike Davis', businessUnit: 'Alliance', stage: 'Negotiation' },
  { id: 'O003', name: 'Enterprise License Bundle', email: 'enterprise@bigcorp.com', status: 'Cold', owner: 'Sarah Chen', businessUnit: 'Enterprise', stage: 'Discovery' },
  { id: 'O004', name: 'Store Chain Integration', email: 'stores@chain.co', status: 'Hot', owner: 'Jane Smith', businessUnit: 'Retail', stage: 'Closed Won' },
  { id: 'O005', name: 'Tech Alliance Pilot', email: 'pilot@tech-alliance.net', status: 'Warm', owner: 'Mike Davis', businessUnit: 'Alliance', stage: 'Qualification' },
  { id: 'O006', name: 'Global Enterprise Contract', email: 'global@enterprise.com', status: 'Cold', owner: 'Sarah Chen', businessUnit: 'Enterprise', stage: 'Proposal' },
  { id: 'O007', name: 'Regional Retail Rollout', email: 'regional@retail.io', status: 'Hot', owner: 'Jane Smith', businessUnit: 'Retail', stage: 'Negotiation' },
  { id: 'O008', name: 'Strategic Alliance Renewal', email: 'renewal@alliance.com', status: 'Warm', owner: 'Mike Davis', businessUnit: 'Alliance', stage: 'Closed Won' },
]

export const mockData = {
  leads,
  opportunities,
  /** Combined list with type for filtering pipeline */
  all: [
    ...leads.map((item) => ({ ...item, type: 'lead' })),
    ...opportunities.map((item) => ({ ...item, type: 'opportunity' })),
  ],
}
