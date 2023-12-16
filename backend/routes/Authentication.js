const { Router } = require('express');

const router = Router();

router.get('/login', (req, res) => {
    res.send('Login');
});


module.exports = router;