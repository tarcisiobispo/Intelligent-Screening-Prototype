class NavigationHistory {
  private history: string[] = [];
  private currentIndex = -1;
  private recentTabs: Array<{path: string, title: string, timestamp: number}> = [];

  addToHistory(path: string, title: string) {
    // Remove future history if we're not at the end
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }
    
    this.history.push(path);
    this.currentIndex = this.history.length - 1;
    
    // Add to recent tabs
    this.recentTabs = this.recentTabs.filter(tab => tab.path !== path);
    this.recentTabs.unshift({ path, title, timestamp: Date.now() });
    this.recentTabs = this.recentTabs.slice(0, 10);
    
    // Save to localStorage
    localStorage.setItem('nav-history', JSON.stringify(this.history));
    localStorage.setItem('recent-tabs', JSON.stringify(this.recentTabs));
  }

  canGoBack() {
    return this.currentIndex > 0;
  }

  canGoForward() {
    return this.currentIndex < this.history.length - 1;
  }

  goBack() {
    if (this.canGoBack()) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }
    return null;
  }

  goForward() {
    if (this.canGoForward()) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
    return null;
  }

  getRecentTabs() {
    return this.recentTabs;
  }

  loadFromStorage() {
    try {
      const savedHistory = localStorage.getItem('nav-history');
      const savedTabs = localStorage.getItem('recent-tabs');
      
      if (savedHistory) {
        this.history = JSON.parse(savedHistory);
        this.currentIndex = this.history.length - 1;
      }
      
      if (savedTabs) {
        this.recentTabs = JSON.parse(savedTabs);
      }
    } catch (error) {
      console.warn('Failed to load navigation history');
    }
  }
}

export const navigationHistory = new NavigationHistory();