const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send("App Working!");
});

router.get ('/health', (_, res) => {
    res.status(200).send({
        uptime: Number(process.uptime().toFixed()),
    });
});

module.exports = router;