import React, { type ReactNode } from 'react'
import {
	Box,
	Flex,
	Heading,
	Button,
	Container,
	HStack,
	ChakraProvider,
	defaultSystem,
} from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { ColorModeButton } from '../ui/color-mode'
import { ColorModeProvider } from '../ui/color-mode'

interface LayoutProps {
	children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const location = useLocation()

	const isActive = (path: string) => location.pathname === path

	const paths = {
		home: '/',
		pokemon: '/pokemon',
		teams: '/teams',
	} as const

	return (
		<ChakraProvider value={defaultSystem}>
			<ColorModeProvider>
				<Box minHeight='100vh'>
					<Box
						bg='blue.500'
						color='white'
						py={4}
						shadow='md'
						className='dark'
					>
						<Container maxW='container.xl'>
							<Flex
								justify='space-between'
								align='center'
							>
								<ColorModeButton />
								<Heading size='lg'>My Team Pokemon</Heading>
								<HStack gap={4}>
									<Link to={paths.home}>
										<Button
											variant={isActive(paths.home) ? 'solid' : 'ghost'}
											colorScheme={isActive(paths.home) ? 'blue' : undefined}
											bg={isActive(paths.home) ? 'blue.600' : 'transparent'}
											_hover={{
												bg: isActive(paths.home) ? 'blue.700' : 'blue.400',
											}}
										>
											Home
										</Button>
									</Link>
									<Link to={paths.pokemon}>
										<Button
											variant={isActive(paths.pokemon) ? 'solid' : 'ghost'}
											colorScheme={isActive(paths.pokemon) ? 'blue' : undefined}
											bg={isActive(paths.pokemon) ? 'blue.600' : 'transparent'}
											_hover={{
												bg: isActive(paths.pokemon) ? 'blue.700' : 'blue.400',
											}}
										>
											Pokemon
										</Button>
									</Link>
									<Link to={paths.teams}>
										<Button
											variant={isActive(paths.teams) ? 'solid' : 'ghost'}
											colorScheme={isActive(paths.teams) ? 'blue' : undefined}
											bg={isActive(paths.teams) ? 'blue.600' : 'transparent'}
											_hover={{
												bg: isActive(paths.teams) ? 'blue.700' : 'blue.400',
											}}
										>
											Teams
										</Button>
									</Link>
								</HStack>
							</Flex>
						</Container>
					</Box>

					<Box flex='1'>{children}</Box>
				</Box>
			</ColorModeProvider>
		</ChakraProvider>
	)
}

export default Layout
