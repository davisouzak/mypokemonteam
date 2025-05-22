import type { Pokemon, PokemonListResponse, PokemonBasic } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

class PokemonApi {
  async getPokemonList(offset = 0, limit = 20): Promise<PokemonListResponse> {
    const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    return response.json();
  }

  async getPokemonById(id: number): Promise<Pokemon> {
    const response = await fetch(`${BASE_URL}/pokemon/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon details');
    }
    return response.json();
  }

  async getPokemonByName(name: string): Promise<Pokemon> {
    const response = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon details');
    }
    return response.json();
  }

  async searchPokemon(query: string): Promise<PokemonBasic[]> {
    try {
      const pokemon = await this.getPokemonByName(query);
      return [this.pokemonToPokemonBasic(pokemon)];
    } catch {
      
      return [];
    }
  }

  extractIdFromUrl(url: string): number {
    const matches = url.match(/\/(\d+)\//);
    return matches ? parseInt(matches[1]) : 0;
  }

  pokemonToPokemonBasic(pokemon: Pokemon): PokemonBasic {
    return {
      id: pokemon.id,
      name: pokemon.name,
      url: `${BASE_URL}/pokemon/${pokemon.id}/`,
      image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default
    };
  }
}

export const pokemonApi = new PokemonApi();