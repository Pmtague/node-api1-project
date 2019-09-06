const express = require('express');
const db = require('./data/db.js');

const server = express();

server.use(express.json());

server.get('/api/users', (req, res) => {
	db.find()
		.then(users => res.status(200).json(users))
		.catch(err => res.status(500).json({ error: 'Users could not be retreived' }))
});

server.post('/api/users', (req, res) => {
	console.log(req.body);
	const { name, bio } = req.body;
	if (!name || !bio) {
		res.status(400).json({ error: 'requires name and bio'})
	}
	db.insert()
		.then(({ id }) => {
			db.findById(id)
				.then(user => {
					res.status(201).json(user)
				})
				.catch(err => res.status(400).json({ error: '' }))
		})
		.catch(err => {
			res.status(500).json({ error:  'User with given id could not be saved'})
		})
})

server.get('/api/users/:id', (req, res) => {
	const id = req.params.id;
	db.findById(id)
		.then(user => {
			if (user) {
				res.status(200).json(user)
			} else {
				res.status(404).json({ error: 'User not found' })
			}
		})
		.catch(err => {
			res.status(500).json({ error: 'User info could not be retreived' })
		});
});

server.delete('/api/users/:id', (req, res) => {
	const { id } = req.params;
	db.remove(id)
		.then(deleted => {
			if (deleted) {
				res.status(204).end()
			} else {
				res.status(404).json({ error: 'User with ID does not exist' })
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: 'server error deleting' });
		});
});

server.put('/api/users/:id', (req, res) => {
	const { id } = req.params;
	const { name, bio } = req.body;
	if(!name && !bio) {
		res.status(400).json({ error: 'Please provide missing info' })
	}
	db.update(id, { name, bio })
		.then(updated => {
			if (updated) {
				db.findById(id)
					.then(user => res.status(200).json(user))
					.catch(err => {
						console.log(err);
						res.status(500).json({ error: 'Error retrieving user' })
					})
			} else {
				res.status(400).json({ error: `User with id: ${ id } not found` })
			}
		})	
		.catch(err => {
			console.log(err)
			res.status(500).json({ error: 'Error updating user' })
		})
})

server.listen(4444, () => console.log('server on 4444'));
