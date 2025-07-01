import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {  // added comma here to fix the error
            type: String,
            required: true,
        },
        avatar:{
            type: String,
            default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          },

    },
    { timestamps: true }
);

const Updated_User = mongoose.model("Updated_User", userSchema);
export default Updated_User;
