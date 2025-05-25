import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box, ChakraProvider, defaultSystem } from '@chakra-ui/react'
import Layout from './components/common/Layout'
import Home from './components/pages/Home'
import Pokemon from './components/pages/Pokemon'
import Teams from './components/pages/Teams'
import { ColorModeProvider } from './components/ui/color-mode'

const App: React.FC = () => {
	return (
		<ChakraProvider value={defaultSystem}>
			<ColorModeProvider>
				<Box
			minHeight='100vh'
			bg='gray.50'
		>
			<Layout>
				<Routes>
					<Route
						path='/'
						element={<Home />}
					/>
					<Route
						path='/pokemon'
						element={<Pokemon />}
					/>
					<Route
						path='/teams'
						element={<Teams />}
					/>
				</Routes>
			</Layout>
		</Box>
			</ColorModeProvider>
		</ChakraProvider>
	)
}

export default App
