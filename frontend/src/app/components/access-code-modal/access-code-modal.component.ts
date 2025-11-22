import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccessCodeService } from '../../services/access-code.service';

@Component({
  selector: 'app-access-code-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './access-code-modal.component.html',
  styleUrls: ['./access-code-modal.component.css']
})
export class AccessCodeModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() codeSubmitted = new EventEmitter<void>();

  code = '';
  error = '';

  constructor(private accessCodeService: AccessCodeService) {}

  submitCode(): void {
    this.accessCodeService.setAccessCode(this.code);
    
    if (this.accessCodeService.isAuthenticated()) {
      this.codeSubmitted.emit();
      this.close.emit();
    } else {
      this.error = 'Code d\'accès incorrect';
      this.code = '';
    }
  }

  closeModal(): void {
    this.close.emit();
  }
}
