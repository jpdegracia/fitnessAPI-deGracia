const Workout = require("../models/Workout");

const addWorkout = async (req, res) => {
  try {
    const { name, duration, status } = req.body;
    const newWorkout = new Workout({ userId: req.user.userId, name, duration, status });
    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWorkoutsDetails = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.userId });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateWorkout = async (req, res) => {
  try {
    const { name, duration, status } = req.body;
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { name, duration, status },
      { new: true }
    );
    if (!workout) return res.status(404).json({ error: "Workout not found" });
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!workout) return res.status(404).json({ error: "Workout not found" });
    res.json({ message: "Workout deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addWorkout, getWorkoutsDetails, updateWorkout, deleteWorkout };
