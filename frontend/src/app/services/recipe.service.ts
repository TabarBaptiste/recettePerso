import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = environment.apiUrl + '/recipes';
  private recipesCache: Recipe[] | null = null;
  private cacheTimestamp: number = 0;
  private cacheDuration = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) { }

  getAllRecipes(): Observable<Recipe[]> {
    const now = Date.now();

    if (this.recipesCache && (now - this.cacheTimestamp) < this.cacheDuration) {
      return of(this.recipesCache);
    }

    return this.http.get<Recipe[]>(this.apiUrl).pipe(
      tap(recipes => {
        this.recipesCache = recipes;
        this.cacheTimestamp = now;
      })
    );
  }

  getRecipe(id: number): Observable<Recipe> {
    if (this.recipesCache) {
      const cached = this.recipesCache.find(r => r.id === id);
      if (cached) {
        return of(cached);
      }
    }
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  createRecipe(recipe: Recipe | FormData): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipe).pipe(
      tap(newRecipe => {
        if (this.recipesCache) {
          this.recipesCache = [newRecipe, ...this.recipesCache];
        }
      })
    );
  }

  updateRecipe(id: number, recipe: Recipe | FormData): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, recipe).pipe(
      tap(updatedRecipe => {
        if (this.recipesCache) {
          const index = this.recipesCache.findIndex(r => r.id === id);
          if (index !== -1) {
            this.recipesCache[index] = updatedRecipe;
          }
        }
      })
    );
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        if (this.recipesCache) {
          this.recipesCache = this.recipesCache.filter(r => r.id !== id);
        }
      })
    );
  }

  clearCache(): void {
    this.recipesCache = null;
    this.cacheTimestamp = 0;
  }
}
