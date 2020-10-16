const express = require('express');
const router = express.Router();

// load user model
const db = require('../../models');
const Exercise = require('../../models/Exercise');

// POST route api/users/exercises/add (Public)
router.post('/add', (req, res) => {
    // find user using email
    db.User.findOne({
        // _id: req.params.id
        email: req.body.email
    })
    .then((user) => 
    {
        const newExercise = new Exercise({
            name: req.body.name,
            time: req.body.time
        })

        newExercise.save()
        .then( createdExercise => {
            user.exercises.push(createdExercise)
            user.save()
            res.send(user)
        })
    })
    .catch(err => console.log(err))
})

router.delete('/:id', (req,res) => {
    Exercise.deleteOne({
        _id: req.params.id
    })
    .then(res.send('deleted'))
    .catch(err => console.log(err))
})

router.post('/update', (req, res) => {
    db.User.findOne({
        email: req.body.email
    })
    .then((user) => {
        if (user.exercises.includes(req.body.exerciseId)) {
            db.Exercise.findOneAndUpdate({_id: req.body.exerciseId}, {time: req.body.time})
            .then(updatedExercise => {
                console.log(updatedExercise);
                res.send(user)
            })
            .catch(err => console.log(err))
        }  
    })
    .catch(err => console.log(err))
})

module.exports = router