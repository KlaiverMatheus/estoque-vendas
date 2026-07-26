import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  //necessario para importar
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  imports: [RouterLink, RouterOutlet, FormsModule],
})
export class Sidebar {}
