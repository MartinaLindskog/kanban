import { useState } from 'react'
import type { CatImage } from '../types/CatImage'
import { getDailyCat } from '../services/catService'

interface CatOfTheDayProps {
	iconOnly?: boolean
}

// Display the button and content for the daily cat feature
function CatOfTheDay( { iconOnly = false }: CatOfTheDayProps) {
    // Track whether the daily cat modal is open
	const [isCatModalOpen, setIsCatModalOpen] = useState(false)
    // Store the cat image returned by the backend
	const [catImage, setCatImage] = useState<CatImage | null>(null)
	// Track whether the cat image is being loaded
	const [isLoadingCat, setIsLoadingCat] = useState(false)
    // Store an error message if the cat image cannot be loaded
    const [catError, setCatError] = useState('')
	// Open the modal and load today's cat image
	async function handleShowDailyCat() {
		setIsCatModalOpen(true)
		setIsLoadingCat(true)
        setCatError('')
        setCatImage(null)
		try {
			const loadedCat = await getDailyCat()
			setCatImage(loadedCat)
		} catch (error) {
	        setCatError(
				error instanceof Error ? error.message : 'Could not load cat of the day.'
			)
        } finally {
			setIsLoadingCat(false)
		}
	}
    return (
		<section className="daily-cat">
			<button
				className="daily-cat-button"
				type="button"
                aria-label="Show cat of the day"
                title="Show cat of the day"
				onClick={handleShowDailyCat}
                disabled={isLoadingCat}
			>
				{iconOnly ? '😻' : 'Cat of the day'}
			</button>
            {isCatModalOpen && (
				<div className="modal-backdrop">
					<div
						className="task-modal daily-cat-modal"
						role="dialog"
						aria-modal="true"
						aria-label="Cat of the day"
					>
						<button
							className="modal-close-button"
							type="button"
							onClick={() => setIsCatModalOpen(false)}
							aria-label="Close cat of the day"
						>
							×
						</button>
						<h2>Cat of the day</h2>
                        {isLoadingCat && <p role="status">Loading cat...</p>}
                        {catError && <p role="alert">{catError}</p>}
                        {!isLoadingCat && catImage && (
                        <>
	                        <img
		                        className="daily-cat-image"
		                        src={catImage.url}
		                        alt="Cat of the day"
	                        />
                            <p className="daily-cat-breed">
                                <strong>Breed:</strong> {catImage.breeds[0]?.name ?? 'Unknown'}
                            </p>
                        </>
                        )}
					</div>
				</div>
			)}
		</section>
	)
}

export default CatOfTheDay