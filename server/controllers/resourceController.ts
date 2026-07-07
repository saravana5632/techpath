import { Request, Response } from 'express';
import Resource from '../models/Resource';

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
export const getResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const resources = await (Resource as any).find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a resource
// @route   POST /api/resources
// @access  Private/Admin
export const createResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const resource = new Resource(req.body);
    const createdResource = await resource.save();
    res.status(201).json(createdResource);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Private/Admin
export const updateResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const resource = await (Resource as any).findByIdAndUpdate(req.params.id as any, req.body, { new: true });
    if (resource) {
      res.json(resource);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private/Admin
export const deleteResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const resource = await (Resource as any).findById(req.params.id as any);
    if (resource) {
      await (Resource as any).deleteOne({ _id: resource._id });
      res.json({ message: 'Resource removed' });
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
