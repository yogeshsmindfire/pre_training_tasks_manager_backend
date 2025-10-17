import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
   name: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
   return bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("users", userSchema);
export default userModel;
