/**
 * producer.js
 * @author Alan Alencar
 * @description microserviço que irá encaminhar as mensagens recebidas
 *              pelo barramento Rest do server para um exchange 
 *              no RabbitMQ.
 * @version 1.0.0
 */

/**
 * To-do
 * 1 - Conectar ao RabbitMQ rodando no Docker.
 * 2 - Criar um channel para comunicar com o RabbitMQ.
 * 3 - Criar um Exchange para receber as mensagens no RabbitMQ.
 * 4 - Publicar as mensagens no RabbitMQ através do Exchange com.
 *     uma Routing Key vinda no jSon da mensagem.
 */

const amqp = require('amqplib');
const config = require('./../config/rabbitMQ');

class Producer {
    channel;

    async createChannel() {
        const conn = await amqp.connect(config.rabbitMQ.url);
        this.channel = await conn.createChannel();
    }

    async publishMessage(routingKey, message, date, clientID, serviceID) {
        if (!this.channel) { // Se não existir um, crie.
            await this.createChannel();
        }

        const logDetails = JSON.stringify({ 
                                            logType: routingKey,
                                            message: message,
                                            date: date,
                                            clientID: clientID,
                                            serviceID: serviceID
                                          });
        await this.channel.assertExchange(config.rabbitMQ.exchangeName, 'direct');
        await this.channel.publish(config.rabbitMQ.exchangeName, routingKey, Buffer.from(logDetails));

        console.log(`The message "${message}", routing key "${routingKey}" is sent to exchange ${config.rabbitMQ.exchangeName}`);
    }
}

module.exports = Producer;

// Alan Alencar