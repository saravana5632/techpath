import { Request, Response } from 'express';
import Company from '../models/Company';

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
export const getCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const companies = await (Company as any).find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a company
// @route   POST /api/companies
// @access  Private/Admin
export const createCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const company = new Company(req.body);
    const createdCompany = await company.save();
    res.status(201).json(createdCompany);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a company
// @route   PUT /api/companies/:id
// @access  Private/Admin
export const updateCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const company = await (Company as any).findByIdAndUpdate(req.params.id as any, req.body, { new: true });
    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a company
// @route   DELETE /api/companies/:id
// @access  Private/Admin
export const deleteCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const company = await (Company as any).findById(req.params.id as any);
    if (company) {
      await (Company as any).deleteOne({ _id: company._id });
      res.json({ message: 'Company removed' });
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
