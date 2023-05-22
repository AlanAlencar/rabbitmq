/**
 * server.js
 * @author Alan Alencar
 * @description Barramento API para receber a solicitação de envio de mensagem.
 * @version 1.0.0
 */

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Producer = require('./producer');
const producer = new Producer(); // Instanciar para uso aqui para evitar criar mais de um.

app.use(bodyParser.json('application/json'));

// Route log
app.post('/log', async (req, res, next) => {
    try {
        await producer.publishMessage(req.body.logType, 
                                      req.body.message, 
                                      req.body.date,
                                      req.body.clientID,
                                      req.body.serviceID);
        res.status(200).send('Message received ...');
    } catch(err) {
        res.status(400).send('Bad request. The message will not received ...');
    }
    
});

// listen
app.listen(6001, () => {
    console.log('Server up on port 6001');
});

// Alan Alencar