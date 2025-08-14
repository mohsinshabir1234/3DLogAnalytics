export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#1E1E2F',
        color: '#BBB',
        textAlign: 'center',
        padding: '1rem 2rem',
        marginTop: 'auto',
        fontSize: '0.9rem',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      <p>
        &copy; {new Date().getFullYear()} Log Analyzer. All rights reserved.
      </p>
      <p>
        Built with Next.js & Supabase
      </p>
    </footer>
  );
}
