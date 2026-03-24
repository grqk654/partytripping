import { useState, useEffect } from 'react'

// ─── URL ROUTING ──────────────────────────────────────────────────────────────
const urlToPage = (pathname) => pathname.replace(/^\//, '') || 'home'
const pageToUrl = (page) => page === 'home' ? '/' : '/' + page

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  teal: '#00C9B1', lime: '#B8F142', coral: '#FF5C4D', orange: '#FF8C42',
  navy: '#071220', navy2: '#0d1e30', navy3: '#132840',
  white: '#F0F9F6', muted: '#7a9aaa', border: 'rgba(255,255,255,0.08)',
  borderTeal: 'rgba(0,201,177,0.3)', borderCoral: 'rgba(255,92,77,0.3)',
}
const F = { display: "'Righteous', cursive", body: "'DM Sans', sans-serif", mono: "'DM Mono', monospace" }
const globalStyles = `
  * { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body { background:${C.navy}; color:${C.white}; font-family:${F.body}; overflow-x:hidden; }
  a { color:inherit; text-decoration:none; }
  select, input, textarea { color:${C.white}; }
  select option { background:${C.navy2}; color:${C.white}; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  .fade-up { animation:fadeUp .5s ease both; }
  ::-webkit-scrollbar { width:6px; }
  ::-webkit-scrollbar-track { background:${C.navy}; }
  ::-webkit-scrollbar-thumb { background:${C.navy3}; border-radius:3px; }
`

// ─── SHARED UI COMPONENTS ─────────────────────────────────────────────────────
function Tag({ children, color = C.teal }) {
  return (
    <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 50, background: color + '22', color, display: 'inline-block' }}>
      {children}
    </span>
  )
}

function SectionLabel({ children }) {
  return <div style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.lime, marginBottom: 14 }}>{children}</div>
}

function AIResult({ content }) {
  if (!content) return null
  return (
    <div style={{ marginTop: 20, padding: '20px 20px', background: 'rgba(0,201,177,0.06)', border: `1px solid ${C.borderTeal}`, borderRadius: 14 }}>
      <div style={{ fontFamily: F.mono, fontSize: 10, color: C.teal, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>✦ Your AI Plan</div>
      <div style={{ fontSize: 14, color: C.white, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{content}</div>
    </div>
  )
}

function Spinner() {
  return <div style={{ width: 18, height: 18, border: `2px solid rgba(7,18,32,0.3)`, borderTop: `2px solid ${C.navy}`, borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />
}

function FieldLabel({ children }) {
  return <label style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 600, color: C.muted, letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>{children}</label>
}

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`,
  borderRadius: 10, padding: '11px 14px', color: C.white, fontSize: 14,
  fontFamily: F.body, outline: 'none', transition: 'border-color .2s',
  appearance: 'none',
}

function PrimaryBtn({ children, onClick, disabled, color = C.teal, textColor = C.navy }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: '13px 20px', border: 'none', borderRadius: 12,
      background: disabled ? C.navy3 : `linear-gradient(135deg, ${color}, ${color === C.teal ? C.lime : C.orange})`,
      color: disabled ? C.muted : textColor, fontSize: 15, fontWeight: 700,
      fontFamily: F.body, cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      transition: 'opacity .2s', marginTop: 8,
    }}>
      {children}
    </button>
  )
}

async function callClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await res.json()
  return data.content?.[0]?.text || 'Something went wrong. Please try again.'
}

// ─── TOOL 1: AI PARTY PLANNER ─────────────────────────────────────────────────
function AIPartyPlanner() {
  const [eventType, setEventType] = useState('Birthday Party')
  const [headcount, setHeadcount] = useState('10–20 people')
  const [budget, setBudget] = useState('$500–$1,000')
  const [location, setLocation] = useState('backyard / home')
  const [vibe, setVibe] = useState('Fun & casual')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true); setResult('')
    const prompt = `You are a warm, helpful party planning assistant. Generate a practical, detailed party plan for the following:
- Event type: ${eventType}
- Headcount: ${headcount}
- Budget: ${budget}
- Location: ${location}
- Vibe: ${vibe}

Provide:
1. Timeline / schedule (from setup to end)
2. Food & drink suggestions
3. Entertainment / activities
4. Decor ideas
5. Vendor checklist with budget breakdown
6. 3 pro tips for this type of party

Keep it warm, practical, and actionable. Use line breaks to organize clearly.`
    const text = await callClaude(prompt)
    setResult(text); setLoading(false)
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div><FieldLabel>Event Type</FieldLabel>
          <select value={eventType} onChange={e => setEventType(e.target.value)} style={inputStyle}>
            {['Birthday Party','Bachelorette Party','Graduation Party','Holiday Party','NYE Party','Backyard BBQ','Surprise Party','Baby Shower','Engagement Party','Retirement Party'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div><FieldLabel>Headcount</FieldLabel>
          <select value={headcount} onChange={e => setHeadcount(e.target.value)} style={inputStyle}>
            {['Under 10 people','10–20 people','20–40 people','40–75 people','75+ people'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div><FieldLabel>Budget</FieldLabel>
          <select value={budget} onChange={e => setBudget(e.target.value)} style={inputStyle}>
            {['Under $200','$200–$500','$500–$1,000','$1,000–$2,500','$2,500–$5,000','$5,000+'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div><FieldLabel>Vibe</FieldLabel>
          <select value={vibe} onChange={e => setVibe(e.target.value)} style={inputStyle}>
            {['Fun & casual','Elegant & classy','Wild & rowdy','Chill & laid-back','Themed & creative','Outdoor adventure'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}><FieldLabel>Location / Venue Type</FieldLabel>
        <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. backyard, restaurant, rented venue..." style={inputStyle} />
      </div>
      <PrimaryBtn onClick={generate} disabled={loading} color={C.coral} textColor="#fff">
        {loading ? <><Spinner /> Building your party plan...</> : '🎉 Build My Party Plan'}
      </PrimaryBtn>
      <AIResult content={result} />
    </div>
  )
}

// ─── TOOL 2: AI TRIP BUILDER ──────────────────────────────────────────────────
function AITripBuilder() {
  const [destination, setDestination] = useState('')
  const [groupSize, setGroupSize] = useState('6 people')
  const [nights, setNights] = useState('3 nights')
  const [tripType, setTripType] = useState("Girls' Trip")
  const [vibe, setVibe] = useState('Beach & chill')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!destination.trim()) return
    setLoading(true); setResult('')
    const prompt = `You are a fun, knowledgeable travel planner for friend groups. Build a detailed group trip plan:
- Destination: ${destination}
- Group size: ${groupSize}
- Duration: ${nights}
- Trip type: ${tripType}
- Vibe: ${vibe}

Provide:
1. Day-by-day itinerary (activities, meals, evenings)
2. Recommended neighborhood / area to stay
3. Top 3 hotel/Airbnb suggestions with price range per night
4. Must-do experiences for this group type
5. Budget estimate per person (accommodation, food, activities)
6. Packing essentials for this trip
7. 3 insider tips

Keep it enthusiastic, practical, and group-focused.`
    const text = await callClaude(prompt)
    setResult(text); setLoading(false)
  }

  return (
    <div>
      <div style={{ marginBottom: 14 }}><FieldLabel>Destination</FieldLabel>
        <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g. Miami, Nashville, Cancun, New Orleans..." style={inputStyle} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div><FieldLabel>Group Size</FieldLabel>
          <select value={groupSize} onChange={e => setGroupSize(e.target.value)} style={inputStyle}>
            {['2–4 people','5–6 people','7–10 people','11–15 people','15+ people'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div><FieldLabel>Duration</FieldLabel>
          <select value={nights} onChange={e => setNights(e.target.value)} style={inputStyle}>
            {['1 night','2 nights','3 nights','4 nights','5–7 nights','Week+'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div><FieldLabel>Trip Type</FieldLabel>
          <select value={tripType} onChange={e => setTripType(e.target.value)} style={inputStyle}>
            {["Girls' Trip","Bachelorette Trip","Bachelor Trip","Friend Group Getaway","Couples Trip","Family Reunion","Birthday Trip","Work Friends Trip"].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div><FieldLabel>Vibe</FieldLabel>
          <select value={vibe} onChange={e => setVibe(e.target.value)} style={inputStyle}>
            {['Beach & chill','Party hard','Food & culture','Adventure & outdoors','Spa & relaxation','City exploration','Mix of everything'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <PrimaryBtn onClick={generate} disabled={loading || !destination.trim()}>
        {loading ? <><Spinner /> Building your trip plan...</> : '✈️ Build My Trip Plan'}
      </PrimaryBtn>
      <AIResult content={result} />
    </div>
  )
}

// ─── TOOL 3: BUDGET SPLITTER ──────────────────────────────────────────────────
function BudgetSplitter() {
  const [items, setItems] = useState([{ name: 'Venue / Airbnb', amount: '' }, { name: 'Food & drinks', amount: '' }, { name: 'Activities', amount: '' }])
  const [people, setPeople] = useState(8)
  const [newItem, setNewItem] = useState('')

  const total = items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0)
  const perPerson = people > 0 ? total / people : 0

  const updateItem = (idx, field, val) => {
    const updated = [...items]; updated[idx][field] = val; setItems(updated)
  }
  const addItem = () => {
    if (!newItem.trim()) return
    setItems([...items, { name: newItem, amount: '' }]); setNewItem('')
  }
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx))

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <FieldLabel>Number of people splitting</FieldLabel>
        <input type="number" value={people} onChange={e => setPeople(Number(e.target.value))} min={1} max={100} style={{ ...inputStyle, width: 120 }} />
      </div>
      <FieldLabel>Cost items</FieldLabel>
      {items.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
          <input type="text" value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} placeholder="Item name" style={{ ...inputStyle, flex: 2 }} />
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, fontSize: 14 }}>$</span>
            <input type="number" value={item.amount} onChange={e => updateItem(idx, 'amount', e.target.value)} placeholder="0" style={{ ...inputStyle, paddingLeft: 24 }} />
          </div>
          <button onClick={() => removeItem(idx)} style={{ background: 'rgba(255,92,77,0.1)', border: `1px solid ${C.borderCoral}`, color: C.coral, borderRadius: 8, padding: '10px 14px', cursor: 'pointer', fontSize: 14, flexShrink: 0 }}>✕</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 10, marginTop: 4, marginBottom: 24 }}>
        <input type="text" value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()} placeholder="Add another item..." style={{ ...inputStyle, flex: 1 }} />
        <button onClick={addItem} style={{ background: C.navy3, border: `1px solid ${C.border}`, color: C.teal, borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontSize: 14, flexShrink: 0, fontWeight: 600 }}>+ Add</button>
      </div>

      {total > 0 && (
        <div style={{ background: 'rgba(0,201,177,0.06)', border: `1px solid ${C.borderTeal}`, borderRadius: 14, padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ textAlign: 'center', padding: '16px 12px', background: C.navy3, borderRadius: 10 }}>
              <div style={{ fontFamily: F.mono, fontSize: 11, color: C.muted, marginBottom: 6 }}>TOTAL COST</div>
              <div style={{ fontFamily: F.mono, fontSize: 28, fontWeight: 600, color: C.white }}>${total.toFixed(2)}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px 12px', background: `${C.teal}18`, borderRadius: 10, border: `1px solid ${C.borderTeal}` }}>
              <div style={{ fontFamily: F.mono, fontSize: 11, color: C.teal, marginBottom: 6 }}>PER PERSON ({people})</div>
              <div style={{ fontFamily: F.mono, fontSize: 28, fontWeight: 600, color: C.teal }}>${perPerson.toFixed(2)}</div>
            </div>
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 10, color: C.muted, marginBottom: 10, letterSpacing: '.06em', textTransform: 'uppercase' }}>Breakdown</div>
          {items.filter(i => i.amount).map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}`, fontSize: 13 }}>
              <span style={{ color: C.muted }}>{item.name}</span>
              <span style={{ fontFamily: F.mono }}>${(parseFloat(item.amount) || 0).toFixed(2)} <span style={{ color: C.muted }}>({people > 0 ? ((parseFloat(item.amount) || 0) / people).toFixed(2) : '0.00'}/person)</span></span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── TOOL 4: GUEST LIST TRACKER ───────────────────────────────────────────────
function GuestListTracker() {
  const [guests, setGuests] = useState([])
  const [name, setName] = useState(''); const [dietary, setDietary] = useState('None')
  const statuses = ['Invited', 'Confirmed', 'Declined', 'Maybe']
  const statusColors = { Invited: C.muted, Confirmed: C.teal, Declined: C.coral, Maybe: C.orange }

  const addGuest = () => {
    if (!name.trim()) return
    setGuests([...guests, { name: name.trim(), status: 'Invited', dietary, plus1: false }])
    setName(''); setDietary('None')
  }
  const updateStatus = (idx, status) => { const g = [...guests]; g[idx].status = status; setGuests(g) }
  const removeGuest = (idx) => setGuests(guests.filter((_, i) => i !== idx))

  const confirmed = guests.filter(g => g.status === 'Confirmed').length
  const declined = guests.filter(g => g.status === 'Declined').length
  const invited = guests.filter(g => g.status === 'Invited').length

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ flex: 2 }}><FieldLabel>Guest Name</FieldLabel>
          <input type="text" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addGuest()} placeholder="Add a guest..." style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}><FieldLabel>Dietary</FieldLabel>
          <select value={dietary} onChange={e => setDietary(e.target.value)} style={inputStyle}>
            {['None','Vegetarian','Vegan','Gluten-free','Halal','Kosher','Nut allergy','Dairy-free'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ paddingTop: 25 }}>
          <button onClick={addGuest} style={{ background: C.coral, border: 'none', color: '#fff', borderRadius: 10, padding: '11px 18px', cursor: 'pointer', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>+ Add</button>
        </div>
      </div>

      {guests.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            {[['Confirmed', confirmed, C.teal], ['Invited', invited, C.muted], ['Declined', declined, C.coral]].map(([label, count, color]) => (
              <div key={label} style={{ background: C.navy3, borderRadius: 10, padding: '14px 12px', textAlign: 'center' }}>
                <div style={{ fontFamily: F.mono, fontSize: 22, fontWeight: 600, color }}>{count}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ maxHeight: 340, overflowY: 'auto' }}>
            {guests.map((g, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.navy3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0, color: statusColors[g.status] }}>{g.name[0]?.toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{g.name}</div>
                  {g.dietary !== 'None' && <div style={{ fontSize: 11, color: C.orange }}>{g.dietary}</div>}
                </div>
                <select value={g.status} onChange={e => updateStatus(idx, e.target.value)}
                  style={{ ...inputStyle, width: 120, padding: '6px 10px', fontSize: 12, color: statusColors[g.status] }}>
                  {statuses.map(s => <option key={s}>{s}</option>)}
                </select>
                <button onClick={() => removeGuest(idx)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 16, padding: '4px 6px' }}>✕</button>
              </div>
            ))}
          </div>
        </>
      )}
      {guests.length === 0 && <div style={{ textAlign: 'center', padding: '40px 20px', color: C.muted, fontSize: 14 }}>Add your first guest above to get started 👆</div>}
    </div>
  )
}

