import React, { useCallback, useRef, useState, useContext } from 'react'
import { AppBar, Button, Dialog, DialogActions, DialogContent, TextField, Toolbar, Typography } from '@mui/material'
import { GameContext } from '../hooks/game'

export default function Header() {
  const { user: { userName, setUserName } } = useContext(GameContext)
  const [openDialog, setOpenDialog] = useState(false)
  const inputRef = useRef(null)

  const handleSetNewName = useCallback(() => {
    const name = inputRef.current.value
    setUserName(name)
    setOpenDialog(false)
  }, [setUserName])

  const handleOpenDialog = useCallback(() => {
    setOpenDialog(true)
  }, [])

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false)
  }, [])

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {userName}
          </Typography>
          <Button
            color="inherit"
            onClick={handleOpenDialog}
          >Имя</Button>
        </Toolbar>
      </AppBar>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <TextField
            fullWidth
            inputRef={inputRef}
            size="small"
            label="Ваше имя или ник"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleSetNewName}
          >Сохранить</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}