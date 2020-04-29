const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

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

app.listen(4000, err => {
    console.log("Server listening on port 4000");
});

app.get('/:number1/:number2', (req, resp) => {
    let numberValue1 = req.params.number1;
    let numberValue2 = req.params.number2;
    let cache = numberValue1 + ',' + numberValue2;

    redisClient.get(cache, (err, cacheValue) => {
        if (!cacheValue) {
            redisClient.set(cache, parseInt(nwd(numberValue1, numberValue2)));
            
            resp.send('bez cache result '  + parseInt(nwd(numberValue1, numberValue2)) + "\n");

            pgClient.query('INSERT INTO results(number) VALUES($1)', [parseInt(nwd(numberValue1, numberValue2))], (err, res) => {
                if(err){
                    console.log(err.stack);
                };
            })
        }
        else {
            resp.send('z cache result: ' + cacheValue + "\n");
        };
    });
});

function nwd(x, y) {
    if(!y) {
        return x;
    }
    return nwd(y, x % y);
}