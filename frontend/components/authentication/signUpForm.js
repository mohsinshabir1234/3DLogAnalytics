function SignupForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    const { data, error } = await signUp(email, password);
    if (!error) {
      alert('Check your email for confirmation!');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Sign Up</button>
    </form>
  );
}
export default SignupForm;