// ─── TOOL 5: PACKING LIST GENERATOR ──────────────────────────────────────────
function PackingListGen() {
  const [tripType, setTripType] = useState('Beach Trip')
  const [nights, setNights] = useState('3 nights')
  const [season, setSeason] = useState('Summer')
  const [extras, setExtras] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true); setResult('')
    const prompt = `Create a comprehensive, organized packing list for:
- Trip type: ${tripType}
- Duration: ${nights}
- Season/weather: ${season}
${extras ? `- Special notes: ${extras}` : ''}

Organize into clear categories: Clothing, Toiletries, Documents & Money, Tech & Gadgets, Activities/Gear, Snacks & Extras.
Include specific quantities where relevant (e.g. "3 pairs of shorts").
Add a "Don't forget!" section at the end with 5 common things people forget.
Keep it practical and specific to this trip type. Format with clear category headers.`
    const text = await callClaude(prompt)
    setResult(text); setLoading(false)
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div><FieldLabel>Trip Type</FieldLabel>
          <select value={tripType} onChange={e => setTripType(e.target.value)} style={inputStyle}>
            {['Beach Trip','City Break','Camping / Outdoors','Road Trip','International Trip','Ski / Winter Trip','Festival / Concert','Spa Weekend','Bachelorette Trip','General Getaway'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div><FieldLabel>Duration</FieldLabel>
          <select value={nights} onChange={e => setNights(e.target.value)} style={inputStyle}>
            {['1 night','2 nights','3 nights','4–5 nights','6–7 nights','1–2 weeks'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}><FieldLabel>Season / Weather</FieldLabel>
        <select value={season} onChange={e => setSeason(e.target.value)} style={inputStyle}>
          {['Summer','Fall','Winter','Spring','Tropical / Hot','Cold / Snowy','Variable / Mixed'].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 14 }}><FieldLabel>Any special notes? (optional)</FieldLabel>
        <input type="text" value={extras} onChange={e => setExtras(e.target.value)} placeholder="e.g. attending a wedding, going hiking, bringing kids..." style={inputStyle} />
      </div>
      <PrimaryBtn onClick={generate} disabled={loading}>
        {loading ? <><Spinner /> Generating packing list...</> : '🧳 Generate Packing List'}
      </PrimaryBtn>
      <AIResult content={result} />
    </div>
  )
}

