const express = require('express');

const db = require('../data/dbConfig');

const router = express.Router();


router.get('/', (req, res) => {
    db
    .select('*')
    .from('accounts')
    .then(accounts => {
        if (accounts.length === 0) {
            res.status(200).json({ message: 'No accounts currently available; Please add an account' })
        } else {
            res.status(200).json(accounts);
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: 'Error retrieving the accounts' });
    })
})

router.get('/:id', (req, res) => {
    db
    .select('*')
    .from('accounts')
    .where({ id: req.params.id })
    .first()
    .then(account => {
        if (!account) {
            res.status(404).json({ message: 'invalid accound id' })
        } else {
            res.status(200).json(account);
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: 'Error retrieving the account' });
    })
})

router.post('/', (req, res) => {
    const accountData = req.body;
    
    if (!accountData) {
        res.status(400).json({ error: 'missing account data' })
    } else if (!accountData.name || !accountData.budget) {
        res.status(400).json({ error: 'missing required name and budget info' })
    } else {
        db('accounts')
        .insert(accountData, 'id')
        .then(ids => {
            const id=ids[0];

            return db('accounts')
            .select('*')
            .where({ id })
            .first()
            .then(account => {
                res.status(201).json(account);
            });
    })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'Error adding the account' });
        })
    } 
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const accountData = req.body;

    db('accounts')
    .where({ id })
    .update(accountData)
    .then(count => {
        if (count > 0) {
            res.status(200).json({ message: `${count} record(s) updated` });
        } else {
            res.status(404).json({ message: 'Account not found' });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: 'Error updating the account' });
    })
})

router.delete('/:id', (req, res) => {
    db('accounts')
    .where({ id: req.params.id })
    .del()
    .then(count => {
        if (count > 0) {
            res.status(200).json({ message: `${count} record(s) deleted` });
        } else {
            res.status(404).json({ message: 'Account not found' });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: 'Error deleting the account' });
    })
})




module.exports = router;