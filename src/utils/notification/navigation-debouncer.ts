export class NavigationDebouncer {
  private isNavigating = false;
  private lastNavigation = 0;
  private readonly DEBOUNCE_TIME = 2000;

  canNavigate(): boolean {
    const now = Date.now();
    if (this.isNavigating || now - this.lastNavigation < this.DEBOUNCE_TIME) {
      return false;
    }
    return true;
  }
  startNavigation(): void {
    this.isNavigating = true;
    this.lastNavigation = Date.now();
    setTimeout(() => {
      this.isNavigating = false;
    }, this.DEBOUNCE_TIME);
  }
}
