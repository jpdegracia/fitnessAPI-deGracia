const express = require("express");
const workoutController = require("../controllers/workout.js");
const {verify} = require("../auth");

const router = express.Router();


router.post('/addWorkout', verify, workoutController.addWorkout);
router.get('/:id/getMyWorkouts', verify, workoutController.getWorkoutsDetails);
router.put('/:id/updateWorkout', verify, workoutController.updateWorkout);
router.delete('/:id/deleteWorkout', verify, workoutController.deleteWorkout);



module.exports = router;