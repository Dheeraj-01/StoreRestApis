import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    username: { type: String, required: true, unique: true },
    token: { type: String, required: true }
}, { timestamps: false });

export default mongoose.model('Token', tokenSchema, 'tokens');