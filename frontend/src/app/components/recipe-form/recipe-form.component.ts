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
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  removeExistingImage = false;

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

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'L\'image ne doit pas dépasser 5MB';
        return;
      }
      
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
        this.error = 'Format d\'image non supporté. Utilisez JPG, PNG, GIF ou WebP';
        return;
      }
      
      this.selectedFile = file;
      this.error = '';
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  clearImageSelection(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    const input = document.getElementById('image') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  removeImage(): void {
    this.removeExistingImage = true;
    this.recipe.imageUrl = '';
  }

  getImageUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // For local images, prepend the backend base URL (without /api)
    const baseUrl = this.recipeService['apiUrl'].replace('/api/recipes', '');
    return `${baseUrl}${url}`;
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

    const formData = new FormData();
    formData.append('title', this.recipe.title);
    formData.append('ingredients', this.recipe.ingredients);
    formData.append('steps', this.recipe.steps);
    
    if (this.recipe.duration) {
      formData.append('duration', this.recipe.duration.toString());
    }
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    
    if (this.removeExistingImage) {
      formData.append('keepExistingImage', 'false');
    }

    const operation = this.isEditMode && this.recipeId
      ? this.recipeService.updateRecipe(this.recipeId, formData)
      : this.recipeService.createRecipe(formData);

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
