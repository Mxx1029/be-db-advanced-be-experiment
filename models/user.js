import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    thought: String,
    followers: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'thinkers' 
    }],
    follows: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'thinkers' 
    }]
});

const User = mongoose.model("thinkers", userSchema);

export default User;