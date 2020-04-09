const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort
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

pgClient.query('CREATE TABLE IF NOT EXISTS results(number INT)').catch(err => console.log(err));

console.log(keys);

app.get('/', (req, resp) => {
    pgClient.query('SELECT * from results', (err,res) => {
        if(err) {
            console.log(err.stack);
        } else {
            resp.send(res.rows);
        }
    })
});

app.listen(8080, err => {
    console.log("Server listening on port 8080");
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