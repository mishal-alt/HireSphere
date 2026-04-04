import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../Backend/.env') });

const InterviewSchema = new mongoose.Schema({}, { strict: false });
const Interview = mongoose.model('Interview', InterviewSchema);

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log("Connected to DB");

        const interview = await Interview.findOne({ status: 'Evaluated' }).sort({ updatedAt: -1 });
        if (interview) {
            console.log("Found Evaluated Interview:", JSON.stringify(interview, null, 2));
        } else {
            console.log("No evaluated interviews found.");
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkData();
