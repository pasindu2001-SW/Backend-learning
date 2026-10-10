import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,     // remove whitespace from both ends of a string
        minlength: 3,
        maxlength: 20,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,     // remove whitespace from both ends of a string
    }
},

    {timestamps: true}

);

//before saving the user we need to hash the password
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10); //hash the password with a salt round of 10
});

//method to compare the password
userSchema.methods.comparePassword = async function (password) {
    // If the stored password was hashed with bcrypt
    if (this.password.startsWith("$2a$") || this.password.startsWith("$2b$") || this.password.startsWith("$2y$")) {
        return await bcrypt.compare(password, this.password);
    }
    // Fallback for plain-text passwords (e.g. users registered before hashing was enabled)
    return password === this.password;
};

export const User = mongoose.model("User", userSchema);