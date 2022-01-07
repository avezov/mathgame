import { Socket } from "socket.io";
import EventEmitter from 'events'
import { PrismaClient, User } from '@prisma/client'
import { getRandomName } from "./utils";

const prisma = new PrismaClient()

export default class Player extends EventEmitter {
  socket: Socket
  userId: string
  user: User | null = null

  constructor(socket: Socket) {
    super()
    this.socket = socket
    this.userId = socket.handshake.auth.token
    this.socket.on('disconnect', this.onDisconnect.bind(this))
    this.socket.on('setName', this.onSetName.bind(this))
    this.socket.on('tryAnswer', this.emit.bind(this, 'tryAnswer'))

    this.loadUserInfo();
  }

  async loadUserInfo() {
    this.user = await prisma.user.findFirst({
      where: { userId: this.userId }
    })

    if (!this.user) {
      this.user = await prisma.user.create({
        data: {
          userId: this.userId,
          name: getRandomName()
        }
      })
    }

    this.sendMyName();
  }

  onDisconnect() {}

  async onSetName(name: any) {
    name = String(name);
    await prisma.user.update({
      data: { name: name },
      where: { userId: this.userId }
    });
    this.emit('sendScores');
  }

  sendMyName() {
    this.socket.emit('myName', this.user?.name)
  }

  async scorePlus() {
    this.user = await prisma.user.update({
      data: {
        score: { increment: 1 }
      },
      where: { userId: this.userId }
    })
  }

  async sendScores(scores: Partial<User>[]) {
    this.socket.emit('scores', scores)
  }
}