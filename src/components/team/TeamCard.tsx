import React from 'react'
import {
	Box,
	Button,
	Text,
	Image,
	Badge,
	useDisclosure,
	Grid,
	Stack,
	Dialog,
  Portal,
  SimpleGrid,
} from '@chakra-ui/react'
import type { Team } from '../types/team'
import { useTeam } from '../context/TeamContext'

interface TeamCardProps {
	team: Team
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
	const { deleteTeam } = useTeam()
	const { onOpen, onClose } = useDisclosure()
	const cancelRef = React.useRef<HTMLButtonElement>(null)

	const handleDeleteTeam = () => {
		deleteTeam(team.id)
		onClose()
	}

	const getTeamStatus = () => ({
		color:
			team.pokemon.length === 0
				? 'gray'
				: team.pokemon.length < 6
				? 'yellow'
				: 'green',
		text:
			team.pokemon.length === 0
				? 'Vazio'
				: team.pokemon.length < 6
				? 'Incompleto'
				: 'Completo',
	})

	const status = getTeamStatus()
	const emptySlots = 6 - team.pokemon.length

	return (
		<>
			<Box
				borderWidth='1px'
				borderRadius='lg'
				p={4}
				bg='white'
				boxShadow='md'
			>
				<Stack gap={3}>
					<Box
						display='flex'
						justifyContent='space-between'
					>
						<Text
							fontWeight='bold'
							fontSize='lg'
						>
							{team.name}
						</Text>
						<Badge colorScheme={status.color}>{status.text}</Badge>
					</Box>

					{team.description && (
						<Text
							fontSize='sm'
							color='gray.600'
						>
							{team.description}
						</Text>
					)}

					<Text
						fontSize='xs'
						color='gray.500'
					>
						Criado em: {new Date(team.createdAt).toLocaleDateString('pt-BR')}
					</Text>

					<Box>
						<Text
							fontSize='sm'
							mb={2}
						>
							Pokémon: {team.pokemon.length}/6
						</Text>

						<Grid
							templateColumns='repeat(3, 1fr)'
							gap={2}
						>
							{team.pokemon.map((pokemon) => (
								<Box
									key={pokemon.id}
									textAlign='center'
									p={2}
									bg='gray.50'
									borderRadius='md'
								>
									<Image
										src={pokemon.image}
										alt={pokemon.name}
										boxSize='60px'
										mx='auto'
									/>
									<Text
										fontSize='xs'
										mt={1}
										textTransform='capitalize'
									>
										{pokemon.name}
									</Text>
								</Box>
							))}

							{Array.from({ length: emptySlots }).map((_, i) => (
								<Box
									key={`empty-${i}`}
									border='2px dashed'
									borderColor='gray.300'
									borderRadius='md'
									minH='85px'
									display='flex'
									alignItems='center'
									justifyContent='center'
								>
									<Text
										fontSize='xs'
										color='gray.400'
									>
										Vazio
									</Text>
								</Box>
							))}
						</Grid>
					</Box>

					<Box
						display='flex'
						justifyContent='space-between'
						mt={3}
					>
						<Dialog.Root>
                                  <Dialog.Trigger asChild>
                                    <Button
                                      colorScheme='blue'
                                      variant='outline'
                                      size='sm'
                                    >
                                      Ver time
                                    </Button>
                                  </Dialog.Trigger>
                                  <Portal>
                                    <Dialog.Backdrop />
                                    <Dialog.Positioner>
                                      <Dialog.Content>
                                        <Dialog.Header>
                                          <Dialog.Title>Time: {team.name}</Dialog.Title>
                                        </Dialog.Header>
                                        <Dialog.Body>
                                          <Text
                                            color='gray.600'
                                            mb={4}
                                          >
                                            {team.description}
                                          </Text>
            
                                          <SimpleGrid
                                            columns={3}
                                            gap={2}
                                          >
                                            {team.pokemon.map((pokemon) => (
                                              <Box
                                                key={pokemon.id}
                                                textAlign='center'
                                              >
                                                <Image
                                                  src={pokemon.image}
                                                  alt={pokemon.name}
                                                  boxSize='60px'
                                                  objectFit='contain'
                                                  mx='auto'
                                                />
                                                <Text
                                                  fontSize='xs'
                                                  mt={1}
                                                  textTransform='capitalize'
                                                >
                                                  {pokemon.name}
                                                </Text>
                                              </Box>
                                            ))}
                                          </SimpleGrid>
                                        </Dialog.Body>
                                      </Dialog.Content>
                                    </Dialog.Positioner>
                                  </Portal>
                                </Dialog.Root>

						<Button
							colorScheme='red'
							variant='outline'
							size='sm'
							onClick={onOpen}
						>
							Deletar
						</Button>
					</Box>
				</Stack>
			</Box>

			<Dialog.Root>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content borderRadius='md'>
						<Dialog.Header fontWeight='bold'>Excluir Time</Dialog.Header>
						<Dialog.Body>
							Tem certeza que deseja excluir o time "{team.name}"? Esta ação não
							pode ser desfeita.
						</Dialog.Body>
						<Dialog.Footer>
							<Button
								ref={cancelRef}
								onClick={onClose}
								size='sm'
							>
								Cancelar
							</Button>
							<Button
								colorScheme='red'
								onClick={handleDeleteTeam}
								ml={3}
								size='sm'
							>
								Excluir
							</Button>
						</Dialog.Footer>
						<Dialog.CloseTrigger
							position='absolute'
							top='3'
							right='3'
						/>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Root>
		</>
	)
}

export default TeamCard
