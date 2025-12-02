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

  formatListWithDashes(text: string): string {
    if (!text) return '';
    
    const lines = text.split(/\r?\n/);
    const formattedLines = lines.map(line => {
      const trimmed = line.trim();
      
      // Si la ligne est vide, la garder telle quelle
      if (!trimmed) return line;
      
      // Si la ligne se termine par ":" (comme "Farce :"), ne pas ajouter de tiret
      if (trimmed.endsWith(':')) return line;
      
      // Si la ligne commence déjà par un tiret, la garder telle quelle
      if (trimmed.startsWith('-')) return line;
      
      // Déterminer l'indentation de la ligne originale
      const indent = line.match(/^\s*/)?.[0] || '';
      
      // Ajouter un tiret au début
      return `${indent}- ${trimmed}`;
    });
    
    return formattedLines.join('\n');
  }

  formatStepsWithNumbers(text: string): string {
    if (!text) return '';
    
    // Séparer en lignes
    const lines = text.split(/\r?\n/);
    const formattedLines: string[] = [];
    
    let stepNumber = 1;
    let isAfterColon = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Si la ligne est vide, réinitialiser le contexte "après deux-points" et ajouter un espacement
      if (!trimmed) {
        isAfterColon = false;
        formattedLines.push('');
        continue;
      }
      
      // Si la ligne se termine par ":", c'est un titre de section
      if (trimmed.endsWith(':')) {
        isAfterColon = true;
        // Numéroter la ligne de titre
        if (!/^\d+\./.test(trimmed)) {
          formattedLines.push(`${stepNumber}. ${trimmed}`);
          stepNumber++;
        } else {
          formattedLines.push(trimmed);
        }
        continue;
      }
      
      // Si on est après une ligne avec ":", ajouter une tabulation
      if (isAfterColon) {
        formattedLines.push(`    ${trimmed}`);
        continue;
      }
      
      // Si la ligne commence déjà par un nombre suivi d'un point, la garder telle quelle
      if (/^\d+\./.test(trimmed)) {
        formattedLines.push(trimmed);
        continue;
      }
      
      // Ajouter le numéro d'étape
      formattedLines.push(`${stepNumber}. ${trimmed}`);
      stepNumber++;
    }
    
    return formattedLines.join('\n');
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
