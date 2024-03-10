import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const familySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: false },
    phone: { type: String, required: true },
    relationship: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: String, required: true },
    retreatRegistration: {
        type: Schema.Types.ObjectId,
        ref: 'RetreatRegistration',
        required: true
      },
  },
  {
    timestamps: true,
  }
);

const Family = mongoose.model('Family', familySchema);
export default Family;
