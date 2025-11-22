import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { AccessCodeService } from '../../services/access-code.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit {
  recipe: Recipe = {
    title: '',
    ingredients: '',
    steps: '',
    imageUrl: '',
    duration: undefined
  };
  
  isEditMode = false;
  recipeId?: number;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private accessCodeService: AccessCodeService
  ) {}

  ngOnInit(): void {
    if (!this.accessCodeService.isAuthenticated()) {
      alert('Vous devez être connecté pour accéder à cette page');
      this.router.navigate(['/']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.recipeId = parseInt(id);
      this.loadRecipe(this.recipeId);
    }
  }

  loadRecipe(id: number): void {
    this.loading = true;
    this.recipeService.getRecipe(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recipe:', error);
        this.error = 'Erreur lors du chargement de la recette';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.accessCodeService.isAuthenticated()) {
      alert('Vous devez être connecté pour effectuer cette action');
      return;
    }

    if (!this.recipe.title || !this.recipe.ingredients || !this.recipe.steps) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.loading = true;
    this.error = '';

    const recipeData = {
      ...this.recipe,
      duration: this.recipe.duration || undefined
    };

    const operation = this.isEditMode && this.recipeId
      ? this.recipeService.updateRecipe(this.recipeId, recipeData)
      : this.recipeService.createRecipe(recipeData);

    operation.subscribe({
      next: (recipe) => {
        this.loading = false;
        this.router.navigate(['/recipe', recipe.id]);
      },
      error: (error) => {
        console.error('Error saving recipe:', error);
        this.error = 'Erreur lors de l\'enregistrement de la recette';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    if (this.isEditMode && this.recipeId) {
      this.router.navigate(['/recipe', this.recipeId]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
