import { Alert } from '@mui/material'
import React, { useContext } from 'react'
import { GameContext, useSocket } from '../hooks/game'

export default function Connection() {
  useSocket()
  const { connected } = useContext(GameContext)
  return (
    <Alert
      severity={connected ? 'success' : 'error'}
    >
      {connected ? 'Подключено' : 'Отключено'}
    </Alert>
  )
}