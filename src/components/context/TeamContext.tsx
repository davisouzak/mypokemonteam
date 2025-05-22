import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Team, CreateTeamData } from '../types/team';
import type { PokemonBasic } from '../types/pokemon';
import { teamService } from '../services/teamService';

interface TeamContextType {
  teams: Team[];
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  createTeam: (data: CreateTeamData) => Team;
  deleteTeam: (teamId: string) => boolean;
  addPokemonToTeam: (teamId: string, pokemon: PokemonBasic) => Team | null;
  removePokemonFromTeam: (teamId: string, pokemonId: number) => Team | null;
  refreshTeams: () => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

interface TeamProviderProps {
  children: ReactNode;
}

export const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  const refreshTeams = () => {
    const updatedTeams = teamService.getTeams();
    setTeams(updatedTeams);
  };

  useEffect(() => {
    refreshTeams();
  }, []);

  const createTeam = (data: CreateTeamData): Team => {
    const newTeam = teamService.createTeam(data);
    refreshTeams();
    return newTeam;
  };

  const deleteTeam = (teamId: string): boolean => {
    const success = teamService.deleteTeam(teamId);
    if (success) {
      refreshTeams();
      if (currentTeam?.id === teamId) {
        setCurrentTeam(null);
      }
    }
    return success;
  };

  const addPokemonToTeam = (teamId: string, pokemon: PokemonBasic): Team | null => {
    const updatedTeam = teamService.addPokemonToTeam(teamId, pokemon);
    if (updatedTeam) {
      refreshTeams();
      if (currentTeam?.id === teamId) {
        setCurrentTeam(updatedTeam);
      }
    }
    return updatedTeam;
  };

  const removePokemonFromTeam = (teamId: string, pokemonId: number): Team | null => {
    const updatedTeam = teamService.removePokemonFromTeam(teamId, pokemonId);
    if (updatedTeam) {
      refreshTeams();
      if (currentTeam?.id === teamId) {
        setCurrentTeam(updatedTeam);
      }
    }
    return updatedTeam;
  };

  const value: TeamContextType = {
    teams,
    currentTeam,
    setCurrentTeam,
    createTeam,
    deleteTeam,
    addPokemonToTeam,
    removePokemonFromTeam,
    refreshTeams
  };

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = (): TeamContextType => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};