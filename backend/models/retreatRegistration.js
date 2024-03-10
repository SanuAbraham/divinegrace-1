import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const retreatRegistration = new mongoose.Schema(
  {
    numberOfFamilyMembers: {type: Number},
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'InProgress'],
        default: 'Pending'
      },
    amount: { type: Number, required: false },
    isApproved: { type: Boolean, required: false },
    registrationDate: { type: Date, required: false },
    paidDate: { type: Date, required: false },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },

  },
  {
    timestamps: true,
  }
);

const RetreatRegistration = mongoose.model('RetreatRegistration', retreatRegistration);
export default RetreatRegistration;
