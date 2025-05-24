import React, { useState } from 'react'
import {
	Container,
	VStack,
	Heading,
	Button,
	SimpleGrid,
	Text,
	Center,
	HStack,
	Box,
} from '@chakra-ui/react'
import { useTeam } from '../context/TeamContext'
import CreateTeamModal from '../team/CreateTeamModal'
import TeamCard from '../team/TeamCard'

const Teams: React.FC = () => {
	const { teams } = useTeam()
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

	return (
		<Container
			maxW='container.xl'
			py={8}
		>
			<VStack
				gap={8}
				align='stretch'
			>
				<Box textAlign='center'>
					<Heading
						size='xl'
						mb={4}
						color='blue.600'
					>
						Meus Times Pokemon
					</Heading>
					<Text
						fontSize='lg'
						color='gray.600'
						mb={6}
					>
						Gerencie todos os seus times de Pokemon
					</Text>

					<Button
						colorScheme='blue'
						size='lg'
						onClick={() => setIsCreateModalOpen(true)}
					>
						Criar Novo Time
					</Button>
				</Box>

				{teams.length === 0 ? (
					<Center py={16}>
						<VStack gap={4}>
							<Text
								fontSize='xl'
								color='gray.500'
							>
								Você ainda não tem nenhum time
							</Text>
							<Text color='gray.400'>
								Crie seu primeiro time para começar a adicionar Pokemon!
							</Text>
							<Button
								colorScheme='blue'
								onClick={() => setIsCreateModalOpen(true)}
								mt={4}
							>
								Criar Primeiro Time
							</Button>
						</VStack>
					</Center>
				) : (
					<>
						<HStack
							justify='space-between'
							align='center'
						>
							<Text
								fontSize='lg'
								fontWeight='medium'
								color='gray.700'
							>
								{teams.length}{' '}
								{teams.length === 1 ? 'time criado' : 'times criados'}
							</Text>
						</HStack>

						<SimpleGrid
							columns={{ base: 1, md: 2, lg: 3 }}
							gap={6}
						>
							{teams.map((team) => (
								<TeamCard
									key={team.id}
									team={team}
								/>
							))}
						</SimpleGrid>
					</>
				)}
			</VStack>

			<CreateTeamModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
			/>
		</Container>
	)
}

export default Teams
