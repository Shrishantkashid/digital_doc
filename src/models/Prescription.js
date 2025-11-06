import mongoose from 'mongoose';

const PrescriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    required: true
  },
  medications: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true }
  }],
  allergies: {
    type: String,
    default: ''
  },
  age: {
    type: String,
    default: ''
  },
  conditions: {
    type: String,
    default: ''
  },
  isPregnant: {
    type: Boolean,
    default: false
  },
  isBreastfeeding: {
    type: Boolean,
    default: false
  },
  analysisResult: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Prescription', PrescriptionSchema);