import { Component, Input, forwardRef, Injector, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative">
      <input
        [type]="type"
        [placeholder]="placeholder"
        [class]="inputClasses()"
        [disabled]="disabled"
        [(ngModel)]="value"
        (input)="onInput($event)"
        (blur)="onBlur()"
      />
      @if (showError()) {
        <p class="text-xs text-destructive mt-1.5 flex items-center gap-1">
          <span>•</span>
          <span>{{ errorMessage() }}</span>
        </p>
      }
    </div>
  `,
  styles: []
})
export class InputComponent implements ControlValueAccessor, AfterViewInit {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() className: string = '';
  @Input() disabled: boolean = false;
  @Input() errorMessage: () => string = () => 'This field is required';

  value: string = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  private injector = inject(Injector);
  private _ngControl: NgControl | null = null;

  ngAfterViewInit(): void {
    try {
      const ngControl = this.injector.get(NgControl, null);
      if (ngControl) {
        this._ngControl = ngControl;
      }
    } catch {}
  }

  showError(): boolean {
    return !!this._ngControl?.invalid && (!!this._ngControl?.touched || !!this._ngControl?.dirty);
  }

  inputClasses() {
    const hasError = this.showError();
    return cn(
      "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      hasError
        ? "border-destructive focus-visible:ring-destructive"
        : "border-input focus-visible:ring-ring",
      this.className
    );
  }

  onInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
