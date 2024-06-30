import { Kafka, EachMessagePayload  } from 'kafkajs'
import { updateWallet } from '../routes/api/transact';
import { ITransaction } from "../models/Transaction";

class Consumer {
  private kafka: Kafka
  private consumer: any
  constructor() {
    this.kafka = new Kafka({
      clientId: 'kafka-consumer',
      brokers: ['localhost:29092']
    })
    this.consumer = this.kafka.consumer({ groupId: 'kafka-consumer' })
  }

  async disconnect() {
    await this.consumer.disconnect()
  }

  async init() {
    console.log('[Kafka] Consumer init')
    await this.consumer.connect()
    await this.consumer.subscribe({ topic: 'test' })
    await this.consumer.run({
      eachMessage: async (messagePayload: EachMessagePayload) => {
        const { topic, partition, message } = messagePayload
        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
        console.log(`- ${prefix} ${message.key}#${message.value}`)
        const transactionData = JSON.parse(message.value.toString())
        try {
          await updateWallet(transactionData as ITransaction)
        } catch (err) {
          console.log(err)
        }
      }
    })
  }
}

export default new Consumer()