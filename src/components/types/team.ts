import type { PokemonBasic } from './pokemon'

export interface Team {
	id: string
	name: string
	description?: string
	pokemon: PokemonBasic[]
	createdAt: Date
}

export interface CreateTeamData {
	name: string
	description?: string
}
