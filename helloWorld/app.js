const express = require('express');

const app = express();

app.get("/", (req, resp) => {
    resp.send("Hello WORLD -----");
});

app.listen(4000, () => {
    console.log("Server listening on port 4000");
});