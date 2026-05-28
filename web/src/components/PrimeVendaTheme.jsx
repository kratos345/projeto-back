export default function PrimeVendaTheme() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --bg:       #0c0e13;
        --surface:  #13161f;
        --card:     #1a1e2a;
        --border:   #252a38;
        --gold:     #c9a84c;
        --gold2:    #f0d080;
        --amber:    #e8973a;
        --text:     #e8e4dc;
        --muted:    #7a7f92;
        --red:      #e05555;
        --green:    #4caf82;
        --blue:     #4c82c9;
      }

      body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

      .playfair { font-family: 'Playfair Display', serif; }

      .inp {
        width: 100%;
        background: var(--bg);
        border: 1.5px solid var(--border);
        border-radius: 10px;
        padding: 12px 16px;
        color: var(--text);
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
        outline: none;
        transition: border-color .2s, box-shadow .2s;
      }
      .inp:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,.12); }
      .inp::placeholder { color: var(--muted); }
      textarea.inp { resize: vertical; min-height: 90px; }

      .btn-gold {
        background: linear-gradient(135deg, var(--gold), var(--amber));
        color: #0c0e13;
        border: none;
        border-radius: 10px;
        padding: 12px 28px;
        font-family: 'DM Sans', sans-serif;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: opacity .2s, transform .15s, box-shadow .2s;
      }
      .btn-gold:hover { opacity: .9; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,168,76,.3); }
      .btn-ghost {
        background: transparent;
        color: var(--muted);
        border: 1.5px solid var(--border);
        border-radius: 10px;
        padding: 11px 24px;
        font-family: 'DM Sans', sans-serif;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        transition: border-color .2s, color .2s;
      }
      .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }

      .auth-form {
        width: 100%;
        max-width: 420px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 22px;
        padding: 36px;
        box-shadow: 0 20px 80px rgba(0,0,0,.35);
      }

      .auth-layout {
        min-height: 100vh;
        background: var(--bg);
        display: flex;
      }
      .auth-layout .auth-left {
        flex: 1;
        display: none;
        background: linear-gradient(135deg,#0c0e13 0%,#13161f 50%,#1a1e2a 100%);
        position: relative;
        overflow: hidden;
      }
      .auth-layout .auth-left .hero-bg {
        position: absolute;
        inset: 0;
        background-image: url(https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=60);
        background-size: cover;
        background-position: center;
        opacity: .18;
      }
      .auth-layout .auth-left .hero-content {
        position: relative;
        z-index: 1;
        padding: 48px;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-between;
      }
      .auth-layout .auth-right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
      }

      .fade-up { animation: fadeUp .45s ease both; }
      .fade-up-2 { animation: fadeUp .45s .1s ease both; }
      .fade-up-3 { animation: fadeUp .45s .2s ease both; }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 11px 16px;
        border-radius: 10px;
        cursor: pointer;
        color: var(--muted);
        font-size: 14px;
        font-weight: 500;
        transition: background .2s, color .2s;
        user-select: none;
      }
      .nav-item:hover { background: rgba(255,255,255,.04); color: var(--text); }
      .nav-item.active { background: rgba(201,168,76,.1); color: var(--gold); border: 1px solid rgba(201,168,76,.15); }

      .sidebar { background: var(--surface); border-right: 1px solid var(--border); }
      .page-shell {
        display: flex;
        min-height: 100vh;
      }
      .dashboard-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .dashboard-content {
        flex: 1;
        overflow-y: auto;
        padding: 28px;
        background: var(--bg);
      }

      .top-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 28px;
        border-bottom: 1px solid var(--border);
        background: var(--surface);
      }
      .top-bar h1 { font-size: 20px; font-weight: 600; }

      .card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 16px;
        overflow: hidden;
        transition: transform .25s, box-shadow .25s, border-color .25s;
      }
      .card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,.4); border-color: rgba(201,168,76,.2); }

      .stat-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 22px;
      }

      .tbl { width: 100%; border-collapse: collapse; }
      .tbl th {
        text-align: left;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: .6px;
        text-transform: uppercase;
        color: var(--muted);
        padding: 10px 14px;
        border-bottom: 1px solid var(--border);
      }
      .tbl td { padding: 13px 14px; font-size: 13.5px; border-bottom: 1px solid rgba(255,255,255,.03); }
      .tbl tr:last-child td { border-bottom: none; }
      .tbl tr:hover td { background: rgba(255,255,255,.02); }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: .4px;
        text-transform: uppercase;
      }
      .badge-gold { background: rgba(201,168,76,.15); color: var(--gold); border: 1px solid rgba(201,168,76,.3); }
      .badge-green { background: rgba(76,175,130,.15); color: var(--green); border: 1px solid rgba(76,175,130,.3); }
      .badge-red { background: rgba(224,85,85,.15); color: var(--red); border: 1px solid rgba(224,85,85,.3); }
      .badge-blue { background: rgba(76,130,201,.15); color: var(--blue); border: 1px solid rgba(76,130,201,.3); }
      .badge-muted { background: rgba(122,127,146,.1); color: var(--muted); border: 1px solid var(--border); }

      @media (min-width: 900px) {
        .auth-layout .auth-left { display: block; }
      }
    `}</style>
  )
}
