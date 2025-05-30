import React, { useState, type ReactNode } from 'react'
import {
	Box,
	Flex,
	Heading,
	Button,
	Container,
	HStack,
	useBreakpointValue,
	Drawer,
	Portal,
	CloseButton,
} from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { GiHamburgerMenu } from 'react-icons/gi'

interface LayoutProps {
	children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const location = useLocation()
	const [open, setOpen] = useState(false)
	const isMobile = useBreakpointValue({ base: true, md: false })

	const isActive = (path: string) => location.pathname === path

	const paths = {
		home: '/',
		pokemon: '/pokemon',
		teams: '/teams',
	} as const

	const NavButton = ({
		path,
		children,
	}: {
		path: string
		children: React.ReactNode
	}) => (
		<Link to={path}>
			<Button
				variant={isActive(path) ? 'solid' : 'ghost'}
				colorScheme={isActive(path) ? 'blue' : undefined}
				bg={isActive(path) ? 'blue.600' : 'transparent'}
				_hover={{
					bg: isActive(path) ? 'blue.700' : 'blue.400',
				}}
				size={{ base: 'sm', md: 'md' }}
				width={{ base: 'full', md: 'auto' }}
				onClick={isMobile ? () => setOpen(false) : undefined}
			>
				{children}
			</Button>
		</Link>
	)

	return (
		<Box minHeight='100vh'>
			<Box
				bg='blue.500'
				color='white'
				py={{ base: 3, md: 4 }}
				shadow='md'
				position='sticky'
				top={0}
				zIndex={10}
			>
				<Container
					maxW='container.xl'
					px={{ base: 4, md: 6 }}
				>
					<Flex
						justify='space-between'
						align='center'
						width='100%'
					>
						<Heading
							size={{ base: 'md', md: 'lg' }}
							fontSize={{ base: '1.2rem', md: '1.5rem' }}
						>
							<Drawer.Root
								open={open}
								onOpenChange={(e) => setOpen(e.open)}
							>
								<Drawer.Trigger asChild>
									{isMobile ? (
										<Button
											variant='ghost'
											colorScheme='whiteAlpha'
											size='sm'
											onClick={() => setOpen(true)}
											padding={5}
										>
											<GiHamburgerMenu size={24} />
										</Button>
									) : (
										<Box
											display='inline-block'
											padding={5}
										>
											My Team Pokemon
										</Box>
									)}
								</Drawer.Trigger>
								<Portal>
									<Drawer.Backdrop />
									<Drawer.Positioner>
										<Drawer.Content>
											<Drawer.Header>
												<Drawer.Title>My Team Pokemon</Drawer.Title>
											</Drawer.Header>
											<Drawer.Body>
												<Flex
													direction='column'
													gap={4}
													p={4}
												>
													<NavButton path={paths.home}>Home</NavButton>
													<NavButton path={paths.pokemon}>Pokemon</NavButton>
													<NavButton path={paths.teams}>Teams</NavButton>
												</Flex>
											</Drawer.Body>
											<Drawer.CloseTrigger asChild>
												<CloseButton size='sm' />
											</Drawer.CloseTrigger>
										</Drawer.Content>
									</Drawer.Positioner>
								</Portal>
							</Drawer.Root>
						</Heading>

						{!isMobile && (
							<HStack gap={{ base: 2, md: 4 }}>
								<NavButton path={paths.home}>Home</NavButton>
								<NavButton path={paths.pokemon}>Pokemon</NavButton>
								<NavButton path={paths.teams}>Teams</NavButton>
							</HStack>
						)}
					</Flex>
				</Container>
			</Box>

			<Box
				flex='1'
				px={{ base: 4, md: 6 }}
				py={{ base: 4, md: 6 }}
			>
				{children}
			</Box>
		</Box>
	)
}

export default Layout
