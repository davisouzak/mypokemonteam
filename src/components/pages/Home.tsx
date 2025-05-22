import React, { useState } from 'react';
import { Button, Heading, Text, Box, Container, SimpleGrid, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import CreateTeamModal from '../team/CreateTeamModal';

const Home: React.FC = () => {
  const { teams } = useTeam();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="home-page">
      <Container maxW="container.xl" py={8}>
        <Box textAlign="center" mb={12}>
          <Heading as="h1" size="xl" mb={4} color="blue.600">
            Bem-vindo ao My Team Pokemon!
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={8}>
            Crie seu time dos sonhos com seus Pokemon favoritos
          </Text>
          
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Criar Novo Time
          </Button>
        </Box>

        {teams.length > 0 && (
          <section className="recent-teams">
            <Heading as="h2" size="lg" mb={6} color="gray.700">
              Seus Times Recentes
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
              {teams.slice(0, 6).map((team) => (
                <Box 
                  key={team.id} 
                  className="team-card" 
                  p={6}
                  borderRadius="md"
                  boxShadow="md"
                  transition="all 0.2s"
                  bg="white"
                >
                  <Box textAlign="center">
                    <Heading as="h3" size="md" mb={4}>
                      {team.name}
                    </Heading>
                    
                    {team.description && (
                      <Text color="gray.600" mb={4}>
                        {team.description}
                      </Text>
                    )}
                    
                    <Box mb={4}>
                      <Text fontSize="sm" color="gray.500" mb={2}>
                        Pokemon: {team.pokemon.length}/6
                      </Text>
                      
                      <SimpleGrid columns={3} gap={2}>
                        {team.pokemon.slice(0, 6).map((pokemon) => (
                          <Box key={pokemon.id} textAlign="center">
                            <Image
                              src={pokemon.image}
                              alt={pokemon.name}
                              boxSize="60px"
                              objectFit="contain"
                              mx="auto"
                            />
                          </Box>
                        ))}
                      </SimpleGrid>
                    </Box>
                    
                    <Link to={`/teams/${team.id}`}>
                      <Button
                        colorScheme="blue"
                        variant="outline"
                        size="sm"
                      >
                        Ver Time
                      </Button>
                    </Link>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
            
            <Box textAlign="center" mt={8}>
              <Link to="/teams">
                <Button 
                  variant="outline" 
                  colorScheme="blue"
                >
                  Ver Todos os Times
                </Button>
              </Link>
            </Box>
          </section>
        )}

        <Box 
          textAlign="center" 
          p={8} 
          bg="blue.50" 
          borderRadius="lg"
          mt={8}
        >
          <Heading as="h2" size="md" mb={4}>
            Comece Explorando Pokemon!
          </Heading>
          <Text mb={4} color="gray.600">
            Descubra centenas de Pokemon e adicione-os aos seus times
          </Text>
          <Link to="/pokemon">
            <Button colorScheme="blue" variant="outline">
              Explorar Pokemon
            </Button>
          </Link>
        </Box>
      </Container>

      <CreateTeamModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)} onTeamCreated={function (): void {
                  throw new Error('Function not implemented.');
              } } onError={function (): void {
                  throw new Error('Function not implemented.');
              } }      />
    </div>
  );
};

export default Home;