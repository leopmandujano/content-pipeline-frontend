import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #080808; }
      .landing-nav { 
        position: fixed; top: 0; left: 0; right: 0; z-index: 100;
        display: flex; justify-content: space-between; align-items: center;
        padding: 20px 48px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        background: rgba(8,8,8,0.8);
        backdrop-filter: blur(12px);
      }
      .logo { font-family: 'Geist Mono', monospace; font-size: 14px; color: white; letter-spacing: 0.05em; }
      .nav-btns { display: flex; gap: 12px; }
      .btn-ghost { 
        padding: 8px 18px; background: transparent; color: rgba(255,255,255,0.5);
        border: 1px solid rgba(255,255,255,0.1); border-radius: 6px;
        cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px;
        transition: all 0.2s;
      }
      .btn-ghost:hover { color: white; border-color: rgba(255,255,255,0.3); }
      .btn-primary { 
        padding: 8px 18px; background: white; color: black;
        border: none; border-radius: 6px;
        cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
        transition: all 0.2s;
      }
      .btn-primary:hover { background: rgba(255,255,255,0.85); }
      .hero {
        min-height: 100vh; display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        padding: 120px 24px 80px;
        text-align: center;
      }
      .badge {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 6px 14px; border: 1px solid rgba(255,255,255,0.1);
        border-radius: 100px; margin-bottom: 32px;
        font-family: 'Geist Mono', monospace; font-size: 11px;
        color: rgba(255,255,255,0.4); letter-spacing: 0.08em;
      }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; }
      .hero h1 {
        font-family: 'DM Sans', sans-serif; font-size: clamp(36px, 6vw, 72px);
        font-weight: 300; color: white; line-height: 1.1; letter-spacing: -0.03em;
        max-width: 800px; margin-bottom: 24px;
      }
      .hero h1 span { color: rgba(255,255,255,0.3); }
      .hero p {
        font-family: 'DM Sans', sans-serif; font-size: 16px;
        color: rgba(255,255,255,0.4); max-width: 480px; line-height: 1.7;
        margin-bottom: 40px;
      }
      .hero-btns { display: flex; gap: 12px; justify-content: center; }
      .btn-lg {
        padding: 12px 28px; background: white; color: black;
        border: none; border-radius: 8px; cursor: pointer;
        font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
        transition: all 0.2s;
      }
      .btn-lg:hover { background: rgba(255,255,255,0.85); }
      .btn-lg-ghost {
        padding: 12px 28px; background: transparent; color: rgba(255,255,255,0.5);
        border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer;
        font-family: 'DM Sans', sans-serif; font-size: 14px;
        transition: all 0.2s;
      }
      .btn-lg-ghost:hover { color: white; border-color: rgba(255,255,255,0.3); }
      .features {
        padding: 80px 48px; max-width: 1000px; margin: 0 auto;
        border-top: 1px solid rgba(255,255,255,0.06);
      }
      .features-label {
        font-family: 'Geist Mono', monospace; font-size: 11px;
        color: rgba(255,255,255,0.25); letter-spacing: 0.1em;
        text-transform: uppercase; margin-bottom: 48px;
      }
      .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(255,255,255,0.06); border-radius: 12px; overflow: hidden; }
      .feature-card {
        background: #080808; padding: 32px;
        transition: background 0.2s;
      }
      .feature-card:hover { background: #111; }
      .feature-num {
        font-family: 'Geist Mono', monospace; font-size: 11px;
        color: rgba(255,255,255,0.2); margin-bottom: 20px;
      }
      .feature-card h3 {
        font-family: 'DM Sans', sans-serif; font-size: 16px;
        font-weight: 500; color: white; margin-bottom: 10px;
      }
      .feature-card p {
        font-family: 'DM Sans', sans-serif; font-size: 13px;
        color: rgba(255,255,255,0.35); line-height: 1.7;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  const features = [
    { num: '01', title: 'Find Trends', desc: 'See what is blowing up in your niche right now. Never run out of ideas again.' },
    { num: '02', title: 'Generate Angles', desc: 'Get 5 unique video angles for any trending topic in seconds, tailored to your audience.' },
    { num: '03', title: 'Write Scripts', desc: 'Full scripts with 3 hook options, written in your style and ready to film.' },
  ]

  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: 'white' }}>
      <nav className="landing-nav">
        <div className="logo">content pipeline</div>
        <div className="nav-btns">
          <button className="btn-ghost" onClick={() => navigate('/login')}>Log in</button>
          <button className="btn-primary" onClick={() => navigate('/signup')}>Get started</button>
        </div>
      </nav>

      <div className="hero">
        <div className="badge">
          <span className="badge-dot"></span>
          AI-powered content creation
        </div>
        <h1>Stop guessing.<br /><span>Start creating.</span></h1>
        <p>Find trending topics in your niche, generate video angles, and get full scripts written in your voice — in minutes.</p>
        <div className="hero-btns">
          <button className="btn-lg" onClick={() => navigate('/signup')}>Get started free</button>
          <button className="btn-lg-ghost" onClick={() => navigate('/login')}>Log in</button>
        </div>
      </div>

      <div className="features">
        <div className="features-label">How it works</div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-num">{f.num}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Landing