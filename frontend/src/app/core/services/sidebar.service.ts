import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  collapsed = signal<boolean>(false);
  mobileOpen = signal<boolean>(false);
  isMobile = signal<boolean>(false);

  constructor() {
    this.checkMobile();
    // Use window.addEventListener to check for mobile state on resize
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.checkMobile());
    }
  }

  private checkMobile() {
    if (typeof window !== 'undefined') {
      this.isMobile.set(window.innerWidth < 1024);
      if (!this.isMobile()) {
        this.mobileOpen.set(false);
      }
    }
  }

  toggle() {
    this.collapsed.update(v => !v);
  }

  toggleMobile() {
    this.mobileOpen.update(v => !v);
  }

  setCollapsed(value: boolean) {
    this.collapsed.set(value);
  }

  setMobileOpen(value: boolean) {
    this.mobileOpen.set(value);
  }
}
