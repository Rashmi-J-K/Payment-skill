import express from "express";
import mongoose from "mongoose";

const app = express();

app.use(express.json());

const port = 3000;

const mongoURI = "mongodb://localhost:27017"; 

mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'mongoose connection error'));

db.once('open', () => {
    console.log('connected to mongodb');
});

// Define schema for payment data
const paymentSchema = new mongoose.Schema({
    invoiceId: String,
    userInfo: Object,
    paymentDetails: Object
});

const Payment = mongoose.model('Payment', paymentSchema);

// Route to process payments and store payment details
app.post('/api/payment/process', async (req, res) => {
    try {
        // Extract necessary data from the request body
        const { invoiceId, userInfo, paymentDetails } = req.body;
        
        // Create a new payment document
        const newPayment = new Payment({ invoiceId, userInfo, paymentDetails });

        // Save the payment document to the database
        const savedPayment = await newPayment.save();

        res.send(savedPayment);
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to retrieve all payments
app.get('/api/payment/all', async (req, res) => {
    try {
        // Fetch all payment documents from the database
        const payments = await Payment.find();
        res.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log('Server is running on port', port);
});
