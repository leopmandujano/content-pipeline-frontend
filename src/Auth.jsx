import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Auth({ mode }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #080808; }
      .auth-input {
        width: 100%; padding: 10px 14px;
        background: #111; border: 1px solid rgba(255,255,255,0.08);
        border-radius: 8px; color: white;
        font-family: 'DM Sans', sans-serif; font-size: 14px;
        outline: none; transition: border-color 0.2s;
      }
      .auth-input:focus { border-color: rgba(255,255,255,0.25); }
      .auth-input::placeholder { color: rgba(255,255,255,0.2); }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  const handleSubmit = () => {
    if (!email || !password) { setError('Please fill in all fields'); return }
    if (mode === 'signup') {
      const existing = localStorage.getItem(email)
      if (existing) { setError('An account with this email already exists'); return }
      localStorage.setItem(email, JSON.stringify({ email, password, onboarded: false }))
      localStorage.setItem('currentUser', email)
      navigate('/onboarding')
    } else {
      const user = localStorage.getItem(email)
      if (!user) { setError('No account found with this email'); return }
      const parsed = JSON.parse(user)
      if (parsed.password !== password) { setError('Incorrect password'); return }
      localStorage.setItem('currentUser', email)
      navigate(parsed.onboarded ? '/dashboard' : '/onboarding')
    }
  }

  const s = {
    page: { minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', padding: '24px' },
    back: { position: 'fixed', top: '24px', left: '32px', fontFamily: 'Geist Mono, monospace', fontSize: '13px', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', textDecoration: 'none', letterSpacing: '0.05em' },
    card: { width: '100%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '40px', background: '#0d0d0d' },
    label: { fontFamily: 'Geist Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '32px' },
    title: { fontSize: '22px', fontWeight: '400', color: 'white', marginBottom: '8px', letterSpacing: '-0.02em' },
    sub: { fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '32px', lineHeight: '1.6' },
    fieldLabel: { display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', fontFamily: 'DM Sans, sans-serif' },
    field: { marginBottom: '16px' },
    error: { fontSize: '13px', color: '#f87171', marginBottom: '16px', padding: '10px 14px', background: 'rgba(248,113,113,0.08)', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.15)' },
    btn: { width: '100%', padding: '11px', background: 'white', color: 'black', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', marginTop: '8px' },
    switch: { textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.3)' },
    switchLink: { color: 'rgba(255,255,255,0.6)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }
  }

  return (
    <div style={s.page}>
      <span style={s.back} onClick={() => navigate('/')}>← content pipeline</span>
      <div style={s.card}>
        <span style={s.label}>{mode === 'signup' ? 'Create account' : 'Sign in'}</span>
        <h2 style={s.title}>{mode === 'signup' ? 'Get started' : 'Welcome back'}</h2>
        <p style={s.sub}>{mode === 'signup' ? 'Create your account to start building content' : 'Log in to your content pipeline'}</p>

        {error && <div style={s.error}>{error}</div>}

        <div style={s.field}>
          <label style={s.fieldLabel}>Email</label>
          <input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={s.field}>
          <label style={s.fieldLabel}>Password</label>
          <input className="auth-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        <button style={s.btn} onClick={handleSubmit}>
          {mode === 'signup' ? 'Create account' : 'Log in'}
        </button>

        <p style={s.switch}>
          {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
          <span style={s.switchLink} onClick={() => navigate(mode === 'signup' ? '/login' : '/signup')}>
            {mode === 'signup' ? 'Log in' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Auth