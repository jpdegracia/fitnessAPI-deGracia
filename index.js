const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

//Routes Middleware
const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");

const port = 4000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors());

//MongoDB database
mongoose.connect("mongodb+srv://admin:admin123@wdc028-course-booking.6ldv2.mongodb.net/fitness-App?retryWrites=true&w=majority");

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);


if(require.main === module){
    app.listen(process.env.PORT || 4000, () => {
        console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
    });
}

module.exports = {app,mongoose};
