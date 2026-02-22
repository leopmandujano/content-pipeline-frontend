import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Analytics() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [csvData, setCsvData] = useState('')
  const [insights, setInsights] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const [animIn, setAnimIn] = useState(false)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #080808; }
      .upload-zone {
        border: 1px dashed rgba(255,255,255,0.12); border-radius: 12px;
        padding: 48px 24px; text-align: center; cursor: pointer;
        transition: all 0.2s; background: #0d0d0d;
      }
      .upload-zone:hover { border-color: rgba(255,255,255,0.25); background: #111; }
      .upload-zone.has-file { border-color: rgba(255,255,255,0.2); border-style: solid; }
      .how-card {
        background: #0d0d0d; border: 1px solid rgba(255,255,255,0.07);
        border-radius: 10px; padding: 20px 24px; margin-bottom: 8px;
      }
      .how-platform {
        fontFamily: 'Geist Mono', monospace; font-size: 11px;
        color: rgba(255,255,255,0.25); letter-spacing: 0.08em;
        text-transform: uppercase; margin-bottom: 6px;
      }
      .how-steps {
        font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.7;
        font-family: 'DM Sans', sans-serif;
      }
      .loading-bar {
        height: 1px; background: rgba(255,255,255,0.06);
        border-radius: 1px; overflow: hidden; margin: 16px 0;
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
      .insights-box {
        background: #0d0d0d; border: 1px solid rgba(255,255,255,0.07);
        border-radius: 12px; padding: 28px;
        white-space: pre-wrap; line-height: 1.8;
        color: rgba(255,255,255,0.65); font-size: 14px;
        font-family: 'DM Sans', sans-serif;
        animation: fadeSlideUp 0.4s ease forwards;
      }
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
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
    setTimeout(() => setAnimIn(true), 50)
  }, [])

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => setCsvData(event.target.result)
    reader.readAsText(file)
  }

  const analyzeData = async () => {
    if (!csvData) return
    setLoading(true)
    setInsights('')
    try {
      const res = await fetch('https://content-pipeline-production-2f9d.up.railway.app/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData, niche: user.niche })
      })
      const data = await res.json()
      setInsights(data.insights)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  if (!user) return null

  const s = {
    page: { minHeight: '100vh', background: '#080808', fontFamily: 'DM Sans, sans-serif', color: 'white' },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(12px)' },
    logo: { fontFamily: 'Geist Mono, monospace', fontSize: '13px', color: 'white', letterSpacing: '0.05em', cursor: 'pointer' },
    navBtn: { padding: '7px 16px', background: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' },
    main: { maxWidth: '680px', margin: '0 auto', padding: '56px 24px', opacity: animIn ? 1 : 0, transform: animIn ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.4s ease' },
    tag: { fontFamily: 'Geist Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' },
    title: { fontSize: '26px', fontWeight: '300', letterSpacing: '-0.02em', marginBottom: '8px' },
    sub: { fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginBottom: '40px', lineHeight: '1.7' },
    sectionLabel: { fontFamily: 'Geist Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' },
    divider: { borderTop: '1px solid rgba(255,255,255,0.06)', margin: '32px 0' },
    analyzeBtn: { width: '100%', padding: '11px', background: 'white', color: 'black', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', marginTop: '16px' },
    loadingText: { fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: 'Geist Mono, monospace' },
  }

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.logo} onClick={() => navigate('/dashboard')}>content pipeline</div>
        <button style={s.navBtn} onClick={() => navigate('/dashboard')}>Dashboard</button>
      </nav>

      <div style={s.main}>
        <div style={s.tag}>Analytics</div>
        <h1 style={s.title}>Analyze your content</h1>
        <p style={s.sub}>Upload your platform analytics and get AI-powered insights on what is working for your audience.</p>

        <div style={s.sectionLabel}>How to export your data</div>
        {[
          { platform: 'TikTok', steps: 'TikTok Studio → Analytics → Export Data' },
          { platform: 'Instagram', steps: 'Professional Dashboard → Your Content → Download' },
          { platform: 'YouTube', steps: 'YouTube Studio → Analytics → Export current view' },
        ].map((p, i) => (
          <div key={i} className="how-card">
            <div className="how-platform">{p.platform}</div>
            <div className="how-steps">{p.steps}</div>
          </div>
        ))}

        <div style={s.divider} />

        <div style={s.sectionLabel}>Upload your CSV</div>
        <label htmlFor="csvUpload">
          <div className={`upload-zone ${fileName ? 'has-file' : ''}`}>
            {fileName ? (
              <>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>{fileName}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', fontFamily: 'Geist Mono, monospace' }}>click to change file</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Drop your CSV here or click to upload</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', fontFamily: 'Geist Mono, monospace' }}>.csv files only</div>
              </>
            )}
          </div>
        </label>
        <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} id="csvUpload" />

        {csvData && (
          <button style={s.analyzeBtn} onClick={analyzeData}>
            {loading ? 'Analyzing...' : 'Analyze my data →'}
          </button>
        )}

        {loading && (
          <div style={{ marginTop: '24px' }}>
            <div style={s.loadingText}>Running analysis...</div>
            <div className="loading-bar"><div className="loading-bar-fill" /></div>
          </div>
        )}

        {insights && (
          <>
            <div style={s.divider} />
            <div style={s.sectionLabel}>Your insights</div>
            <div className="insights-box">{insights}</div>
          </>
        )}
      </div>
    </div>
  )
}

export default Analytics