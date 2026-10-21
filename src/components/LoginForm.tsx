import { type FormEvent, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginForm() {
	const { signIn } = useAuth()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setErrorMessage('')
		setIsSubmitting(true)
		try {
			await signIn(email, password)
		} catch {
			setErrorMessage('Could not log in. Check your email and password.')
		} finally {
			setIsSubmitting(false)
		}
	}
	return (
		<main className="login-page">
			<section className="login-card" aria-labelledby="login-title">
				<h2 id="login-title">Log in</h2>
				<form className="login-form" onSubmit={handleSubmit}>
					<label htmlFor="login-email">Email</label>
					<input
						id="login-email"
						type="email"
						placeholder="name@example.com"						
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						autoComplete="email"
						required
					/>
					<label htmlFor="login-password">Password</label>
					<input
						id="login-password"
						type="password"
						placeholder='Enter password...'
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						autoComplete="current-password"
						required
					/>
					{errorMessage && (
						<p className="login-error" role="alert">
							{errorMessage}
						</p>
					)}
					<button type="submit" disabled={isSubmitting || !email.trim() || !password}>
						{isSubmitting ? 'Logging in...' : 'Log in'}
					</button>
				</form>
			</section>
		</main>
	)
}
