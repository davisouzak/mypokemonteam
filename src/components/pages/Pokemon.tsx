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
	Select,
	VStack,
	HStack,
	createListCollection,
} from '@chakra-ui/react'
import { useTeam } from '../context/TeamContext' 

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
	const [selectedPokemon, setSelectedPokemon] = useState<PokemonData | null>(
		null
	)
	const [selectedTeamId, setSelectedTeamId] = useState<string>('')
	const [addingToTeam, setAddingToTeam] = useState<boolean>(false)

	const observer = useRef<IntersectionObserver | null>(null)
	const loadingRef = useRef<HTMLDivElement>(null)

	const { teams, addPokemonToTeam } = useTeam()

	const teamsCollection = createListCollection({
		items: teams.map((team) => ({
			id: team.id,
			name: team.name,
			pokemon: team.pokemon,
		})),
	})

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
			setHasMore(false)
		} else {
			setHasMore(true)
		}
	}, [searchTerm])

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

	const openPokemonModal = (pokemonData: PokemonData) => {
		setSelectedPokemon(pokemonData)
		setSelectedTeamId(teams.length > 0 ? teams[0].id : '')
	}

	const handleAddToTeam = async () => {
		if (!selectedPokemon || !selectedTeamId) return

		setAddingToTeam(true)

		try {
			const pokemonBasic = {
				id: selectedPokemon.id,
				name: selectedPokemon.name,
				sprite: selectedPokemon.sprites.front_default,
				types: selectedPokemon.types.map((t) => t.type.name),
				url: `https://pokeapi.co/api/v2/pokemon/${selectedPokemon.id}`,
				image:
					selectedPokemon.sprites.other['official-artwork'].front_default ||
					selectedPokemon.sprites.front_default,
			}

			addPokemonToTeam(selectedTeamId, pokemonBasic)
			setSelectedPokemon(null)
		} catch (error) {
			console.error('Erro ao adicionar Pokémon ao time:', error)
		} finally {
			setAddingToTeam(false)
		}
	}

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

										<Button
											w='full'
											colorScheme='blue'
											size='sm'
											onClick={() => openPokemonModal(p)}
											disabled={teams.length === 0}
										>
											{teams.length === 0
												? 'Crie um time primeiro'
												: 'Ver detalhes'}
										</Button>
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

				{selectedPokemon && (
					<Dialog.Root
						open={!!selectedPokemon}
						onOpenChange={() => setSelectedPokemon(null)}
					>
						<Portal>
							<Dialog.Backdrop />
							<Dialog.Positioner>
								<Dialog.Content maxW='lg'>
									<Dialog.Header>
										<Dialog.Title>
											<HStack>
												<Text
													textTransform='capitalize'
													fontSize='xl'
												>
													{selectedPokemon.name}
												</Text>
												<Badge colorScheme='blue'>
													#{selectedPokemon.id.toString().padStart(3, '0')}
												</Badge>
											</HStack>
										</Dialog.Title>
									</Dialog.Header>

									<Dialog.Body>
										<VStack
											gap={4}
											align='stretch'
										>
											<Center>
												<Image
													src={
														selectedPokemon.sprites.other['official-artwork']
															.front_default ||
														selectedPokemon.sprites.front_default
													}
													alt={selectedPokemon.name}
													boxSize='200px'
													objectFit='contain'
												/>
											</Center>

											<Flex
												gap={2}
												wrap='wrap'
												justify='center'
											>
												{selectedPokemon.types.map((typeInfo, index) => (
													<Badge
														key={index}
														px={3}
														py={1}
														borderRadius='full'
														textTransform='capitalize'
														color='white'
														fontWeight='bold'
														bg={getTypeColor(typeInfo.type.name)}
													>
														{typeInfo.type.name}
													</Badge>
												))}
											</Flex>

											<SimpleGrid
												columns={2}
												gap={4}
											>
												<Box>
													<Text
														fontWeight='bold'
														mb={1}
													>
														Altura
													</Text>
													<Text>{selectedPokemon.height / 10}m</Text>
												</Box>
												<Box>
													<Text
														fontWeight='bold'
														mb={1}
													>
														Peso
													</Text>
													<Text>{selectedPokemon.weight / 10}kg</Text>
												</Box>
											</SimpleGrid>

											<Box>
												<Text
													fontWeight='bold'
													mb={2}
												>
													Stats Base
												</Text>
												<VStack
													gap={1}
													align='stretch'
												>
													{selectedPokemon.stats.map((stat, index) => (
														<HStack
															key={index}
															justify='space-between'
														>
															<Text
																textTransform='capitalize'
																fontSize='sm'
															>
																{stat.stat.name.replace('-', ' ')}
															</Text>
															<Text fontWeight='bold'>{stat.base_stat}</Text>
														</HStack>
													))}
												</VStack>
											</Box>

											{teams.length > 0 && (
												<Box>
													<Text
														fontWeight='bold'
														mb={2}
													>
														Adicionar ao Time
													</Text>
													<Select.Root
														collection={teamsCollection}
														size={'lg'}
														width={'100%'}
														value={[selectedTeamId]}
														onValueChange={(details) => {
															const value = Array.isArray(details.value)
																? details.value[0] ?? ''
																: details.value
															setSelectedTeamId(value)
														}} 
													>
														<Select.HiddenSelect />
														<Select.Label>Selecione um time</Select.Label>
														<Select.Control>
															<Select.Trigger>
																<Select.ValueText placeholder='Selecione um time' />
															</Select.Trigger>
															<Select.IndicatorGroup>
																<Select.Indicator />
															</Select.IndicatorGroup>
														</Select.Control>
															<Select.Positioner>
																<Select.Content>
																	{teams.map((team) => (
																		<Select.Item
																			item={team.id}
																			key={team.id}
																		>
																			{team.name} ({team.pokemon.length}/6)
																			<Select.ItemIndicator />
																		</Select.Item>
																	))}
																</Select.Content>
															</Select.Positioner>
													</Select.Root>
												</Box>
											)}
										</VStack>
									</Dialog.Body>

									<Dialog.Footer>
										<HStack>
											<Dialog.ActionTrigger asChild>
												<Button variant='outline'>Fechar</Button>
											</Dialog.ActionTrigger>
											{teams.length > 0 && (
												<Button
													colorScheme='blue'
													onClick={handleAddToTeam}
													loading={addingToTeam}
													loadingText='Adicionando...'
													disabled={!selectedTeamId || addingToTeam}
												>
													Adicionar ao Time
												</Button>
											)}
										</HStack>
									</Dialog.Footer>

									<Dialog.CloseTrigger asChild>
										<CloseButton size='sm' />
									</Dialog.CloseTrigger>
								</Dialog.Content>
							</Dialog.Positioner>
						</Portal>
					</Dialog.Root>
				)}
			</Container>
		</Box>
	)
}
