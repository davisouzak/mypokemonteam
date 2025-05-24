import type { Team, CreateTeamData } from '../types/team'
import type { PokemonBasic } from '../types/pokemon'

class TeamService {
	private readonly STORAGE_KEY = 'pokemon-teams'

	getTeams(): Team[] {
		const stored = localStorage.getItem(this.STORAGE_KEY)
		return stored ? JSON.parse(stored) : []
	}

	createTeam(data: CreateTeamData): Team {
		const teams = this.getTeams()
		const newTeam: Team = {
			id: Date.now().toString(),
			name: data.name,
			description: data.description,
			pokemon: [],
			createdAt: new Date(),
		}

		teams.push(newTeam)
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(teams))
		return newTeam
	}

	updateTeam(teamId: string, updates: Partial<Team>): Team | null {
		const teams = this.getTeams()
		const teamIndex = teams.findIndex((t) => t.id === teamId)

		if (teamIndex === -1) return null

		teams[teamIndex] = { ...teams[teamIndex], ...updates }
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(teams))
		return teams[teamIndex]
	}

	deleteTeam(teamId: string): boolean {
		const teams = this.getTeams()
		const filteredTeams = teams.filter((t) => t.id !== teamId)

		if (filteredTeams.length === teams.length) return false

		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredTeams))
		return true
	}

	addPokemonToTeam(teamId: string, pokemon: PokemonBasic): Team | null {
		const teams = this.getTeams()
		const team = teams.find((t) => t.id === teamId)

		if (!team) return null
		if (team.pokemon.length >= 6) return null
		if (team.pokemon.some((p) => p.id === pokemon.id)) return null

		team.pokemon.push(pokemon)
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(teams))
		return team
	}

	removePokemonFromTeam(teamId: string, pokemonId: number): Team | null {
		const teams = this.getTeams()
		const team = teams.find((t) => t.id === teamId)

		if (!team) return null

		team.pokemon = team.pokemon.filter((p) => p.id !== pokemonId)
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(teams))
		return team
	}

	getTeamById(teamId: string): Team | null {
		const teams = this.getTeams()
		return teams.find((t) => t.id === teamId) || null
	}
}

export const teamService = new TeamService()
