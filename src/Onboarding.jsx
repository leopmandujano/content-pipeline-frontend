import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Onboarding() {
  const navigate = useNavigate()
  const [niche, setNiche] = useState('')
  const [competitors, setCompetitors] = useState('')
  const [exampleScript, setExampleScript] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #080808; }
      .ob-input {
        width: 100%; padding: 10px 14px;
        background: #111; border: 1px solid rgba(255,255,255,0.08);
        border-radius: 8px; color: white;
        font-family: 'DM Sans', sans-serif; font-size: 14px;
        outline: none; transition: border-color 0.2s;
      }
      .ob-input:focus { border-color: rgba(255,255,255,0.25); }
      .ob-input::placeholder { color: rgba(255,255,255,0.2); }
      .ob-textarea {
        width: 100%; padding: 10px 14px;
        background: #111; border: 1px solid rgba(255,255,255,0.08);
        border-radius: 8px; color: white;
        font-family: 'DM Sans', sans-serif; font-size: 14px;
        outline: none; transition: border-color 0.2s;
        resize: vertical; min-height: 140px; line-height: 1.6;
      }
      .ob-textarea:focus { border-color: rgba(255,255,255,0.25); }
      .ob-textarea::placeholder { color: rgba(255,255,255,0.2); }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])
  useEffect(() => {
    const email = localStorage.getItem('currentUser')
    if (!email) return
    const userData = JSON.parse(localStorage.getItem(email))
    if (!userData) return
    if (userData.niche) setNiche(userData.niche)
    if (userData.competitors) setCompetitors(userData.competitors.join(', '))
    if (userData.exampleScript) setExampleScript(userData.exampleScript)
  }, [])

  const handleSave = () => {
    if (!niche) { setError('Please enter your niche'); return }
    const email = localStorage.getItem('currentUser')
    const user = JSON.parse(localStorage.getItem(email))
    const updated = {
      ...user,
      onboarded: true,
      niche,
      competitors: competitors.split(',').map(c => c.trim()).filter(c => c !== ''),
      exampleScript
    }
    localStorage.setItem(email, JSON.stringify(updated))
    navigate('/dashboard')
  }

  const s = {
    page: { minHeight: '100vh', background: '#080808', fontFamily: 'DM Sans, sans-serif', color: 'white' },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
    logo: { fontFamily: 'Geist Mono, monospace', fontSize: '13px', color: 'white', letterSpacing: '0.05em' },
    main: { maxWidth: '560px', margin: '0 auto', padding: '60px 24px' },
    tag: { fontFamily: 'Geist Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' },
    title: { fontSize: '26px', fontWeight: '300', letterSpacing: '-0.02em', marginBottom: '8px' },
    sub: { fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginBottom: '40px', lineHeight: '1.7' },
    fieldLabel: { display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' },
    fieldHint: { fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginBottom: '8px', lineHeight: '1.5' },
    field: { marginBottom: '24px' },
    divider: { borderTop: '1px solid rgba(255,255,255,0.06)', margin: '32px 0' },
    error: { fontSize: '13px', color: '#f87171', marginBottom: '20px', padding: '10px 14px', background: 'rgba(248,113,113,0.08)', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.15)' },
    btn: { width: '100%', padding: '11px', background: 'white', color: 'black', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' },
  }

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.logo}>content pipeline</div>
      </nav>

      <div style={s.main}>
        <div style={s.tag}>Setup</div>
        <h1 style={s.title}>Set up your profile</h1>
        <p style={s.sub}>This personalizes every topic, angle, and script to your specific niche and audience.</p>

        {error && <div style={s.error}>{error}</div>}

        <div style={s.field}>
          <label style={s.fieldLabel}>Your niche</label>
          <input
            className="ob-input"
            type="text"
            placeholder="e.g. personal finance for Gen Z"
            value={niche}
            onChange={e => setNiche(e.target.value)}
          />
        </div>

        <div style={s.field}>
          <label style={s.fieldLabel}>Competitor accounts</label>
          <p style={s.fieldHint}>Separate by commas — e.g. @humphreytalks, @grahamstephan</p>
          <input
            className="ob-input"
            type="text"
            placeholder="@account1, @account2, @account3"
            value={competitors}
            onChange={e => setCompetitors(e.target.value)}
          />
        </div>

        <div style={s.divider} />

        <div style={s.field}>
          <label style={s.fieldLabel}>Your best performing script</label>
          <p style={s.fieldHint}>Paste a script that performed well — this teaches the AI your tone and style</p>
          <textarea
            className="ob-textarea"
            placeholder="Paste your script here..."
            value={exampleScript}
            onChange={e => setExampleScript(e.target.value)}
          />
        </div>

        <button style={s.btn} onClick={handleSave}>
          Save and go to dashboard →
        </button>
      </div>
    </div>
  )
}

export default Onboarding