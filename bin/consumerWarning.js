/**
 * consumerWarning.js
 * @author Alan Alencar
 * @description microserviço que irá consumir uma fila que recebeu
 *              mensagens roteadas pela routing key "warning".
 *              🎯 Este microserviço vai user IIFE (Immediately Invoked Function Expression)
 *              para disparar sua execução.
 * @version 1.0.0
 */

/**
 * to-do
 * 1 - Connectar ao RabbitMQ.
 * 2 - Criar um canal de comunicação.
 * 3 - Acessar o Exchange que foi criado anteriormente pelo producer.js para enviar mensagens.
 * 4 - Criar a fila.
 * 5 - Efetuar o binding da fila criada com o exchange.
 * 6 - Por último, consumir a fila dando ack (reconhecimento) da mensagem para ele ser apagada.
 * 
 * Importante:
 * 
 *  Você poderia criar esta fila através da console do RabbitMQ.
 *  Também pode fazer o binding e definir a routing key por lá, mas tem que garantir que isto
 *  esteja feito corretamente para este microserviço funcionar. Aqui é uma proteção na qual
 *  farei tudo pelo microserviço mesmo. Mas é importante lembrar que parte deste código pode
 *  ser desnecessário se você optar por esta estratégia.
 */

const amqp = require('amqplib');
const config = require('./../config/rabbitMQ');

(async () => {
    const conn = await amqp.connect(config.rabbitMQ.url);
    const channel = await conn.createChannel();
    await channel.assertExchange(config.rabbitMQ.exchangeName, 'direct'); // Usar o mesmo exchange.

    // Agora vamos criar a fila e fazer o binding com o exchange definindo o routing key.
    const myQueue = await channel.assertQueue('queueWarning');
    /**
     * @param queue Queue name (string);
     * @param exchange Exchange name (string);
     * @param pattern Routing key [direct] (string);
     */
    await channel.bindQueue(myQueue.queue, config.rabbitMQ.exchangeName, 'warning');

    // lendo mensagem e ecoando na console sem confirmar recebimento (ack)
    channel.consume(myQueue.queue, (msg) => {
        const data = JSON.parse(msg.content);
        console.log(data);
        channel.ack(msg);
    });
})();


// Alan Alencar