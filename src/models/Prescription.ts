import mongoose, { Document, Schema } from 'mongoose';
import { AnalysisResult } from '../types';

export interface IPrescription extends Document {
  userId: mongoose.Types.ObjectId;
  image: string; // Base64 encoded image or file path
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  allergies: string;
  age: string;
  conditions: string;
  isPregnant: boolean;
  isBreastfeeding: boolean;
  analysisResult: any; // Using any for now as AnalysisResult might need to be converted to a schema
  createdAt: Date;
}

const PrescriptionSchema: Schema = new Schema({
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

export default mongoose.model<IPrescription>('Prescription', PrescriptionSchema);