import { Request, Response } from 'express';
import { Category } from '../../models/Category';

export async function listCategories(request: Request, response: Response) {
  try {
    const categories = await Category.find();

    return response.status(200).json(categories);
  } catch {
    return response.sendStatus(500);
  }
}
