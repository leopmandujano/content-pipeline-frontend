import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #080808; }
      .dash-card {
        background: #0d0d0d; border: 1px solid rgba(255,255,255,0.07);
        border-radius: 14px; padding: 28px;
        display: flex; flex-direction: column; justify-content: space-between;
        min-height: 180px; transition: border-color 0.2s, background 0.2s;
        cursor: pointer;
      }
      .dash-card:hover { border-color: rgba(255,255,255,0.15); background: #111; }
      .dash-card-btn {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 8px 16px; border-radius: 6px;
        font-family: 'DM Sans', sans-serif; font-size: 13px;
        cursor: pointer; transition: all 0.2s; align-self: flex-start;
        margin-top: 24px;
      }
      .dash-card-btn-primary { background: white; color: black; border: none; font-weight: 500; }
      .dash-card-btn-secondary { background: transparent; color: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.1); }
      .dash-card-btn-secondary:hover { color: white; border-color: rgba(255,255,255,0.3); }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  useEffect(() => {
    const email = localStorage.getItem('currentUser')
    if (!email) { navigate('/login'); return }
    const userData = JSON.parse(localStorage.getItem(email))
    if (!userData || !userData.onboarded) { navigate('/onboarding'); return }
    setUser(userData)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/')
  }

  if (!user) return null

  const cards = [
    {
      tag: 'Create',
      title: 'Content Pipeline',
      desc: 'Find trending topics, pick an angle, and get a full script written in your style',
      btn: 'Start creating',
      primary: true,
      route: '/pipeline'
    },
    {
      tag: 'Analyze',
      title: 'Analytics',
      desc: 'Upload your performance data and get AI insights on what is working for your audience',
      btn: 'View analytics',
      primary: false,
      route: '/analytics'
    },
    {
      tag: 'Settings',
      title: 'Profile',
      desc: 'Update your niche, competitor accounts, and example scripts to improve your outputs',
      btn: 'Edit profile',
      primary: false,
      route: '/onboarding'
    }
  ]

  const s = {
    page: { minHeight: '100vh', background: '#080808', fontFamily: 'DM Sans, sans-serif', color: 'white' },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
    logo: { fontFamily: 'Geist Mono, monospace', fontSize: '13px', color: 'white', letterSpacing: '0.05em' },
    navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
    navEmail: { fontFamily: 'Geist Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' },
    navBtn: { padding: '7px 16px', background: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' },
    main: { maxWidth: '900px', margin: '0 auto', padding: '60px 40px' },
    greeting: { fontFamily: 'Geist Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' },
    title: { fontSize: '28px', fontWeight: '300', letterSpacing: '-0.02em', marginBottom: '6px' },
    niche: { fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '48px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' },
    cardTag: { fontFamily: 'Geist Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' },
    cardTitle: { fontSize: '16px', fontWeight: '500', color: 'white', marginBottom: '8px' },
    cardDesc: { fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.7' },
  }

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.logo}>content pipeline</div>
        <div style={s.navRight}>
          <span style={s.navEmail}>{user.email}</span>
          <button style={s.navBtn} onClick={handleLogout}>Log out</button>
        </div>
      </nav>

      <div style={s.main}>
        <div style={s.greeting}>Dashboard</div>
        <h1 style={s.title}>Welcome back</h1>
        <p style={s.niche}>Niche: {user.niche}</p>

        <div style={s.grid}>
          {cards.map((card, i) => (
            <div key={i} className="dash-card" onClick={() => navigate(card.route)}>
              <div>
                <div style={s.cardTag}>{card.tag}</div>
                <div style={s.cardTitle}>{card.title}</div>
                <div style={s.cardDesc}>{card.desc}</div>
              </div>
              <button
                className={`dash-card-btn ${card.primary ? 'dash-card-btn-primary' : 'dash-card-btn-secondary'}`}
                onClick={e => { e.stopPropagation(); navigate(card.route) }}
              >
                {card.btn} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard