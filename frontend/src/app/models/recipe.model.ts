export interface Recipe {
  id?: number;
  title: string;
  ingredients: string;
  steps: string;
  utensils?: string;
  imageUrl?: string;
  duration?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
