const { v4: uuidv4 } = require('uuid');

const keys = require('./keys');
const express = require('express');

const app = express();

const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => console.log('No connection to PG DB'));

pgClient.query('CREATE TABLE IF NOT EXISTS results(number VARCHAR(300))').catch(err => console.log(err));


console.log(keys);

const appId = uuidv4();
const appPort = 5000;

app.get('/', (req, res) => {
    res.send(`[${appId}] ${keys.initMessage}`);
});

app.get('/query/', (req, resp) => {
    pgClient.query('SELECT * FROM results', (err, res) => {
        if (err) {
            console.log(err.stack);
        }
        else {
            resp.send(res.rows);
        };
    })
});

app.listen(appPort, err => {
    console.log(`Backend listening on port ${appPort}`);
});

app.get('/:number', (req, resp) => {
    const number = req.params.number;

    redisClient.get(number, (err, result) => {
        if (!result) {
            res23 = currencyFormat(number * 1.23)
            res22 = currencyFormat(number * 1.22)
            res8 = currencyFormat(number * 1.08)
            res7 = currencyFormat(number * 1.07)
            res5 = currencyFormat(number * 1.05)
            res3 = currencyFormat(number * 1.03)

            numbersResult = {
                result23 : res23,
                result22 : res22,
                result8 : res8,
                result7 : res7,
                result5 : res5,
                result3 : res3
            };
            redisClient.set(number, JSON.stringify(numbersResult));
            resp.send(JSON.stringify(numbersResult));

            pgClient.query('INSERT INTO results(number) VALUES($1)', [JSON.stringify(numbersResult)], (err, res) => {
                if(err){
                    console.log(err.stack);
                };
            })
        }
        else {
            resp.send(result);
        };
    });
});

function currencyFormat(num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' PLN'
 }
