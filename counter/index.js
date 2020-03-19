const express = require('express');
const redis = require('redis');

const app = express();
const process = require('process');

const client = redis.createClient({
    host: 'redis-server',
    port: 6379
});

client.set('counter', 0);

app.get("/", (req, resp) => {
    console.log('New request');
    process.exit(0);
    client.get('counter', (err, counter) => {
        resp.send("counter: " + counter);
        client.set('counter', parseInt(counter) + 1);
    })
});

app.get('/:number', (req, resp) => {
    const numberValue = req.params.number;
    if (numberValue > 9) {
        process.exit(1);
    };

    client.get(numberValue, (err, result) => {
        if (!result) {
            client.set(numberValue, parseInt(factorial(numberValue)));
            resp.send('bez cache result '  + parseInt(factorial(numberValue)) + "\n");
        }
        else {
            resp.send('z cache result: ' + result + "\n");
        };
    });
});

function factorial(x) 
{ 
  if (x === 0)
 {
    return 1;
 }
  return x * factorial(x-1);   
}

app.listen(8080, () => {
    console.log("Server listening on port 8080");
});
