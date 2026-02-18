import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  // Demonstrating fragment (hash) navigation
  fragment: string | null = null;

  constructor(private route: ActivatedRoute) {
    // Subscribe to fragment changes
    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment;
      if (fragment) {
        // Scroll to the element with the matching id
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    });
  }
}
