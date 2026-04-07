import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses()">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class CardComponent {
  @Input() className: string = '';

  cardClasses = computed(() => {
    return cn("rounded-xl border bg-card text-card-foreground shadow", this.className);
  });
}

@Component({
  selector: 'app-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="headerClasses()">
      <ng-content></ng-content>
    </div>
  `
})
export class CardHeaderComponent {
  @Input() className: string = '';
  headerClasses() { return cn("flex flex-col space-y-1.5 p-6", this.className); }
}

@Component({
  selector: 'app-card-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3 [class]="titleClasses()">
      <ng-content></ng-content>
    </h3>
  `
})
export class CardTitleComponent {
  @Input() className: string = '';
  titleClasses() { return cn("font-display font-bold leading-none tracking-tight", this.className); }
}

@Component({
  selector: 'app-card-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p [class]="descriptionClasses()">
      <ng-content></ng-content>
    </p>
  `
})
export class CardDescriptionComponent {
  @Input() className: string = '';
  descriptionClasses() { return cn("text-sm text-muted-foreground", this.className); }
}

@Component({
  selector: 'app-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="contentClasses()">
      <ng-content></ng-content>
    </div>
  `
})
export class CardContentComponent {
  @Input() className: string = '';
  contentClasses() { return cn("p-6 pt-0", this.className); }
}

@Component({
  selector: 'app-card-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="footerClasses()">
      <ng-content></ng-content>
    </div>
  `
})
export class CardFooterComponent {
  @Input() className: string = '';
  footerClasses() { return cn("flex items-center p-6 pt-0", this.className); }
}
