import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-page-main-part',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-page-main-part.component.html',
  styleUrls: ['./user-page-main-part.component.scss']
})
export class UserPageMainPartComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() imageUrl?: string;
  @Input() buttonText!: string;
  @Output() clicked = new EventEmitter<void>();
  @Input() isSelected: boolean = false;
}
