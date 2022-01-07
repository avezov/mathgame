import EventEmitter from 'events'
import { PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient()

type Sign = 'plus' | 'minus'

export default class Game extends EventEmitter {
  num1 = 0
  num2 = 0
  sign: Sign = 'plus'

  constructor() {
    super()
    this.getNewQuestion();
  }

  getNewQuestion() {
    this.num1 = Math.random() * 100 | 0
    this.num2 = Math.random() * 100 | 0
    this.sign = Math.random() > 0.5 ? 'plus' : 'minus'

    this.emit('newQuestion', this.getState());
  }

  getState() {
    return {
      num1: this.num1,
      num2: this.num2,
      sign: this.sign,
    }
  }

  checkAnswer(value: string) {
    const summ = this.sign === 'plus'
      ? this.num1 + this.num2
      : this.num1 - this.num2;

    if (Number(value) === summ) {
      this.getNewQuestion();
      return true;
    }

    return false;
  }

  async getScores(): Promise<Partial<User>[]> {
    return (
      await prisma.user.findMany({
        orderBy: {
          score: 'desc'
        }
      })
    ).map(user => ({
      id: user.id,
      name: user.name,
      score: user.score
    }))
  }

  async sendScores() {
    const scores = await this.getScores()
    this.emit('sendScores', scores)
  }

}