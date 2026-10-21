export interface CatBreed {
	name: string
}
export interface CatImage {
	id: string
	url: string
	width: number
	height: number
	breeds: CatBreed[]
}