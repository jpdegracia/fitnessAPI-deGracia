const Workout = require('../models/Workout');

module.exports.addWorkout = (req, res) => {
    const { name, duration } = req.body;
    const userId = req.user.id;

    if (!name) {
        return res.status(400).send({ error: "Workout name is required" });
    }

    if (!duration) {
        return res.status(400).send({ error: "Workout duration is required" });
    }

    let newWorkout = new Workout({
        userId,
        name,
        duration,
        status: "pending"
    });

    newWorkout.save()
        .then(workout => res.status(201).send(workout))
        .catch(err => {
            console.error("Error in saving workout: ", err);
            return res.status(500).send({ error: "Internal server error" });
        });
};

module.exports.getMyWorkouts = (req, res) => {

    Workout.find({userId: req.user.id})
    .then(workouts => {

        if (workouts.length > 0){
            return res.status(200).send({ workouts });
        }
        else {

            return res.status(200).send({ message: 'No Workouts found.' })
        }

    }).catch(err => res.status(500).send({ error: 'Error finding Workouts.' }));

};

module.exports.updateWorkout = (req, res) => {
    let workoutUpdates = {
        name: req.body.name,
        duration: req.body.duration,
    };

    return Workout.findById(req.params.id) // Check if workout exists first
        .then(existingWorkout => {
            if (!existingWorkout) {
                return res.status(404).send({ error: 'Workout not found' });
            }

            return Workout.findByIdAndUpdate(req.params.id, workoutUpdates, { new: true }) // Return updated document
                .then(updatedWorkout => res.status(200).send({ 
                    message: 'Workout updated successfully', 
                    updatedWorkout 
                }));
        })
        .catch(err => {
            console.error("Error updating workout:", err);
            return res.status(500).send({ error: 'Error updating workout.' });
        });
};

module.exports.deleteWorkout = (req, res) => {
    return Workout.deleteOne({ _id: req.params.id })
        .then(deletedResult => {
            if (deletedResult.deletedCount === 0) { // Corrected check
                return res.status(404).send({ error: 'No Workout found to delete' });
            }

            return res.status(200).send({ message: 'Workout deleted successfully' });
        })
        .catch(err => {
            console.error("Error deleting workout:", err);
            return res.status(500).send({ error: 'Error deleting workout.' });
        });
};


module.exports.completeWorkoutStatus = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    Workout.findOne({ _id: id, userId })
        .then(workout => {
            if (!workout) {
                return res.status(404).send("Workout not found" );
            }

            if (workout.status === 'completed') {
                return res.status(400).send({ error: "Workout is already completed" });
            }

            workout.status = 'completed';

            workout.save()
                .then(updatedWorkout => res.status(200).send(updatedWorkout))
                .catch(err => res.status(500).send({ error: "Error in completing workout" }));
        })
        .catch(err => res.status(500).send({ error: err.message }));
};