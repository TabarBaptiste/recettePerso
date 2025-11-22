import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { AccessCodeService } from '../../services/access-code.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    public accessCodeService: AccessCodeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRecipe(parseInt(id));
    }
  }

  loadRecipe(id: number): void {
    this.loading = true;
    this.error = '';
    
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

  deleteRecipe(): void {
    if (!this.recipe?.id) return;
    
    if (!this.accessCodeService.isAuthenticated()) {
      alert('Vous devez être connecté pour supprimer une recette');
      return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
      this.recipeService.deleteRecipe(this.recipe.id).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error deleting recipe:', error);
          alert('Erreur lors de la suppression de la recette');
        }
      });
    }
  }

  getImageUrl(url: string): string {
    return this.recipeService.getImageUrl(url);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
