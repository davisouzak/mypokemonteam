import { useState, useEffect, useCallback } from 'react'
import type { Pokemon, PokemonBasic } from '../types/pokemon'
import { pokemonApi } from '../services/pokemonApi'

export const usePokemon = () => {
	const [pokemonList, setPokemonList] = useState<PokemonBasic[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [hasMore, setHasMore] = useState(true)
	const [offset, setOffset] = useState(0)

	const loadPokemon = useCallback(
		async (reset = false) => {
			if (loading) return

			setLoading(true)
			setError(null)

			try {
				const currentOffset = reset ? 0 : offset
				const response = await pokemonApi.getPokemonList(currentOffset, 20)

				const pokemonDetails = await Promise.all(
					response.results.map(async (pokemon) => {
						const id = pokemonApi.extractIdFromUrl(pokemon.url)
						const details = await pokemonApi.getPokemonById(id)
						return pokemonApi.pokemonToPokemonBasic(details)
					})
				)

				if (reset) {
					setPokemonList(pokemonDetails)
					setOffset(20)
				} else {
					setPokemonList((prev) => [...prev, ...pokemonDetails])
					setOffset((prev) => prev + 20)
				}

				setHasMore(response.next !== null)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load Pokemon')
			} finally {
				setLoading(false)
			}
		},
		[loading, offset]
	)

	const searchPokemon = useCallback(
		async (query: string) => {
			if (!query.trim()) {
				loadPokemon(true)
				return
			}

			setLoading(true)
			setError(null)

			try {
				const results = await pokemonApi.searchPokemon(query)
				setPokemonList(results)
				setHasMore(false)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Search failed')
				setPokemonList([])
			} finally {
				setLoading(false)
			}
		},
		[loadPokemon]
	)

	const loadMore = useCallback(() => {
		if (hasMore && !loading) {
			loadPokemon(false)
		}
	}, [hasMore, loading, loadPokemon])

	useEffect(() => {
		loadPokemon(true)
	}, [])

	return {
		pokemonList,
		loading,
		error,
		hasMore,
		loadMore,
		searchPokemon,
		refetch: () => loadPokemon(true),
	}
}

export const usePokemonDetails = (pokemonId: number | null) => {
	const [pokemon, setPokemon] = useState<Pokemon | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!pokemonId) {
			setPokemon(null)
			return
		}

		const fetchPokemon = async () => {
			setLoading(true)
			setError(null)

			try {
				const data = await pokemonApi.getPokemonById(pokemonId)
				setPokemon(data)
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'Failed to load Pokemon details'
				)
			} finally {
				setLoading(false)
			}
		}

		fetchPokemon()
	}, [pokemonId])

	return { pokemon, loading, error }
}
