import mongoose from "mongoose";

const creditSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    totalPurchased: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    transactions: [{
        type: {
            type: String,
            enum: ['purchase', 'spend'],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        description: String,
        paymentId: String,
        thirdwebTransactionId: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const Credit = mongoose.model('Credit', creditSchema);

export default Credit;