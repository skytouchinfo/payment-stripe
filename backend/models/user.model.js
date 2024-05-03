const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const uniqueValidator = require('mongoose-unique-validator')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is required!'],
        unique: '{VALUE} is already exists!'
    },
    password: {
        type: String,
        minlength: [5, 'password is two weak!'],
        required: [true, 'password is required!']
    },
    email: {
        type: String,
        required: [true, 'email is required!'],
        unique: '{VALUE} is already exists!'
    },
    customer_id: {
        type: String,
        required: [true, 'customer_id is required!'],
        unique: '{VALUE} is already exists!'
    }
}, {
    timestamps: true
});


userSchema.plugin(uniqueValidator);

userSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('username must be unique!'));
    } else {
        next(error);
    }
});


userSchema.pre('save', function (next) {
    const user = this
    const error = user.validateSync()
    if (!user.isModified("password")) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
})





const User = mongoose.model('User', userSchema)


module.exports = User;



