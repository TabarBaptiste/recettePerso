import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { AccessCodeService } from '../../services/access-code.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  searchTerm = '';
  loading = false;
  error = '';

  constructor(
    private recipeService: RecipeService,
    public accessCodeService: AccessCodeService
  ) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.loading = true;
    this.error = '';
    
    this.recipeService.getAllRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.filteredRecipes = recipes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
        this.error = 'Erreur lors du chargement des recettes';
        this.loading = false;
      }
    });
  }

  filterRecipes(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredRecipes = this.recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(term) ||
      recipe.ingredients.toLowerCase().includes(term)
    );
  }

  getImageUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // For local images, prepend the backend base URL (without /api)
    const baseUrl = this.recipeService['apiUrl'].replace('/api/recipes', '');
    return `${baseUrl}${url}`;
  }

  deleteRecipe(id: number | undefined, event: Event): void {
    event.stopPropagation();
    
    if (!id) return;
    
    if (!this.accessCodeService.isAuthenticated()) {
      alert('Vous devez être connecté pour supprimer une recette');
      return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
      this.recipeService.deleteRecipe(id).subscribe({
        next: () => {
          this.loadRecipes();
        },
        error: (error) => {
          console.error('Error deleting recipe:', error);
          alert('Erreur lors de la suppression de la recette');
        }
      });
    }
  }
}
