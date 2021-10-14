import express from 'express';
import dotenv from 'dotenv';
import { connect } from './database.js';
import User from './models/user.js';

// Create express server
const app = express();
app.use(express.json());

// Middleware to log requests, it needs the next because it always happens (in contrast to the specific endpoints)
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.path}`);
    next();
})

// Load configuration
dotenv.config();
// console.log(process.env.PORT); // to check if dotenv is working
await connect();

// Add routes / endpoints

app.post('/users', async (req, res, next) => {
    console.log(req.body) // gets undefined, if you do not enable app.get(express.json()) !!!
    try {
        const user = await User.create(req.body);
        res.status(201);
        res.json(user);
    } catch (error) {
        error.status = 400;
        next(error);
    }
    
})

app.get('/users', async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        error.status = 400;
        next(error);
    }
})

app.delete('/users', async (req, res, next) => {
    try {
        const report = await User.deleteMany({});
        console.log(report);
        res.json({ success: true });
    } catch (error) {
        error.status = 400;
        next(error);
    }
})

app.get('/users/:id', async (req, res, next) => {
    try {
        const query = User.findOne({_id: req.params.id });
        query.select("-password"); // select all fields except password
        query.populate("following", ["_id", "username", "thought"]); // query following, get all the fields in the array

        const user = await query.exec();
        res.json(user);
    } catch (error) {
        error.status = 400;
        next(error);
    }
})

// Make user2 follow user1 and add user1 to the followers of user2
app.post('/users/:id/follow/:followId', async (req, res, next) => {
    try {
        const user1 = await User.findById(req.params.id);
        const user2 = await User.findById(req.params.followId);

        user1.follows.push(user2);
        user2.followers.push(user1);
        await user1.save();
        await user2.save();

        res.json(user1);
        res.json(user2);
    } catch (error) {
        error.status = 400;
        next(error);
    }
})

// Update a user 
app.patch('/users/:id', async (req, res, next) => {
    try {
        const options = {
            new: true,
            runValidators: true
        }
        const user = await User.findByIdAndUpdate(req.params.id, req.body, options);
        res.json(user);
    } catch (error) {
        error.status = 400;
        next(error);
    }
})

app.delete('/users/:id', async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, deleted: user });
    } catch (error) {
        error.status = 400;
        next(error);
    }
})

// Add custom 404 handler // backend should be consistent and repond with a json, even for unknown requests
app.use((req, res) => {
    res.status(404);
    res.json({ success: false, error: "Not found" });
})

// Global error handler

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ status: "Error", message: err.message} );
});

// Start express server listening
app.listen(process.env.PORT, () => {
    console.log("App started listening to requests at http://localhost:" + process.env.PORT);
})