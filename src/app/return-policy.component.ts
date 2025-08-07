import { Component } from '@angular/core';

@Component({
  selector: 'app-return-policy',
  standalone: true,
  template: `
    <h2>Return Policy</h2>
    <p>We do not accept returns or exchanges. All sales are final.</p>
  `,
  styles: [`
    h2 {
      margin-bottom: 16px;
    }
    p {
      font-size: 1.1rem;
      color: #b71c1c;
    }
  `]
})
export class ReturnPolicyComponent {}

