const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /users'
    });
});

router.post('/', (req, res, next) => {
    const userAddr = { /*li an9ssu lih trustIndex*/
        userId: req.body.userId
    };
    res.status(201).json({
        message: 'Handling POST requests to /users',
        userId, userAddr
    });
});

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    if(id === 'special') {
        res.status(200).json({
            message: 'You are special',
            id: id
        });
    }

    res.status(200).json({
        message: 'You passed an ID'
    });
});

router.patch('/:userId', (req, res, next) => {
    res.status(200).json({
        message: 'updated user'
    });
});

module.exports = router;