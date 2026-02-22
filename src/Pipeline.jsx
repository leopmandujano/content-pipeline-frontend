import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Pipeline() {
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')
  const [angles, setAngles] = useState([])
  const [selectedAngle, setSelectedAngle] = useState('')
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [user, setUser] = useState(null)
  const [copied, setCopied] = useState(false)
  const [animating, setAnimating] = useState(false)

  const [trendingTopics, setTrendingTopics] = useState([])
  const [loadingTopics, setLoadingTopics] = useState(true)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #080808; overflow-x: hidden; }

      .pipeline-step {
        position: absolute; top: 0; left: 0; right: 0;
        min-height: calc(100vh - 65px);
        padding: 48px 24px;
        max-width: 700px; margin: 0 auto;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease;
      }
      .step-enter { transform: translateY(60px); opacity: 0; }
      .step-visible { transform: translateY(0); opacity: 1; }
      .step-exit { transform: translateY(-60px); opacity: 0; }

      .topic-card {
        padding: 12px 16px; margin: 6px 0;
        border: 1px solid rgba(255,255,255,0.07); border-radius: 8px;
        cursor: pointer; transition: all 0.15s;
        font-family: 'DM Sans', sans-serif; font-size: 14px;
        color: rgba(255,255,255,0.7); background: #0d0d0d;
      }
      .topic-card:hover { border-color: rgba(255,255,255,0.2); color: white; background: #111; }
      .topic-card.selected { border-color: rgba(255,255,255,0.4); color: white; background: #111; }

      .angle-card {
        padding: 14px 16px; margin: 6px 0;
        border: 1px solid rgba(255,255,255,0.07); border-radius: 8px;
        cursor: pointer; transition: all 0.15s;
        font-family: 'DM Sans', sans-serif; font-size: 13px;
        color: rgba(255,255,255,0.6); background: #0d0d0d; line-height: 1.6;
      }
      .angle-card:hover { border-color: rgba(255,255,255,0.2); color: white; background: #111; }
      .angle-card.selected { border-color: rgba(255,255,255,0.4); color: white; background: #111; }

      .loading-bar {
        height: 1px; background: rgba(255,255,255,0.06);
        border-radius: 1px; overflow: hidden; margin: 20px 0;
      }
      .loading-bar-fill {
        height: 100%; background: rgba(255,255,255,0.3);
        border-radius: 1px;
        animation: loadingPulse 1.5s ease-in-out infinite;
      }
      @keyframes loadingPulse {
        0% { width: 0%; opacity: 1; }
        50% { width: 70%; opacity: 0.8; }
        100% { width: 100%; opacity: 0; }
      }

      .step-indicator {
        display: flex; gap: 6px; margin-bottom: 32px;
      }
      .step-dot {
        height: 2px; width: 24px; border-radius: 2px;
        background: rgba(255,255,255,0.15); transition: background 0.3s;
      }
      .step-dot.active { background: white; }

      .back-btn {
        display: inline-flex; align-items: center; gap: 6px;
        font-family: 'Geist Mono', monospace; font-size: 11px;
        color: rgba(255,255,255,0.25); cursor: pointer;
        background: none; border: none; padding: 0;
        margin-bottom: 28px; transition: color 0.2s;
        letter-spacing: 0.05em;
      }
      .back-btn:hover { color: rgba(255,255,255,0.5); }
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
    fetch('https://content-pipeline-production-2f9d.up.railway.app/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ niche: userData.niche })
    })
      .then(res => res.json())
      .then(data => {
        const parsed = data.topics.split('\n').filter(t => t.trim() !== '')
        setTrendingTopics(parsed)
        setLoadingTopics(false)
      })
      .catch(() => setLoadingTopics(false))
  }, [])

  const transitionToStep = (newStep, callback) => {
    setAnimating(true)
    setTimeout(() => {
      callback()
      setStep(newStep)
      setAnimating(false)
    }, 350)
  }

  const generateAngles = async (t) => {
    setTopic(t)
    transitionToStep(2, () => {
      setAngles([])
      setScript('')
      setSelectedAngle('')
    })
    setLoading(true)
    try {
      const res = await fetch('https://content-pipeline-production-2f9d.up.railway.app/ideate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: t, niche: user.niche })
      })
      const data = await res.json()
      const parsed = data.angles.split('\n').filter(a => a.trim() !== '')
      setAngles(parsed)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const generateScript = async (angle) => {
    setSelectedAngle(angle)
    transitionToStep(3, () => setScript(''))
    setLoading(true)
    try {
      const res = await fetch('https://content-pipeline-production-2f9d.up.railway.app/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, angle, niche: user.niche, exampleScript: user.exampleScript || '' })
      })
      const data = await res.json()
      setScript(data.script)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const copyScript = () => {
    navigator.clipboard.writeText(script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const goBack = () => {
    if (step === 2) transitionToStep(1, () => { setAngles([]); setSelectedAngle('') })
    if (step === 3) transitionToStep(2, () => setScript(''))
  }

  if (!user) return null

  const s = {
    page: { minHeight: '100vh', background: '#080808', fontFamily: 'DM Sans, sans-serif', color: 'white' },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(12px)' },
    logo: { fontFamily: 'Geist Mono, monospace', fontSize: '13px', color: 'white', letterSpacing: '0.05em', cursor: 'pointer' },
    navRight: { display: 'flex', gap: '12px' },
    navBtn: { padding: '7px 16px', background: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' },
    wrapper: { position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 65px)' },
    stepLabel: { fontFamily: 'Geist Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' },
    stepTitle: { fontSize: '22px', fontWeight: '300', color: 'white', marginBottom: '6px', letterSpacing: '-0.02em' },
    stepSub: { fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '28px' },
    loading: { fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: 'Geist Mono, monospace', marginTop: '8px' },
    scriptBox: { background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '24px', whiteSpace: 'pre-wrap', lineHeight: '1.8', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '16px', maxHeight: '60vh', overflowY: 'auto' },
    copyBtn: { padding: '9px 20px', background: 'white', color: 'black', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', fontFamily: 'DM Sans, sans-serif' },
  }

  const stepClass = animating ? 'pipeline-step step-exit' : 'pipeline-step step-visible'

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.logo} onClick={() => navigate('/dashboard')}>content pipeline</div>
        <div style={s.navRight}>
          <button style={s.navBtn} onClick={() => navigate('/dashboard')}>Dashboard</button>
        </div>
      </nav>

      <div style={s.wrapper}>
        <div className={stepClass}>
          <div className="step-indicator">
            {[1,2,3].map(n => <div key={n} className={`step-dot ${step >= n ? 'active' : ''}`} />)}
          </div>

          {step > 1 && (
            <button className="back-btn" onClick={goBack}>← back</button>
          )}

          {step === 1 && (
            <>
              <div style={s.stepSub}>Select a topic to generate angles for</div>
              {loadingTopics && (
                <>
                  <div style={s.loading}>Finding trending topics for {user.niche}...</div>
                  <div className="loading-bar"><div className="loading-bar-fill" /></div>
                </>
              )}
              {trendingTopics.map((t, i) => (
                <div key={i} className={`topic-card ${topic === t ? 'selected' : ''}`} onClick={() => generateAngles(t)}>
                  {t}
                </div>
              ))}
            </>
          )}

          {step === 2 && (
            <>
              <div style={s.stepLabel}>Step 02</div>
              <div style={s.stepTitle}>Pick an angle</div>
              <div style={s.stepSub}>Topic: {topic}</div>
              {loading && (
                <>
                  <div style={s.loading}>Generating angles...</div>
                  <div className="loading-bar"><div className="loading-bar-fill" /></div>
                </>
              )}
              {angles.map((angle, i) => (
                <div key={i} className={`angle-card ${selectedAngle === angle ? 'selected' : ''}`} onClick={() => generateScript(angle)}>
                  {angle}
                </div>
              ))}
            </>
          )}

          {step === 3 && (
            <>
              <div style={s.stepLabel}>Step 03</div>
              <div style={s.stepTitle}>Your script</div>
              <div style={s.stepSub}>Angle: {selectedAngle}</div>
              {loading && !script && (
                <>
                  <div style={s.loading}>Writing your script...</div>
                  <div className="loading-bar"><div className="loading-bar-fill" /></div>
                </>
              )}
              {script && (
                <>
                  <div style={s.scriptBox}>{script}</div>
                  <button style={s.copyBtn} onClick={copyScript}>
                    {copied ? 'Copied!' : 'Copy script'}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Pipeline