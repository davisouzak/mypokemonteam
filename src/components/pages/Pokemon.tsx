import { useState, useEffect, useRef, useCallback } from 'react'
import {
	Box,
	Container,
	Heading,
	Text,
	SimpleGrid,
	Input,
	Image,
	Button,
	Flex,
	Badge,
	Center,
	Dialog,
	CloseButton,
	Portal,
	Spinner,
} from '@chakra-ui/react'

interface PokemonData {
	id: number
	name: string
	sprites: {
		front_default: string
		back_default: string
		front_shiny: string
		other: {
			'official-artwork': {
				front_default: string
			}
		}
	}
	types: {
		type: {
			name: string
		}
	}[]
	stats: {
		base_stat: number
		stat: {
			name: string
		}
	}[]
	height: number
	weight: number
	abilities: {
		ability: {
			name: string
		}
		is_hidden: boolean
	}[]
	base_experience: number
}



export default function Pokemon() {
	const [pokemon, setPokemon] = useState<PokemonData[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [searchTerm, setSearchTerm] = useState<string>('')
	const [page, setPage] = useState<number>(1)
	const [hasMore, setHasMore] = useState<boolean>(true)
	const observer = useRef<IntersectionObserver | null>(null)
	const loadingRef = useRef<HTMLDivElement>(null)

	const fetchPokemon = useCallback(async (pageNumber: number) => {
		try {
			setLoading(true)
			const limit = 20
			const offset = (pageNumber - 1) * limit
			const response = await fetch(
				`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
			)
			const data = await response.json()

			const pokemonDetails = await Promise.all(
				data.results.map(async (pokemon: { url: string }) => {
					const res = await fetch(pokemon.url)
					return await res.json()
				})
			)

			setPokemon((prev) => [...prev, ...pokemonDetails])
			setHasMore(data.results.length > 0)
		} catch (error) {
			console.error('Erro ao buscar pokémon:', error)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchPokemon(page)
	}, [page, fetchPokemon])

	useEffect(() => {
		if (searchTerm) {
			setHasMore(false) // Não carrega mais se estiver pesquisando
		} else {
			setHasMore(true)
		}
	}, [searchTerm])

	// Configuração do Intersection Observer
	useEffect(() => {
		if (loading || !hasMore) return

		const options = {
			root: null,
			rootMargin: '20px',
			threshold: 1.0,
		}

		observer.current = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				setPage((prev) => prev + 1)
			}
		}, options)

		if (loadingRef.current) {
			observer.current.observe(loadingRef.current)
		}

		return () => {
			if (observer.current) {
				observer.current.disconnect()
			}
		}
	}, [loading, hasMore])

	const filteredPokemon = pokemon
		.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
		.filter(
			(p, index, self) =>
				index === self.findIndex((pokemon) => pokemon.name === p.name)
		)

	const getTypeColor = (type: string) => {
		const typeColors: { [key: string]: string } = {
			normal: '#A8A878',
			fire: '#F08030',
			water: '#6890F0',
			electric: '#F8D030',
			grass: '#78C850',
			ice: '#98D8D8',
			fighting: '#C03028',
			poison: '#A040A0',
			ground: '#E0C068',
			flying: '#A890F0',
			psychic: '#F85888',
			bug: '#A8B820',
			rock: '#B8A038',
			ghost: '#705898',
			dragon: '#7038F8',
			dark: '#705848',
			steel: '#B8B8D0',
			fairy: '#EE99AC',
		}

		return typeColors[type] || '#777777'
	}

	return (
		<Box
			minH='100vh'
			bg='gray.50'
			py={8}
		>
			<Container maxW='container.xl'>
				<Box
					textAlign='center'
					mb={8}
				>
					<Heading
						as='h1'
						size='2xl'
						mb={4}
						color='blue.600'
						fontWeight='extrabold'
					>
						Pokémon
					</Heading>
					<Text
						fontSize='lg'
						color='gray.600'
						maxW='md'
						mx='auto'
					>
						Explore os Pokémon e adicione-os aos seus times!
					</Text>
				</Box>

				<Box
					maxW='md'
					mx='auto'
					mb={8}
				>
					<Input
						placeholder='Buscar Pokémon por nome...'
						size='lg'
						bg='white'
						borderRadius='xl'
						boxShadow='md'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</Box>

				{loading && page === 1 ? (
					<Center py={20}>
						<Box textAlign='center'>
							<Text color='gray.600'>Carregando Pokémon...</Text>
						</Box>
					</Center>
				) : (
					<>
						<SimpleGrid
							columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
							gap={6}
						>
							{filteredPokemon.map((p, index) => (
								<Box
									key={`${p.id}-${p.name}-${index}`}
									overflow='hidden'
									borderRadius='xl'
									transition='all 0.3s ease'
									cursor='pointer'
									bg='white'
									_hover={{
										transform: 'translateY(-8px)',
										boxShadow:
											'0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
									}}
								>
									<Box
										bg='gradient-to-br from-blue.50 to-purple.50'
										p={6}
										textAlign='center'
										position='relative'
									>
										<Image
											src={p.sprites.front_default}
											alt={p.name}
											boxSize='120px'
											mx='auto'
											objectFit='contain'
											filter='drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
										/>
										<Badge
											position='absolute'
											top={2}
											right={2}
											colorScheme='blue'
											variant='solid'
											borderRadius='full'
											px={2}
											py={1}
											fontSize='xs'
										>
											#{p.id.toString().padStart(3, '0')}
										</Badge>
									</Box>

									<Box p={4}>
										<Heading
											size='md'
											textTransform='capitalize'
											mb={3}
											color='gray.700'
											fontWeight='bold'
										>
											{p.name}
										</Heading>

										<Flex
											gap={2}
											wrap='wrap'
											mb={4}
										>
											{p.types.map((typeInfo, index) => (
												<Badge
													key={index}
													px={3}
													py={1}
													borderRadius='full'
													textTransform='capitalize'
													color='white'
													fontWeight='bold'
													fontSize='xs'
													bg={getTypeColor(typeInfo.type.name)}
													boxShadow='sm'
												>
													{typeInfo.type.name}
												</Badge>
											))}
										</Flex>

										<Dialog.Root>
											<Dialog.Trigger asChild>
												<Button
													fontSize='sm'
													color='#FFF'
													textAlign='center'
												>
													Clique para ver detalhes
												</Button>
											</Dialog.Trigger>
											<Portal>
												<Dialog.Backdrop />
												<Dialog.Positioner>
													<Dialog.Content>
														<Dialog.Header>
															<Dialog.Title>Pokemon Details</Dialog.Title>
														</Dialog.Header>
														<Dialog.Body>
															{p.name}
															<Image
																src={p.sprites.front_default}
																alt={p.name}
																boxSize='120px'
																mx='auto'
																objectFit='contain'
																filter='drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
															/>
														</Dialog.Body>
														<Dialog.Footer>
															<Dialog.ActionTrigger asChild>
																<Button variant='outline'>Cancelar</Button>
															</Dialog.ActionTrigger>
															<Button>Adicionar ao Time</Button>
														</Dialog.Footer>
														<Dialog.CloseTrigger asChild>
															<CloseButton size='sm' />
														</Dialog.CloseTrigger>
													</Dialog.Content>
												</Dialog.Positioner>
											</Portal>
										</Dialog.Root>
									</Box>
								</Box>
							))}
						</SimpleGrid>

						<div
							ref={loadingRef}
							style={{ height: '20px' }}
						/>

						{loading && page > 1 && (
							<Center my={8}>
								<Spinner
									size='xl'
									color='blue.500'
								/>
							</Center>
						)}

						{!hasMore && !searchTerm && (
							<Center my={8}>
								<Text color='gray.500'>
									Você viu todos os Pokémon disponíveis!
								</Text>
							</Center>
						)}
					</>
				)}

				{!loading && filteredPokemon.length === 0 && (
					<Center py={20}>
						<Box textAlign='center'>
							<Text
								fontSize='6xl'
								mb={4}
							>
								🔍
							</Text>
							<Heading
								size='lg'
								color='gray.600'
								mb={2}
							>
								Nenhum Pokémon encontrado
							</Heading>
							<Text color='gray.500'>Tente buscar por outro nome</Text>
						</Box>
					</Center>
				)}
			</Container>
		</Box>
	)
}
