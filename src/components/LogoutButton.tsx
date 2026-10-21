import { useAuth } from '../context/AuthContext'

interface LogoutButtonProps {
	iconOnly?: boolean
}

export default function LogoutButton({ iconOnly = false }: LogoutButtonProps) {
	const { signOut } = useAuth()
	return (
		<button
			type="button"
			onClick={() => void signOut()}
			aria-label="Log out"
			title="Log out"
		>
			{iconOnly ? '[→' : 'Log out'}
		</button>
	)
}