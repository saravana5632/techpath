import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String },
  industry: { type: String },
  description: { type: String },
  roles: [{
    title: String,
    type: String, // Intern, Full-Time
    requirements: String,
    deadline: Date,
    status: { type: String, default: 'Open' } // Open, Closed
  }],
}, { timestamps: true });

const Company = mongoose.models.Company || mongoose.model('Company', companySchema);
export default Company;
