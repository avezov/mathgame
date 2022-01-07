import {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
  createContext,
  useContext
} from "react"
import { v4 as uuidv4 } from 'uuid'

export const GameContext = createContext({})

const getMyUserId = () => {
  const userId = window.localStorage.userId ?? uuidv4()
  window.localStorage.userId = userId
  return userId
}

export function useGame() {
  const user = useUser()

  const [connected, setConnected] = useState(false)
  const [value, setValue] = useState('')
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [sign, setSign] = useState('plus')
  const [scores, setScores] = useState([])

  const summ = useMemo(() => {
    return sign === 'plus'
      ? num1 + num2
      : num1 - num2
  }, [num1, num2, sign])

  const clearValue = useCallback(() => {
    setValue(sign === 'minus' && num1 < num2 ? '-' : '')
  }, [num1, num2, sign])

  return {
    value, setValue,
    num1, setNum1,
    num2, setNum2,
    sign, setSign,
    summ,
    clearValue,
    user,
    connected, setConnected,
    scores, setScores
  }
}

function useUser() {
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState(getMyUserId())

  return {
    userName, setUserName,
    userId, setUserId,
  }
}

export function useSocket() {
  const {
    setConnected,
    setNum1,
    setNum2,
    setSign,
    value,
    setValue,
    user: { userName, setUserName, userId },
    scores, setScores,
  } = useContext(GameContext)

  const socketRef = useRef(null)

  const sendMyName = useCallback(() => {
    if (userName) {
      socketRef.current.emit('setName', userName)
    }
  }, [userName])

  useEffect(() => {
    if (socketRef.current) return

    socketRef.current = window.io({
      auth: {
        token: userId
      }
    })
    socketRef.current.on('connect', () => {
      setConnected(true)
    })
    socketRef.current.on('disconnect', () => setConnected(false))

    socketRef.current.on('newQuestion', state => {
      setNum1(state.num1)
      setNum2(state.num2)
      setSign(state.sign)
      if (state.sign === 'minus' && state.num2 > state.num1) {
        setValue('-')
      } else {
        setValue('')
      }
    })

    socketRef.current.on('myName', name => {
      setUserName(name)
    })

    socketRef.current.on('scores', scores => {
      setScores(scores)
    })
  }, [sendMyName, setConnected, setNum1, setNum2, setScores, setSign, setUserName, setValue, userId])

  useEffect(() => {
    sendMyName()
  }, [sendMyName])

  useEffect(() => {
    if (value !== '' && value !== '-') {
      socketRef.current.emit('tryAnswer', value)
    }
  }, [value])
}