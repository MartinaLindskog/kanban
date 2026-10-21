import loadingCat from '../assets/loading-animation.png'

interface LoadingIndicatorProps {
	message: string
	overlay?: boolean
}

// Display a loading message with an optional full-page overlay
export default function LoadingIndicator({
	message,
	overlay = false
}: LoadingIndicatorProps) {
	const className = overlay
		? 'loading-indicator loading-indicator--overlay'
		: 'loading-indicator'
	return (
		<div className={className} role="status">
			<img
				className="loading-indicator-image"
				src={loadingCat}
				alt=""
				width="80"
				height="80"
			/>
			<p>{message}</p>
		</div>
	)
}