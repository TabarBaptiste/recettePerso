import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccessCodeService } from '../../services/access-code.service';
import { AccessCodeModalComponent } from '../access-code-modal/access-code-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, AccessCodeModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  showCodeModal = false;

  constructor(public accessCodeService: AccessCodeService) {}

  openCodeModal(): void {
    this.showCodeModal = true;
  }

  closeCodeModal(): void {
    this.showCodeModal = false;
  }

  logout(): void {
    this.accessCodeService.clearAccessCode();
  }

  onCodeSubmitted(): void {
    this.closeCodeModal();
  }
}
