import { Paper, Table, TableBody, TableCell, TableRow } from "@mui/material"
import React, { useContext } from "react"
import { GameContext } from "../hooks/game"

export default function Scores() {
  const { scores } = useContext(GameContext)
  return (
    <Paper>
      <Table>
        <TableBody>
          {scores.map(user => (
            <TableRow>
              <TableCell size="small">{user.name}</TableCell>
              <TableCell size="small">{user.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}