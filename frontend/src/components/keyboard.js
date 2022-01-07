import React, { useContext, useMemo, useCallback } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { GameContext } from '../hooks/game'

export default function Keyboard() {
  const buttons = useMemo(() => Array(9).fill(0).map((value, idx) => idx + 1), [])

  const {
    value, setValue,
    clearValue
  } = useContext(GameContext)

  const handleKeyboardClick = useCallback((num) => {
    const newValue = value + String(num)
    setValue(newValue)
    window.navigator.vibrate([15])
  }, [setValue, value])

  return (
    <Paper>
      <Box p={2} className="keyboard">
        {buttons.map(num => (
          <Button
            key={num}
            variant="outlined"
            size="large"
            onClick={() => handleKeyboardClick(num)}
          >
            {num}
          </Button>
        ))}

        <div></div>

        <Button
          size="large"
          variant="outlined"
          onClick={() => handleKeyboardClick(0)}
        >
          0
        </Button>

        <Button
          size="large"
          variant="outlined"
          onClick={clearValue}
          color="error"
        >
          C
        </Button>

      </Box>
    </Paper>
  )
}