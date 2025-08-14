// components/Header.js
export default function Header() {
  return (
    <header
      style={{
        background: 'linear-gradient(90deg, #0052D4, #4364F7, #6FB1FC)',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
        Log Analyzer
      </h1>
      <nav>
        <a
          href="#dashboard"
          style={{ color: 'white', marginRight: '1.5rem', textDecoration: 'none', fontWeight: '500' }}
        >
          Dashboard
        </a>
        <a
          href="#reports"
          style={{ color: 'white', marginRight: '1.5rem', textDecoration: 'none', fontWeight: '500' }}
        >
          Reports
        </a>
        <a
          href="#settings"
          style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}
        >
          Settings
        </a>
      </nav>
    </header>
  );
}
