import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [], // Remova a Sidebar daqui, pois ela já está no app.html global!
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(private router: Router) {}

  fazerLogout(): void {
    this.router.navigate(['']);
  }
}