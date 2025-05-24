import type { PokemonBasic } from '../types/pokemon'

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
