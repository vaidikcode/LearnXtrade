import Credit from '../models/Credit.model.js';
import Student from '../models/Student.model.js';
import Course from '../models/Course.model.js';
import asyncHandler from '../utils/asyncHandler.js';

// Purchase credits using thirdweb payments
const purchaseCredits = asyncHandler(async (req, res) => {
    const { amount } = req.body; // amount in credits
    const userId = req.user.id;

    if (!amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid credit amount"
        });
    }

    try {
        // Create payment using thirdweb API
        const paymentResponse = await fetch('https://api.thirdweb.com/v1/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-secret-key': process.env.THIRDWEB_SECRET_KEY
            },
            body: JSON.stringify({
                name: `${amount} Learning Credits`,
                description: `Purchase ${amount} credits for LearnXtrade platform`,
                imageUrl: "https://via.placeholder.com/400x400?text=Credits",
                token: {
                    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", 
                    chainId: 11155111, 
                    amount: (amount * 0.00000261).toString()
                },
                recipient: process.env.PAYMENT_RECIPIENT_ADDRESS,
                purchaseData: {
                    userId,
                    type: 'credit_purchase',
                    creditAmount: amount
                }
            })
        });

        if (!paymentResponse.ok) {
            const errorData = await paymentResponse.json();
            throw new Error(`Payment creation failed: ${errorData.message || 'Unknown error'}`);
        }

        const payment = await paymentResponse.json();

        res.status(201).json({
            success: true,
            data: {
                paymentId: payment.result.id,
                paymentLink: payment.result.link,
                amount,
                priceInETH: (amount * 0.00000261).toString()
            },
            message: "Payment created successfully. Complete payment to receive credits."
        });
    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to create payment",
            error: error.message
        });
    }
});

// Complete credit purchase (webhook or manual completion)
const completeCreditPurchase = asyncHandler(async (req, res) => {
    const { paymentId, userId, creditAmount } = req.body;

    if (!paymentId || !userId || !creditAmount) {
        return res.status(400).json({
            success: false,
            message: "Payment ID, user ID, and credit amount are required"
        });
    }

    try {
        // Update both the Student model's credits field AND the Credit transaction model
        const student = await Student.findById(userId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Update student's credits
        student.credits += creditAmount;
        await student.save();

        // Find or create detailed credit record for transaction history
        let creditRecord = await Credit.findOne({ userId });
        
        if (!creditRecord) {
            creditRecord = new Credit({
                userId,
                amount: creditAmount,
                totalPurchased: creditAmount,
                transactions: [{
                    type: 'purchase',
                    amount: creditAmount,
                    description: `Purchased ${creditAmount} credits`,
                    paymentId: paymentId,
                    timestamp: new Date()
                }]
            });
        } else {
            creditRecord.amount += creditAmount;
            creditRecord.totalPurchased += creditAmount;
            creditRecord.transactions.push({
                type: 'purchase',
                amount: creditAmount,
                description: `Purchased ${creditAmount} credits`,
                paymentId: paymentId,
                timestamp: new Date()
            });
        }

        await creditRecord.save();

        res.status(200).json({
            success: true,
            data: {
                creditsPurchased: creditAmount,
                totalCredits: student.credits
            },
            message: "Credits purchased successfully"
        });
    } catch (error) {
        console.error('Credit purchase completion error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to complete credit purchase"
        });
    }
});

// Purchase course with credits
const purchaseCourseWithCredits = asyncHandler(async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({
            success: false,
            message: "Course not found"
        });
    }

    // Check if course has credit price
    if (!course.creditPrice || course.creditPrice <= 0) {
        return res.status(400).json({
            success: false,
            message: "Course is not available for credit purchase"
        });
    }

    // Find student
    const student = await Student.findById(userId);
    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }

    // Check if student has sufficient credits
    if (student.credits < course.creditPrice) {
        return res.status(400).json({
            success: false,
            message: "Insufficient credits",
            required: course.creditPrice,
            available: student.credits
        });
    }

    // Check if user already purchased the course
    const alreadyEnrolled = student.courses.some(
        enrollment => enrollment.courseId.toString() === courseId
    );
    
    if (alreadyEnrolled) {
        return res.status(400).json({
            success: false,
            message: "Already enrolled in this course"
        });
    }

    // Deduct credits from student
    student.credits -= course.creditPrice;

    // Enroll student in course
    student.courses.push({
        courseId: courseId,
        grade: null
    });

    await student.save();

    // Update credit transaction history
    let creditRecord = await Credit.findOne({ userId });
    if (creditRecord) {
        creditRecord.amount -= course.creditPrice;
        creditRecord.totalSpent += course.creditPrice;
        creditRecord.transactions.push({
            type: 'spend',
            amount: course.creditPrice,
            description: `Purchased course: ${course.title}`,
            timestamp: new Date()
        });
        await creditRecord.save();
    }

    res.status(200).json({
        success: true,
        data: {
            courseId,
            courseTitle: course.title,
            creditsSpent: course.creditPrice,
            remainingCredits: student.credits
        },
        message: "Course purchased successfully with credits"
    });
});

// Get user's credit balance
const getCreditBalance = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const student = await Student.findById(userId);
    const creditRecord = await Credit.findOne({ userId });

    res.status(200).json({
        success: true,
        data: {
            balance: student ? student.credits : 0,
            totalPurchased: creditRecord ? creditRecord.totalPurchased : 0,
            totalSpent: creditRecord ? creditRecord.totalSpent : 0
        }
    });
});

export {
    purchaseCredits,
    completeCreditPurchase,
    purchaseCourseWithCredits,
    getCreditBalance
};