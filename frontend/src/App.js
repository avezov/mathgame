import React from 'react'
import './App.css';
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import { GameContext, useGame } from './hooks/game'

import Keyboard from './components/keyboard'
import { Typography } from '@mui/material'
import Header from './components/header'
import Connection from './components/connection'
import Scores from './components/scores'

function App() {
  const game = useGame()
  const { num1, sign, num2, value } = game;

  return (
    <GameContext.Provider value={game}>
      <Header />
      <Connection />
      <Box p={2}>
        <Paper>
          <Box p={2}>
            <Typography
              align="center"
              variant="h4"
            >
              {num1} {sign === 'plus' ? '+' : '-'} {num2}
            </Typography>
          </Box>
        </Paper>

        <Box mt={2} />

        <Paper>
          <Box p={2}>
            <TextField
              fullWidth
              value={value}
            />
          </Box>
        </Paper>

        <Keyboard />
      </Box>

      <Box p={2}>
        <Scores />
      </Box>
    </GameContext.Provider>
  );
}

export default App;