// ─── TOOL 6: GROUP VOTE TOOL ──────────────────────────────────────────────────
function GroupVoteTool() {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [votes, setVotes] = useState({})
  const [voted, setVoted] = useState(false)
  const [newOpt, setNewOpt] = useState('')

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0)
  const addOption = () => { if (newOpt.trim()) { setOptions([...options, newOpt.trim()]); setNewOpt('') } }
  const vote = (opt) => {
    if (voted) return
    setVotes({ ...votes, [opt]: (votes[opt] || 0) + 1 })
    setVoted(true)
  }
  const reset = () => { setVotes({}); setVoted(false) }

  const maxVotes = Math.max(...Object.values(votes), 0)

  return (
    <div>
      <div style={{ marginBottom: 14 }}><FieldLabel>Your question</FieldLabel>
        <input type="text" value={question} onChange={e => setQuestion(e.target.value)} placeholder="e.g. Where should we go for the bachelorette trip?" style={inputStyle} />
      </div>
      <FieldLabel>Options</FieldLabel>
      {options.map((opt, idx) => (
        <div key={idx} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <input type="text" value={opt} onChange={e => { const o = [...options]; o[idx] = e.target.value; setOptions(o) }} placeholder={`Option ${idx + 1}`} style={{ ...inputStyle, flex: 1 }} />
          {options.length > 2 && <button onClick={() => setOptions(options.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 16 }}>✕</button>}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <input type="text" value={newOpt} onChange={e => setNewOpt(e.target.value)} onKeyDown={e => e.key === 'Enter' && addOption()} placeholder="Add option..." style={{ ...inputStyle, flex: 1 }} />
        <button onClick={addOption} style={{ background: C.navy3, border: `1px solid ${C.border}`, color: C.teal, borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>+ Add</button>
      </div>

      {question && options.filter(o => o.trim()).length >= 2 && (
        <div style={{ background: C.navy3, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, textAlign: 'center' }}>{question}</div>
          {options.filter(o => o.trim()).map((opt, idx) => {
            const count = votes[opt] || 0
            const pct = totalVotes > 0 ? (count / totalVotes) * 100 : 0
            const isWinner = voted && count === maxVotes && count > 0
            return (
              <div key={idx} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                  <span style={{ color: isWinner ? C.lime : C.white, fontWeight: isWinner ? 600 : 400 }}>{isWinner ? '🏆 ' : ''}{opt}</span>
                  <span style={{ fontFamily: F.mono, fontSize: 12, color: C.muted }}>{count} vote{count !== 1 ? 's' : ''}</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: isWinner ? C.lime : C.teal, borderRadius: 4, transition: 'width .5s ease' }} />
                </div>
                {!voted && <button onClick={() => vote(opt)} style={{ marginTop: 8, background: 'rgba(0,201,177,0.1)', border: `1px solid ${C.borderTeal}`, color: C.teal, borderRadius: 8, padding: '6px 16px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Vote</button>}
              </div>
            )
          })}
          {voted && <button onClick={reset} style={{ marginTop: 8, background: 'none', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontSize: 12, width: '100%' }}>Reset votes</button>}
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(184,241,66,0.06)', border: `1px solid rgba(184,241,66,0.2)`, borderRadius: 8, fontSize: 12, color: C.muted }}>💡 Share this page URL with your group so everyone can vote together</div>
        </div>
      )}
    </div>
  )
}

// ─── TOOL 7: GETAWAY COST CALCULATOR ─────────────────────────────────────────
function GetawayCostCalc() {
  const [people, setPeople] = useState(6)
  const [nights, setNights] = useState(3)
  const [spendLevel, setSpendLevel] = useState('mid')
  const [includeFlights, setIncludeFlights] = useState(false)
  const [destination, setDestination] = useState('domestic')

  const rates = {
    budget: { hotel: 80, food: 40, activities: 30, nightlife: 25 },
    mid: { hotel: 150, food: 75, activities: 60, nightlife: 60 },
    luxury: { hotel: 300, food: 150, activities: 120, nightlife: 120 },
  }
  const flightRates = { domestic: 280, international: 750 }
  const r = rates[spendLevel]
  const hotelTotal = (r.hotel * nights * Math.ceil(people / 2))
  const foodTotal = r.food * people * nights
  const activTotal = r.activities * people
  const nightlifeTotal = r.nightlife * people * (Math.min(nights, 3))
  const flightTotal = includeFlights ? flightRates[destination] * people : 0
  const grandTotal = hotelTotal + foodTotal + activTotal + nightlifeTotal + flightTotal
  const perPerson = grandTotal / people

  const fmt = n => '$' + Math.round(n).toLocaleString()

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div><FieldLabel>Number of people</FieldLabel>
          <input type="number" value={people} onChange={e => setPeople(Math.max(2, Number(e.target.value)))} min={2} max={30} style={inputStyle} />
        </div>
        <div><FieldLabel>Number of nights</FieldLabel>
          <input type="number" value={nights} onChange={e => setNights(Math.max(1, Number(e.target.value)))} min={1} max={14} style={inputStyle} />
        </div>
      </div>
      <div style={{ marginBottom: 14 }}><FieldLabel>Spend level</FieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[['budget', '💰 Budget', 'Hostels, street food'], ['mid', '🏨 Mid-range', 'Hotels, restaurants'], ['luxury', '✨ Luxury', '5-star, fine dining']].map(([val, label, sub]) => (
            <div key={val} onClick={() => setSpendLevel(val)} style={{ padding: '12px 10px', borderRadius: 10, border: `1px solid ${spendLevel === val ? C.teal : C.border}`, background: spendLevel === val ? 'rgba(0,201,177,0.1)' : C.navy3, cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: C.muted }}>
          <input type="checkbox" checked={includeFlights} onChange={e => setIncludeFlights(e.target.checked)} style={{ accentColor: C.teal, width: 16, height: 16 }} />
          Include flight estimates
        </label>
        {includeFlights && (
          <select value={destination} onChange={e => setDestination(e.target.value)} style={{ ...inputStyle, width: 180 }}>
            <option value="domestic">Domestic flight</option>
            <option value="international">International flight</option>
          </select>
        )}
      </div>

      <div style={{ background: 'rgba(0,201,177,0.06)', border: `1px solid ${C.borderTeal}`, borderRadius: 14, padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ textAlign: 'center', padding: '18px 12px', background: C.navy3, borderRadius: 10 }}>
            <div style={{ fontFamily: F.mono, fontSize: 11, color: C.muted, marginBottom: 6 }}>TOTAL TRIP COST</div>
            <div style={{ fontFamily: F.mono, fontSize: 30, fontWeight: 600, color: C.white }}>{fmt(grandTotal)}</div>
          </div>
          <div style={{ textAlign: 'center', padding: '18px 12px', background: `${C.teal}18`, borderRadius: 10, border: `1px solid ${C.borderTeal}` }}>
            <div style={{ fontFamily: F.mono, fontSize: 11, color: C.teal, marginBottom: 6 }}>PER PERSON</div>
            <div style={{ fontFamily: F.mono, fontSize: 30, fontWeight: 600, color: C.teal }}>{fmt(perPerson)}</div>
          </div>
        </div>
        {[['🏨 Accommodation', hotelTotal], ['🍽️ Food & drinks', foodTotal], ['🎯 Activities', activTotal], ['🎉 Nightlife', nightlifeTotal], ...(includeFlights ? [['✈️ Flights', flightTotal]] : [])].map(([label, val]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}`, fontSize: 13 }}>
            <span style={{ color: C.muted }}>{label}</span>
            <span style={{ fontFamily: F.mono }}>{fmt(val)} <span style={{ color: C.muted }}>({fmt(val / people)}/person)</span></span>
          </div>
        ))}
        <div style={{ marginTop: 14, fontSize: 11, color: C.muted, fontStyle: 'italic' }}>*Estimates based on typical {spendLevel} group travel costs. Actual prices vary by destination.</div>
      </div>
    </div>
  )
}

// ─── TOOL 8: VENUE FINDER ─────────────────────────────────────────────────────
function VenueFinder() {
  const [city, setCity] = useState('')
  const [partyType, setPartyType] = useState('Birthday Party')
  const [groupSize, setGroupSize] = useState('20–40 people')
  const [vibe, setVibe] = useState('Fun & casual')
  const [budget, setBudget] = useState('$500–$1,500')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!city.trim()) return
    setLoading(true); setResult('')
    const prompt = `You are a local event planning expert. Recommend the best venue options for:
- City: ${city}
- Party type: ${partyType}
- Group size: ${groupSize}
- Vibe: ${vibe}
- Budget: ${budget}

Provide:
1. Top 3 venue TYPE recommendations (e.g. rooftop bar, private dining room, event space) with:
   - Why it's perfect for this party
   - What to look for / ask when booking
   - Estimated cost range
2. Specific things to ask every venue before booking
3. 2–3 backup venue ideas if first choices are booked
4. Timing tips (how far in advance to book for this type of party)

Be practical and specific to ${city}.`
    const text = await callClaude(prompt)
    setResult(text); setLoading(false)
  }

  return (
    <div>
      <div style={{ marginBottom: 14 }}><FieldLabel>City</FieldLabel>
        <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. New York, Chicago, Los Angeles..." style={inputStyle} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div><FieldLabel>Party Type</FieldLabel>
          <select value={partyType} onChange={e => setPartyType(e.target.value)} style={inputStyle}>
            {['Birthday Party','Bachelorette Party','Graduation Party','Corporate Party','Holiday Party','NYE Party','Baby Shower','Engagement Party','Retirement Party','General Celebration'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div><FieldLabel>Group Size</FieldLabel>
          <select value={groupSize} onChange={e => setGroupSize(e.target.value)} style={inputStyle}>
            {['Under 15 people','15–30 people','30–60 people','60–100 people','100–200 people','200+ people'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div><FieldLabel>Vibe</FieldLabel>
          <select value={vibe} onChange={e => setVibe(e.target.value)} style={inputStyle}>
            {['Fun & casual','Elegant & upscale','Trendy & modern','Intimate & cozy','Outdoor / rooftop','Unique / quirky'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div><FieldLabel>Venue Budget</FieldLabel>
          <select value={budget} onChange={e => setBudget(e.target.value)} style={inputStyle}>
            {['Under $500','$500–$1,500','$1,500–$3,000','$3,000–$7,500','$7,500+','Flexible'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <PrimaryBtn onClick={generate} disabled={loading || !city.trim()} color={C.coral} textColor="#fff">
        {loading ? <><Spinner /> Finding venues...</> : '📍 Find My Venue'}
      </PrimaryBtn>
      <AIResult content={result} />
    </div>
  )
}

// ─── ARTICLES DATA ─────────────────────────────────────────────────────────────
const ARTICLES = [
  {
    id: 'how-to-plan-birthday-party', cat: 'party', tag: 'PARTY', title: 'How to Plan a Birthday Party on Any Budget',
    excerpt: 'From backyard BBQs to rented rooftops — a practical guide to planning a birthday party your guests will actually talk about.',
    readTime: '8 min',
    content: `Planning a birthday party sounds simple until you're three days out, nobody has RSVP'd, you forgot to order a cake, and you're still not sure where it's happening. Sound familiar?

The good news: with a little structure, any budget can produce a genuinely great birthday party. Here's how to do it.

## Start with three decisions, not twenty

Before you look at venues, themes, or invitations, lock in just three things: date, headcount, and budget. Everything else flows from those.

Your headcount determines your venue. Your budget determines what's possible. Your date determines how much time you have to plan. Get those three fixed first.

## Budget breakdown that actually works

A useful starting rule: allocate 40% to food and drinks, 25% to the venue, 20% to entertainment or activities, and 15% to decor and extras. This ratio holds surprisingly well from $200 backyard parties to $5,000 venue events.

At $500: backyard or home, home-cooked or catered food, a playlist and yard games.
At $1,000–$2,000: private dining room at a restaurant, full catering, possibly a DJ or photo booth.
At $3,000+: rented event space, open bar, entertainment, professional decor.

## The 6-week rule

If you're renting a venue, start looking 6–8 weeks out — especially for Saturday nights. Private dining rooms at popular restaurants book up fast. For a backyard or home party, 3–4 weeks is plenty.

## Food and drinks: the thing people actually remember

Guests forget the decorations. They don't forget the food. If you're on a tight budget, prioritize one great food element — a themed cake, a taco bar, a charcuterie spread — over spreading thin across everything.

For drinks, a signature cocktail (batch-made) plus beer and wine covers most parties without a full open bar budget.

## Invitations and RSVPs

Send digital invites (Evite, Partiful, or a simple group text) 3–4 weeks out. Include a firm RSVP date — one week before the party. Without it, you'll be chasing confirmations until the night before.

## Day-of checklist

Arrive 60–90 minutes before guests. Have music going before anyone arrives. Designate one person to manage food and drinks so the host can actually enjoy the party. Take photos early — the first hour always has the best energy.

## Use the AI Party Planner

Not sure where to start? Our free AI Party Planner builds a complete party plan from your event type, headcount, and budget. It takes 30 seconds and gives you a full timeline, vendor checklist, and activity suggestions.`,
    faqs: [
      { q: 'How far in advance should I plan a birthday party?', a: 'For a home or backyard party, 3–4 weeks is plenty. For a rented venue or larger event, give yourself 6–8 weeks.' },
      { q: 'What is a realistic budget for a birthday party?', a: 'A solid party for 20 people can be done for $300–$500 at home. Venue events typically start around $800–$1,500 for that size.' },
      { q: 'How do I get people to RSVP?', a: 'Set a firm RSVP date and send a reminder 48 hours before it. Personal texts to non-responders work better than general reminders.' },
    ]
  },
  {
    id: 'group-trip-no-drama', cat: 'trip', tag: 'TRIP', title: 'How to Plan a Group Trip Without the Drama',
    excerpt: 'Getting 8 people to agree on anything is hard. Here\'s the system that actually works for planning a group trip everyone enjoys.',
    readTime: '10 min',
    content: `Group trips are some of the best memories you'll ever make. They're also one of the most reliable ways to stress yourself out and accidentally start a fight with your closest friends.

The problem isn't the people — it's the process. Most group trips fail in the planning phase because there's no structure. Here's how to fix that.

## The #1 rule: one person leads, everyone contributes

Every successful group trip has a point person. Not a dictator — a facilitator. Someone who sets the itinerary, makes the reservations, and follows up when people go quiet. If nobody steps up, nothing gets done.

If you're reading this guide, you're probably that person. Embrace it.

## How to pick a destination everyone agrees on

Don't start with "where should we go?" That question opens a 3-day group chat spiral. Instead, ask everyone to privately submit their top 2 destinations and their hard no's. Compile the results, find the overlap, and present 2–3 realistic options.

Use our Group Vote Tool to send a clean poll to everyone — it takes 60 seconds and removes the awkwardness of real-time debate.

## Lock in dates before anything else

Dates kill more trips than budget does. Use a simple scheduling tool (When2meet or Doodle) to find the weekend that works for the most people. Accept that it will never work perfectly for everyone — 70% availability is a win.

## Set a per-person budget early

The most uncomfortable group trip conversation is the one nobody has until it's too late: money. Have it early.

Share a rough budget range before anything is booked. Ask who's comfortable with what. Some people might opt out of certain activities — that's fine. The worst scenario is people feeling financially pressured or surprised.

Use our Budget Splitter to run the numbers in real time.

## Book accommodation first, everything else second

For groups of 6+, a single Airbnb or vacation rental is almost always cheaper and better than individual hotel rooms. Shared spaces create the trip experience. Hotels just create hallway awkward encounters.

Book the place, then build the itinerary around it.

## Build in free time

The biggest mistake first-time group trip planners make is over-scheduling. Leave 2–3 hour blocks with nothing on the agenda. Groups naturally fragment and reconnect — let it happen. Not everyone wants to do everything together the whole time.

## Use the AI Trip Builder

Our free AI Trip Builder generates a full day-by-day itinerary based on your destination, group size, and vibe. It takes 60 seconds and gives you a solid starting point that you can edit and share with your group.`,
    faqs: [
      { q: 'How many people is too many for a group trip?', a: 'Groups of 6–10 are the sweet spot. Above 12, logistics get complicated. Above 15, you effectively have two separate groups anyway.' },
      { q: 'What\'s the best way to collect money from the group?', a: 'Venmo or Zelle for US groups. Have everyone pay the trip organizer, who pays vendors. Avoid having multiple people paying separately — it creates accounting chaos.' },
      { q: 'What do you do if someone cancels last minute?', a: 'Set a cancellation policy before booking. Refundable deposits help. Travel insurance for shared accommodations is worth considering for larger groups.' },
    ]
  },
  {
    id: 'bachelorette-planning-guide', cat: 'party', tag: 'PARTY', title: 'Bachelorette Party Planning: The Complete Guide (2026)',
    excerpt: 'Everything the Maid of Honor needs to know — destinations, budgets, timelines, and how to make sure the bride actually has fun.',
    readTime: '12 min',
    content: `If you're the Maid of Honor, congratulations and condolences. Bachelorette planning is one of the most logistically complex social events you'll ever organize, and everyone has opinions.

Here's the guide that makes it manageable.

## Start with the bride, not Pinterest

Before you plan anything, have one honest conversation with the bride. Ask her: What does she actually want? Big group or small? City trip or beach house? Wild or relaxed? Daytime activities or nightlife? Budget range?

Many bachelorettes go wrong because the MOH planned the party they thought the bride would want, not the one she actually wanted. Ask first.

## Typical timeline

- 3–4 months out: set the date, build the guest list, pick a destination
- 2–3 months out: book accommodation and travel
- 6–8 weeks out: send official invites with cost breakdown
- 3–4 weeks out: collect payments, book activities and reservations
- 1–2 weeks out: confirm everything, share itinerary with group
- Day before: final group chat with logistics

## Popular bachelorette destinations in 2026

Nashville, Scottsdale, and Miami remain top picks for domestic trips. New Orleans for something more unique. Tulum and Cabo are the top international options for groups willing to travel.

For low-key groups: wine country (Napa or Sonoma), a beach house rental on the East Coast, or a mountain cabin work beautifully.

## Budgeting: how to do it fairly

The standard rule: bridesmaids cover the bride's share of accommodation and group activities. Everyone pays their own travel and personal spending.

Be upfront about costs before collecting commitments. A clear per-person breakdown sent early prevents the discomfort of people finding out costs late. Use our Budget Splitter to run the numbers.

## What actually makes a great bachelorette

The memories come from the unplanned moments — the inside jokes, the late-night food run, the dance floor moment at 1am. Your job as planner is to build the right container for those moments. Great accommodation + one or two good activities + good people = great bachelorette.

Don't over-schedule. Leave evenings open. Build in a morning brunch where people can decompress and talk.

## Use the AI Party Planner

Tell our AI Party Planner it's a bachelorette party, your headcount, and budget. It'll generate a full plan with timeline, activity ideas, venue suggestions, and checklist.`,
    faqs: [
      { q: 'How much does a bachelorette party typically cost?', a: 'Domestic city trips typically run $300–$800 per person including accommodation, activities, and meals. International trips can run $1,200–$2,500+ per person.' },
      { q: 'How far in advance should you plan a bachelorette?', a: 'Start 3–4 months out, especially if traveling. Popular destinations and venues book quickly on peak weekends.' },
      { q: 'What if bridesmaids have different budgets?', a: 'Offer a tiered option — guests can opt out of premium activities while still joining for the core events. Transparency early prevents resentment later.' },
    ]
  },
  {
    id: 'split-costs-group-trip', cat: 'group', tag: 'GROUP', title: 'How to Split Costs Fairly on a Group Trip',
    excerpt: 'The money conversation nobody wants to have — but everyone needs to. Here\'s how to handle group trip finances without ruining friendships.',
    readTime: '6 min',
    content: `Money is the most reliable way to create tension on a group trip. Someone feels like they're overpaying. Someone else goes quiet when the bill comes. Someone books a cheaper hotel room "for a quick nap" and then spends the whole trip in the nice Airbnb.

Here's how to handle it cleanly.

## Set the budget before anything is booked

This seems obvious and yet most groups skip it entirely. Before any accommodation is booked, send a message to the group: "We're thinking this trip will cost roughly $X per person — is everyone comfortable with that range?"

Get explicit confirmation. Not emoji reactions. Actual "yes" replies.

## Designate one person to collect money

Multiple payment streams create multiple reconciliation problems. Pick one person (usually the trip organizer) as the financial hub. Everyone Venmos them. They pay vendors and hosts. End of trip, everything is settled through one person.

## The different methods — and when to use each

**Even split:** Everyone pays the same amount. Simple. Works when everyone is roughly in the same financial situation and doing the same activities.

**Activity opt-in:** Base costs (accommodation, shared meals) split evenly. Optional activities paid by those who join. Someone doesn't want to do the $150 food tour? They skip it and pay less overall. Fairest for groups with varied interests or budgets.

**Itemized:** Track every expense individually and settle at the end. Most accurate, most work. Best handled through apps like Splitwise or Tricount.

## The "bride/birthday person pays nothing" rule

For bachelorettes, bachelor trips, and birthday trips, the standard is that the guest of honor's share of group expenses is covered by everyone else. Communicate this clearly upfront so people can budget accordingly.

## Use the Budget Splitter

Our free Budget Splitter lets you enter all trip costs and see the per-person breakdown instantly. No spreadsheet required.`,
    faqs: [
      { q: 'What apps are best for splitting group trip costs?', a: 'Splitwise is the most popular. Tricount is good for international trips with multiple currencies. For US groups, a shared Venmo request works fine for simple splits.' },
      { q: 'What if someone can\'t afford the trip?', a: 'Give people an honest cost breakdown early enough that they can decline without awkwardness. Opting out 4 months before a trip is fine. Opting out 2 weeks before affects bookings and costs.' },
      { q: 'How do you handle someone who keeps "forgetting" to pay?', a: 'Send a specific Venmo request with the amount and due date. Public Venmo requests work surprisingly well for accountability. If someone consistently avoids paying, that\'s a conversation for after the trip.' },
    ]
  },
  {
    id: 'weekend-getaway-ideas', cat: 'trip', tag: 'TRIP', title: 'Best Weekend Getaway Ideas for Groups (2026)',
    excerpt: '15 weekend trip ideas for friend groups of 4–12 — organized by vibe, budget, and travel distance.',
    readTime: '9 min',
    content: `The best group trips aren't always the elaborate ones. Sometimes it's a lake house for a long weekend that becomes the trip people talk about for years.

Here are the best weekend getaway formats for friend groups in 2026, organized by vibe.

## Beach house rentals

The classic. A shared beach house with a big kitchen, outdoor space, and proximity to the water covers most group trip needs in one booking. The East Coast (Outer Banks, Cape May, the Hamptons) and Gulf Coast (30A, Destin, Galveston) are perennial favorites.

Book at least 3–4 months out for summer weekends. Shoulder season (May, September, October) offers the best combination of weather and availability.

## City trips

Nashville, New Orleans, Austin, and Chicago continue to dominate for group city trips. High concentration of restaurants, bars, live music, and things to do within walking distance makes logistics simple.

Book a downtown hotel (split between 3–4 rooms) or a large Airbnb for the shared house experience in a city setting.

## Cabin/mountain getaways

Perfect for groups who want to disconnect. Gatlinburg and the Smokies, the Catskills, Lake Tahoe, and Asheville all offer strong short-term rental inventory with outdoor activities nearby.

Great for: mixed age groups, groups with varying party tolerance, fall and winter trips.

## International long weekend

With the right flight deals, a 3-night international trip (Mexico, Canada, Caribbean) is more achievable than most people think. Cabo, Tulum, and Montréal are all under 4 hours from most US cities.

## Use the AI Trip Builder

Enter your destination, group size, and trip vibe. Our AI Trip Builder generates a full day-by-day itinerary in under 60 seconds — activities, meals, and logistics all included.`,
    faqs: [
      { q: 'How many nights is ideal for a group weekend trip?', a: 'Three nights (Thursday–Sunday or Friday–Monday) hits the sweet spot — enough time to settle in without the logistics fatigue of a longer trip.' },
      { q: 'What\'s the best way to find a vacation rental for a large group?', a: 'Airbnb and VRBO are the main options. Filter for homes with enough bedrooms and bathrooms. Look for properties with outdoor space for groups — porches, patios, and pools make a huge difference.' },
      { q: 'Is it better to drive or fly for a group weekend trip?', a: 'For destinations within 5–6 hours, driving in a rented van is often cheaper and more flexible than coordinating flights for a large group.' },
    ]
  },
  {
    id: 'nye-party-checklist', cat: 'party', tag: 'PARTY', title: 'NYE Party Planning Checklist (Start Here)',
    excerpt: 'New Year\'s Eve is the hardest party to plan well. This checklist makes it easy.',
    readTime: '7 min',
    content: `New Year's Eve sounds glamorous until you're trying to find a venue in December, price out alcohol for 50 people, and figure out what to do for the countdown.

The key insight: NYE is a party where the logistics are the vibe. People just want to be somewhere fun with people they like at midnight. Your job is to make sure that happens.

## The NYE planning timeline

**October / early November:** Book your venue. This is not optional. Private event spaces and private dining rooms fill up by October for NYE. If you're hosting at home, this step is skipped.

**November:** Set your guest list and send invitations with a ticket price or cost per head. NYE is one party where it's standard to charge guests to cover venue and catering.

**Early December:** Finalize catering, alcohol, and entertainment. Book a bartender if needed.

**Two weeks out:** Confirm headcount, finalize food orders, send a "what to expect" message to guests.

**Day before:** Set up as much as possible. Chill drinks. Confirm any vendors.

## The midnight moment

This is the one thing that has to go right. Have a TV or phone showing the ball drop (or your city's equivalent). Make sure everyone has something to drink for the toast. A simple 10-second countdown chant is enough — no need for elaborate production.

## Alcohol math for NYE

Budget 1.5–2 drinks per person per hour for NYE (people drink more than usual). For 30 guests over 4 hours: roughly 45–60 drink servings. A case of wine (12 bottles × ~5 glasses) = 60 glasses. Adjust based on your crowd.

## Use the AI Party Planner

Set event type to "NYE Party," enter your headcount and budget, and get a complete plan with timeline, bar setup guide, activity suggestions, and vendor checklist.`,
    faqs: [
      { q: 'How much does it cost to throw a NYE party?', a: 'Home NYE parties for 20–30 people typically run $300–$800 (alcohol and food). Rented venue events for 50+ people typically start around $2,000–$5,000 with open bar.' },
      { q: 'Should I charge guests for a NYE party?', a: 'For home parties, no. For events with a rented venue, open bar, or catering, it\'s completely standard to charge $40–$100 per person to cover costs.' },
      { q: 'What should NYE invitations say?', a: 'Include: start time (most NYE parties start at 9–10pm), location, dress code if any, whether alcohol is included or BYOB, and an RSVP deadline.' },
    ]
  },
  {
    id: 'girls-trip-planner', cat: 'trip', tag: 'TRIP', title: "Girls' Trip Planning Guide: Everything You Need",
    excerpt: "From destination to day-by-day — the complete guide to planning a girls' trip your whole group will love.",
    readTime: '9 min',
    content: `A great girls' trip is one where everyone comes home closer than when they left. Here's how to plan it.

## How to pick a destination the whole group agrees on

The mistake most groups make: asking everyone to suggest ideas and then trying to build consensus from 8 different answers. Instead, have everyone privately rank 3 options from a pre-selected shortlist. Shortlist should be based on: budget, travel distance, and whether it suits the majority vibe (relaxed vs. party-focused).

Use the Group Vote Tool on this site — it takes 2 minutes.

## Top girls' trip destinations in 2026

**For the party crew:** Nashville, Miami, Las Vegas, New Orleans, Austin
**For the relax-and-recharge group:** Napa/Sonoma, Sedona, a beach house rental, Asheville
**For international:** Tulum, Cabo, Italy (Amalfi Coast), Portugal (Lisbon/Porto), Bali
**For long weekends:** Charleston, New Orleans, Chicago, Savannah

## What actually makes a girls' trip great

One anchor activity per day (spa, boat tour, cooking class, winery) + freedom for the rest of the day. Shared meals, especially dinners. One night of real dancing. At least one lazy morning where nobody has anywhere to be.

## The accommodation question

For groups of 4–8, a vacation rental (Airbnb/VRBO) beats hotel rooms almost every time. Shared kitchen means a breakfast-in option. Shared common space means the pre-going-out hang is built in. More bang for the money.

For groups of 10+, a hotel block or boutique hotel with multiple rooms is often simpler to coordinate.

## Use the AI Trip Builder

Tell the AI it's a girls' trip, your destination, group size, and vibe. You'll get a full day-by-day itinerary with hotel suggestions, activity ideas, restaurant recommendations, and budget estimates.`,
    faqs: [
      { q: "How much does a girls' trip typically cost?", a: "Domestic trips run $400–$1,000 per person for a long weekend. International trips typically run $1,500–$3,000 per person depending on destination and spend level." },
      { q: "What's the best number of people for a girls' trip?", a: "4–8 is the sweet spot. Small enough to get everyone in the same Airbnb and make group decisions easily. Big enough to have real energy." },
      { q: "How do you handle it if someone can't come?", a: "Once you have 70%+ confirmation on a date, lock it in. Waiting for 100% means it never happens. Let latecomers join if they can make the date work." },
    ]
  },
  {
    id: 'surprise-party-tips', cat: 'party', tag: 'PARTY', title: 'How to Plan a Surprise Party (Without Getting Caught)',
    excerpt: 'Surprise parties are high-risk, high-reward. Here\'s how to pull it off without anyone spoiling it.',
    readTime: '7 min',
    content: `Surprise parties are genuinely magical when they work. When they don't work — when someone accidentally tells the guest of honor, or the guest of honor almost cancels plans that day, or they arrive to an empty parking lot — they're a disaster.

Here's how to make yours work.

## Pick a co-conspirator

You cannot pull off a surprise party alone. You need at least one person who can keep the guest of honor occupied on the day, coordinate the guest arrival timing, and be your backup communicator if anything goes sideways.

Choose someone the guest of honor trusts enough to accept plans from without suspicion.

## The cover story

The cover story is everything. It needs to be specific enough to be believable, low-key enough that the guest of honor won't dress up or act differently, but compelling enough that they'll actually show up.

Good cover stories: "casual dinner at [friend]'s place," "just a few of us grabbing drinks," "we're doing a low-key birthday thing." Avoid anything that sounds like it could be a bigger deal.

## Managing the guest list

Tell every guest, in writing: "This is a surprise party. Do NOT post about it on social media before the event. Do NOT mention it to [name] or any of their family members who might tell them."

Assume anything you tell 30 people will eventually get back to the guest of honor. The question is whether it gets back before or after the party.

## The arrival window

Set a clear arrival time for guests — ideally 30–45 minutes before the guest of honor arrives. Use a group chat to share real-time updates on where the guest of honor is. "They just left the restaurant — 10 minutes away. Everyone hide."

## The moment

Keep the lights normal or low — not off. Pitch-black surprise reveals are terrifying, not fun. Have someone by the door to signal guests. "SURPRISE" shouted at a reasonable volume by a group of people who care about the person is the goal.

## Use the AI Party Planner

Set event type to "Surprise Party" and let the AI build a complete plan with a coordination timeline, guest management tips, and setup checklist.`,
    faqs: [
      { q: 'How far in advance should you plan a surprise party?', a: 'Give yourself 4–6 weeks minimum. You need time to coordinate the guest list, lock in a cover story, book any venue or catering, and manage communication without leaks.' },
      { q: 'What do you do if someone accidentally tells them?', a: 'Acknowledge it, laugh about it, and keep going. A "ruined" surprise party where the person knows in advance is still a great party.' },
      { q: 'Is it a good idea to do a surprise party?', a: "Depends entirely on the person. Some people love being the center of attention. Some people hate it. If there's any doubt, ask them obliquely: 'Do you like surprise parties?' or ask someone close to them." },
    ]
  },
  {
    id: 'graduation-party-guide', cat: 'party', tag: 'PARTY', title: 'Graduation Party Planning Guide (High School & College)',
    excerpt: 'How to plan a graduation party that actually celebrates the moment — from backyard gatherings to rented venues.',
    readTime: '8 min',
    content: `A graduation party has one job: make the graduate feel celebrated. Everything else is secondary.

Here's how to do it right without overcomplicating it.

## Timing: before or after graduation?

Most graduation parties happen the weekend immediately following the ceremony. The risk: graduation weekend is busy for everyone, and guests may have competing commitments. An alternative is the following weekend — guests are more available and the graduate has had a moment to breathe.

For college graduations, a party the night before or the day of graduation at a local venue works well for out-of-town guests who are already in the area.

## Who to invite

This is the first decision that shapes everything else. A party for close family and friends (20–40 people) is a fundamentally different event than an open-house style celebration for 80+ where guests drop in throughout the afternoon.

Open house format (typically 12pm–5pm, guests come and go) is ideal for large guest lists. A set dinner party or evening event works better for smaller, closer groups.

## The venue decision

Backyard: best for budget, best for casual family atmosphere, requires setup and cleanup.
Restaurant private dining room: easiest for the host, mid-range cost, 2–3 hours and done.
Rented event space: highest cost, most flexibility, necessary for 75+ guests.
Community clubhouse or church hall: often affordable and available, works well for open-house format.

## Decor that doesn't break the bank

Photo displays (printed photos or a digital slideshow) are universally loved and cost almost nothing. A banner and balloon arrangement at the entry. A small candy or dessert bar. These three things photograph well and create the party atmosphere without heavy investment.

School colors or the graduate's favorite colors as the palette keeps it personal.

## Use the AI Party Planner

Set event type to "Graduation Party," enter your headcount and budget, and get a complete plan with timeline, food and drink quantities, decor ideas, and vendor checklist.`,
    faqs: [
      { q: 'How much does a graduation party cost?', a: 'Backyard parties for 30–50 guests typically run $400–$1,000 (food, drinks, decor). Catered events at a venue for the same headcount typically start around $1,500–$2,500.' },
      { q: 'What food is best for a graduation party?', a: 'Finger foods and appetizers (passed or stationed) work well for open house format. A taco bar, BBQ spread, or sandwich station works well for a more set event. Always have a dedicated cake or dessert moment.' },
      { q: 'Do you need to give a gift at a graduation party?', a: "Typically yes — cash, a gift card, or a practical gift (dorm items for high school grads, professional items for college grads) are all appropriate." },
    ]
  },
  {
    id: 'free-ai-party-planner', cat: 'party', tag: 'POPULAR', title: 'Is There a Free AI Party Planner? (Yes, Right Here)',
    excerpt: 'What an AI party planner can do, what it can\'t, and how to use ours to build a complete party plan in under a minute.',
    readTime: '5 min',
    content: `Yes — and you don't need to sign up for anything, download an app, or pay a subscription. It's right here on PartyTripping.

## What does an AI party planner actually do?

A good AI party planner takes your event details — type of party, headcount, budget, vibe, and location — and generates a comprehensive plan. That includes a timeline, food and drink suggestions, activity ideas, a vendor checklist, and budget breakdown.

It gives you a solid starting point that would otherwise take an hour of research to build from scratch. Most people use it as a first draft: get the AI plan, then customize based on your specific preferences and local options.

## What our AI Party Planner generates

When you enter your details into the PartyTripping AI Party Planner, you get:

1. A complete event timeline (setup through cleanup)
2. Food and drink menu suggestions for your vibe and headcount
3. Entertainment and activity ideas
4. Decor suggestions
5. A vendor checklist with budget breakdown
6. Pro tips specific to your party type

It takes about 30 seconds.

## What it can't do

The AI gives you a plan based on general best practices and common options. It doesn't know your city's specific venues, local vendors, or current pricing. Use it as a framework — then apply your local knowledge.

It also can't replace tasting a caterer's food, visiting a venue, or knowing your specific group of friends. The human judgment layer is still yours.

## How to get the most out of it

Be specific with your inputs. "Birthday party for 25 people, $800 budget, backyard, casual vibe" produces a much more useful plan than "birthday party." The more detail you give the AI, the more tailored the output.

Try the AI Party Planner now — it's free, instant, and no sign-up required.`,
    faqs: [
      { q: 'Is the PartyTripping AI Party Planner really free?', a: 'Yes — completely free, no sign-up required, no trial period. Just enter your details and get your plan.' },
      { q: 'How accurate is the AI party plan?', a: 'The timeline, food suggestions, and activity ideas are solid for most common party types. Budget estimates are ballpark figures — actual costs vary by city and vendor.' },
      { q: 'Can I use the AI planner for a trip too?', a: 'Yes — we also have an AI Trip Builder that generates full day-by-day itineraries for group trips. Same free, no-signup format.' },
    ]
  },
]

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ page, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 48px', background: 'rgba(7,18,32,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,201,177,0.1)' }}>
      <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: F.display, fontSize: 22 }}>
        <span style={{ color: C.coral }}>Party</span><span style={{ color: C.teal }}>Tripping</span>
      </button>
      <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        {[['Party Tools', 'tools-party'], ['Trip Tools', 'tools-trip'], ['Guides', 'guides']].map(([label, pg]) => (
          <button key={pg} onClick={() => setPage(pg)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: page === pg ? C.white : C.muted, fontSize: 14, fontWeight: 500, transition: 'color .2s' }}>{label}</button>
        ))}
        <button onClick={() => setPage('tools-party')} style={{ background: C.coral, border: 'none', color: '#fff', padding: '9px 20px', borderRadius: 50, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: F.body }}>Plan Now — Free</button>
      </div>
    </nav>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background: C.navy, borderTop: `1px solid ${C.border}`, padding: '60px 48px 40px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: F.display, fontSize: 24, marginBottom: 14 }}><span style={{ color: C.coral }}>Party</span><span style={{ color: C.teal }}>Tripping</span></div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, maxWidth: 260 }}>Free AI planning tools for friend groups. No sign-up, no app, no stress — just better parties and better trips.</p>
          </div>
          {[
            ['Party Tools', [['AI Party Planner', 'tools-party'], ['Guest List Tracker', 'tools-party'], ['Budget Calculator', 'tools-party'], ['Venue Finder', 'tools-party']]],
            ['Trip Tools', [['AI Trip Builder', 'tools-trip'], ['Cost Splitter', 'tools-trip'], ['Packing List', 'tools-trip'], ['Getaway Calc', 'tools-trip']]],
            ['Guides', [['Party Planning', 'guides'], ['Group Trips', 'guides'], ['Bachelorette', 'bachelorette-planning-guide'], ['Budget Tips', 'split-costs-group-trip']]],
          ].map(([heading, links]) => (
            <div key={heading}>
              <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: C.muted, marginBottom: 16, fontFamily: F.mono }}>{heading}</h4>
              {links.map(([label, pg]) => (
                <button key={label} onClick={() => setPage(pg)} style={{ display: 'block', background: 'none', border: 'none', fontSize: 13, color: 'rgba(240,249,246,0.5)', marginBottom: 10, cursor: 'pointer', textAlign: 'left', transition: 'color .2s', fontFamily: F.body }}>{label}</button>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: C.muted }}>© 2026 PartyTripping.com · Made with <span style={{ color: C.coral }}>♥</span> for friend groups</div>
          <div style={{ fontSize: 12, color: C.muted }}>Free forever · No account needed</div>
        </div>
      </div>
    </footer>
  )
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 48px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 20% 50%, rgba(255,92,77,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 50%, rgba(0,201,177,0.12) 0%, transparent 70%), radial-gradient(ellipse 100% 60% at 50% 100%, rgba(184,241,66,0.05) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,201,177,0.1)', border: `1px solid rgba(0,201,177,0.25)`, borderRadius: 50, padding: '6px 16px', fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 28, animation: 'fadeUp .6s ease both', fontFamily: F.mono }}>
          ✦ AI-Powered · No Sign-Up · Always Free
        </div>

        <h1 style={{ position: 'relative', zIndex: 1, fontFamily: F.display, fontSize: 'clamp(52px, 7vw, 88px)', lineHeight: 1.05, textAlign: 'center', marginBottom: 20, animation: 'fadeUp .6s .1s ease both' }}>
          Plan the <span style={{ color: C.coral }}>Party.</span><br />
          Plan the <span style={{ color: C.teal }}>Trip.</span><br />
          <span style={{ color: C.muted, fontSize: '0.7em' }}>Plan it all.</span>
        </h1>

        <p style={{ position: 'relative', zIndex: 1, fontSize: 18, color: C.muted, textAlign: 'center', maxWidth: 520, lineHeight: 1.6, marginBottom: 56, animation: 'fadeUp .6s .2s ease both' }}>
          Free AI tools for friend groups — birthday bashes, bachelorettes, weekend getaways, and every social adventure in between.
        </p>

        {/* TWO PATH CARDS */}
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%', maxWidth: 860, animation: 'fadeUp .6s .3s ease both' }}>
          {[
            { key: 'party', emoji: '🎉', label: 'Plan a Party', desc: 'Birthday parties, bachelorettes, backyard BBQs, holiday bashes — AI builds your full plan in seconds.', tools: ['AI Party Planner', 'Budget Calculator', 'Guest List Tool', 'Venue Finder'], page: 'tools-party', color: C.coral, btnText: 'Plan a Party →' },
            { key: 'trip', emoji: '✈️', label: 'Plan a Trip', desc: 'Girls trips, group getaways, bachelor weekends — AI builds your itinerary and splits the costs.', tools: ['AI Trip Builder', 'Cost Splitter', 'Packing List', 'Group Vote'], page: 'tools-trip', color: C.teal, btnText: 'Plan a Trip →' },
          ].map(card => (
            <div key={card.key} onClick={() => setPage(card.page)} style={{ borderRadius: 20, padding: '36px 32px', cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: 'transform .25s, box-shadow .25s', border: `1px solid ${card.color}44`, background: `linear-gradient(135deg, ${card.color}18, ${card.color}08)` }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 20px 60px ${card.color}30` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', filter: 'blur(60px)', bottom: -60, right: -40, opacity: .35, background: card.color, pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{ fontSize: 40, marginBottom: 16, display: 'block' }}>{card.emoji}</span>
                <div style={{ fontFamily: F.display, fontSize: 28, marginBottom: 8, color: card.color }}>{card.label}</div>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>{card.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  {card.tools.map(t => <span key={t} style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 50, background: card.color + '22', color: card.color, fontFamily: F.mono }}>{t}</span>)}
                </div>
                <button style={{ padding: '12px 24px', borderRadius: 50, border: 'none', background: card.color, color: card.key === 'trip' ? C.navy : '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: F.body }}>{card.btnText}</button>
              </div>
            </div>
          ))}
        </div>

        {/* TRUST BAR */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 32, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap', animation: 'fadeUp .6s .4s ease both' }}>
          {['No account needed', '100% free tools', 'Works for any group size', 'AI-powered in seconds'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.muted }}>
              <span style={{ color: C.lime }}>✓</span> {item}
            </div>
          ))}
        </div>
      </section>

      {/* TOOLS PREVIEW */}
      <section style={{ padding: '100px 48px', background: C.navy2 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionLabel>✦ Free Tools</SectionLabel>
          <h2 style={{ fontFamily: F.display, fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: 48 }}>Everything your group needs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { emoji: '🎂', name: 'AI Party Planner', desc: 'Full party plan from event type, headcount & budget', badge: 'PARTY', color: C.coral, page: 'tools-party' },
              { emoji: '🗺️', name: 'AI Trip Builder', desc: 'Day-by-day itinerary for any group destination', badge: 'TRIP', color: C.teal, page: 'tools-trip' },
              { emoji: '💸', name: 'Budget Splitter', desc: 'Enter all costs and split per person instantly', badge: 'GROUP', color: C.lime, page: 'tools-trip' },
              { emoji: '🗳️', name: 'Group Vote Tool', desc: "Can't agree? Generate a poll for your group", badge: 'GROUP', color: C.orange, page: 'tools-trip' },
              { emoji: '🧳', name: 'Packing List Gen', desc: 'Custom packing list by trip type and duration', badge: 'TRIP', color: C.teal, page: 'tools-trip' },
              { emoji: '📋', name: 'Guest List Tracker', desc: 'RSVP tracker with dietary notes and headcount', badge: 'PARTY', color: C.coral, page: 'tools-party' },
              { emoji: '🏨', name: 'Getaway Cost Calc', desc: 'Estimate total trip cost by group and nights', badge: 'TRIP', color: C.lime, page: 'tools-trip' },
              { emoji: '📍', name: 'Venue Finder', desc: 'AI venue suggestions by city, party type & size', badge: 'PARTY', color: C.orange, page: 'tools-party' },
            ].map(t => (
              <div key={t.name} onClick={() => setPage(t.page)} style={{ background: C.navy3, border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px 20px', cursor: 'pointer', transition: 'transform .2s, border-color .2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = t.color + '66' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = C.border }}>
                <span style={{ fontSize: 28, marginBottom: 14, display: 'block' }}>{t.emoji}</span>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginBottom: 12 }}>{t.desc}</div>
                <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 50, background: t.color + '22', color: t.color, fontFamily: F.mono }}>{t.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARTICLES PREVIEW */}
      <section style={{ padding: '100px 48px', background: C.navy }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionLabel>✦ Planning Guides</SectionLabel>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <h2 style={{ fontFamily: F.display, fontSize: 'clamp(28px, 3vw, 40px)' }}>Answers for every occasion</h2>
            <button onClick={() => setPage('guides')} style={{ background: 'none', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 50, padding: '8px 18px', cursor: 'pointer', fontSize: 13, fontFamily: F.body }}>View all guides →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {ARTICLES.slice(0, 6).map(a => (
              <div key={a.id} onClick={() => setPage(a.id)} style={{ background: C.navy3, border: `1px solid ${C.border}`, borderRadius: 16, padding: '28px 24px', cursor: 'pointer', transition: 'transform .2s, border-color .2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(0,201,177,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = C.border }}>
                <div style={{ marginBottom: 14 }}><Tag color={a.cat === 'party' ? C.coral : a.cat === 'trip' ? C.teal : C.lime}>{a.tag}</Tag></div>
                <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4, marginBottom: 10 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{a.readTime} read</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AFFILIATE STRIP */}
      <section style={{ padding: '60px 48px', background: C.navy2, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: F.mono, fontSize: 11, color: C.muted, marginBottom: 28, letterSpacing: '.06em', textTransform: 'uppercase' }}>Booking & vendor partners</div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
            {['Hotels.com', 'Viator', 'Airbnb', 'GigSalad', 'Booking.com', 'Amazon', 'Eventbrite'].map(p => (
              <div key={p} style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.22)', letterSpacing: '.04em' }}>{p}</div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// ─── TOOLS PAGE ───────────────────────────────────────────────────────────────
const PARTY_TOOLS = [
  { id: 'ai-party', label: 'AI Party Planner', emoji: '🎉', component: AIPartyPlanner },
  { id: 'guest-list', label: 'Guest List Tracker', emoji: '📋', component: GuestListTracker },
  { id: 'venue-finder', label: 'Venue Finder', emoji: '📍', component: VenueFinder },
  { id: 'budget-splitter', label: 'Budget Splitter', emoji: '💸', component: BudgetSplitter },
]
const TRIP_TOOLS = [
  { id: 'ai-trip', label: 'AI Trip Builder', emoji: '✈️', component: AITripBuilder },
  { id: 'cost-splitter', label: 'Cost Splitter', emoji: '💸', component: BudgetSplitter },
  { id: 'packing-list', label: 'Packing List', emoji: '🧳', component: PackingListGen },
  { id: 'getaway-calc', label: 'Getaway Cost Calc', emoji: '🏨', component: GetawayCostCalc },
  { id: 'group-vote', label: 'Group Vote', emoji: '🗳️', component: GroupVoteTool },
]

function ToolsPage({ mode, setPage }) {
  const tools = mode === 'party' ? PARTY_TOOLS : TRIP_TOOLS
  const [activeTab, setActiveTab] = useState(tools[0].id)
  const ActiveTool = tools.find(t => t.id === activeTab)?.component || (() => null)
  const color = mode === 'party' ? C.coral : C.teal

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh' }}>
      <div style={{ background: C.navy2, borderBottom: `1px solid ${C.border}`, padding: '48px 48px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button onClick={() => setPage('tools-party')} style={{ padding: '8px 18px', borderRadius: 50, border: `1px solid ${mode === 'party' ? C.coral : C.border}`, background: mode === 'party' ? `${C.coral}22` : 'transparent', color: mode === 'party' ? C.coral : C.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: F.body }}>🎉 Party Tools</button>
            <button onClick={() => setPage('tools-trip')} style={{ padding: '8px 18px', borderRadius: 50, border: `1px solid ${mode === 'trip' ? C.teal : C.border}`, background: mode === 'trip' ? `${C.teal}22` : 'transparent', color: mode === 'trip' ? C.teal : C.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: F.body }}>✈️ Trip Tools</button>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {tools.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '12px 18px', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === t.id ? color : 'transparent'}`, color: activeTab === t.id ? C.white : C.muted, fontSize: 14, fontWeight: activeTab === t.id ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: F.body, transition: 'color .2s' }}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 48px 80px' }}>
        <div style={{ background: C.navy2, border: `1px solid ${color}33`, borderRadius: 20, padding: '36px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${color}, ${mode === 'party' ? C.orange : C.lime})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              {tools.find(t => t.id === activeTab)?.emoji}
            </div>
            <div>
              <div style={{ fontFamily: F.display, fontSize: 20 }}>{tools.find(t => t.id === activeTab)?.label}</div>
              <div style={{ fontSize: 12, color: C.muted }}>Free · No sign-up · Instant results</div>
            </div>
          </div>
          <ActiveTool />
        </div>
      </div>
    </div>
  )
}

// ─── GUIDES PAGE ──────────────────────────────────────────────────────────────
function GuidesPage({ setPage }) {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? ARTICLES : ARTICLES.filter(a => a.cat === filter)

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh' }}>
      <div style={{ background: C.navy2, padding: '60px 48px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionLabel>✦ Planning Guides</SectionLabel>
          <h1 style={{ fontFamily: F.display, fontSize: 'clamp(32px, 4vw, 52px)', marginBottom: 16 }}>Everything you need to know</h1>
          <p style={{ fontSize: 16, color: C.muted, maxWidth: 500 }}>Free planning guides for parties, group trips, and every social occasion.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
            {[['all', 'All Guides'], ['party', '🎉 Party'], ['trip', '✈️ Trip'], ['group', '🤝 Group']].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)} style={{ padding: '8px 18px', borderRadius: 50, border: `1px solid ${filter === val ? C.teal : C.border}`, background: filter === val ? `${C.teal}22` : 'transparent', color: filter === val ? C.teal : C.muted, fontSize: 13, fontWeight: filter === val ? 600 : 400, cursor: 'pointer', fontFamily: F.body }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 48px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {filtered.map(a => (
            <div key={a.id} onClick={() => setPage(a.id)} style={{ background: C.navy2, border: `1px solid ${C.border}`, borderRadius: 16, padding: '28px 24px', cursor: 'pointer', transition: 'transform .2s, border-color .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(0,201,177,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = C.border }}>
              <div style={{ marginBottom: 14 }}><Tag color={a.cat === 'party' ? C.coral : a.cat === 'trip' ? C.teal : C.lime}>{a.tag}</Tag></div>
              <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4, marginBottom: 8 }}>{a.title}</div>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, marginBottom: 16 }}>{a.excerpt}</p>
              <div style={{ fontSize: 12, color: C.muted }}>{a.readTime} read</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── ARTICLE PAGE ─────────────────────────────────────────────────────────────
function ArticlePage({ article, setPage }) {
  if (!article) return null
  const toolPage = article.cat === 'trip' ? 'tools-trip' : 'tools-party'
  const toolName = article.cat === 'trip' ? 'AI Trip Builder' : 'AI Party Planner'
  const related = ARTICLES.filter(a => a.id !== article.id && a.cat === article.cat).slice(0, 3)

  return (
    <div style={{ paddingTop: 80 }}>
      <div style={{ background: C.navy2, padding: '60px 48px 48px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <button onClick={() => setPage('guides')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, marginBottom: 20, fontFamily: F.body }}>← Back to Guides</button>
          <div style={{ marginBottom: 16 }}><Tag color={article.cat === 'party' ? C.coral : article.cat === 'trip' ? C.teal : C.lime}>{article.tag}</Tag></div>
          <h1 style={{ fontFamily: F.display, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1, marginBottom: 16 }}>{article.title}</h1>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>{article.excerpt}</p>
          <div style={{ fontSize: 13, color: C.muted }}>{article.readTime} read · Free guide</div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 48px 20px' }}>
        {/* Article body */}
        <div style={{ fontSize: 16, lineHeight: 1.8, color: '#c8ddd8' }}>
          {article.content.split('\n\n').map((block, i) => {
            if (block.startsWith('## ')) return <h2 key={i} style={{ fontFamily: F.display, fontSize: 24, color: C.white, margin: '36px 0 16px' }}>{block.replace('## ', '')}</h2>
            if (block.startsWith('**') && block.endsWith('**')) return <p key={i} style={{ fontWeight: 600, color: C.white, margin: '0 0 14px' }}>{block.replace(/\*\*/g, '')}</p>
            return <p key={i} style={{ margin: '0 0 18px', color: '#b8ccc8' }}>{block}</p>
          })}
        </div>

        {/* Tool CTA */}
        <div style={{ margin: '40px 0', padding: 28, background: `${article.cat === 'party' ? C.coral : C.teal}18`, border: `1px solid ${article.cat === 'party' ? C.coral : C.teal}44`, borderRadius: 16 }}>
          <div style={{ fontFamily: F.display, fontSize: 22, marginBottom: 10, color: article.cat === 'party' ? C.coral : C.teal }}>Try the Free {toolName}</div>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: 20, lineHeight: 1.6 }}>Build a complete plan in under 60 seconds. No sign-up, no download — completely free.</p>
          <button onClick={() => setPage(toolPage)} style={{ background: article.cat === 'party' ? C.coral : C.teal, border: 'none', color: article.cat === 'party' ? '#fff' : C.navy, padding: '12px 24px', borderRadius: 50, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: F.body }}>
            Open {toolName} →
          </button>
        </div>

        {/* FAQ */}
        {article.faqs && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: F.display, fontSize: 26, marginBottom: 20 }}>Frequently Asked Questions</h2>
            {article.faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, color: C.white }}>{faq.q}</div>
                <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <div style={{ background: C.navy2, padding: '48px 48px 60px', borderTop: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <h3 style={{ fontFamily: F.display, fontSize: 24, marginBottom: 24 }}>More {article.cat === 'party' ? 'Party' : 'Trip'} Guides</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {related.map(a => (
                <div key={a.id} onClick={() => { setPage(a.id); window.scrollTo(0, 0) }} style={{ background: C.navy3, border: `1px solid ${C.border}`, borderRadius: 14, padding: '22px 20px', cursor: 'pointer' }}>
                  <div style={{ marginBottom: 10 }}><Tag color={a.cat === 'party' ? C.coral : a.cat === 'trip' ? C.teal : C.lime}>{a.tag}</Tag></div>
                  <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4 }}>{a.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState(() => urlToPage(window.location.pathname))

  useEffect(() => {
    const handlePop = () => setPage(urlToPage(window.location.pathname))
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  const navigate = (newPage) => {
    window.history.pushState({}, '', pageToUrl(newPage))
    setPage(newPage)
    window.scrollTo(0, 0)
  }

  // Determine which component to render
  const article = ARTICLES.find(a => a.id === page)
  const isToolsParty = page === 'tools-party'
  const isToolsTrip = page === 'tools-trip'

  return (
    <>
      <style>{globalStyles}</style>
      <Nav page={page} setPage={navigate} />
      <main>
        {page === 'home' && <HomePage setPage={navigate} />}
        {(isToolsParty || isToolsTrip) && <ToolsPage mode={isToolsParty ? 'party' : 'trip'} setPage={navigate} />}
        {page === 'guides' && <GuidesPage setPage={navigate} />}
        {article && <ArticlePage article={article} setPage={navigate} />}
        {!page || (!['home', 'tools-party', 'tools-trip', 'guides'].includes(page) && !article) && <HomePage setPage={navigate} />}
      </main>
      <Footer setPage={navigate} />
    </>
  )
}
