import { Request, Response } from 'express';
import { Category } from '../../models/Category';

export async function createCategory(request: Request, response: Response) {
  const { icon, name } = request.body;

  try {
    const category = await Category.create({ icon, name });

    response.status(201).json(category);
  } catch {
    response.sendStatus(500);
  }
}
