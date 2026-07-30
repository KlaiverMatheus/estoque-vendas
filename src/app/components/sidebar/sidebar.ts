import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  // Variável que controla se a barra lateral está encolhida ou aberta
  estaRecolhida: boolean = false;

  constructor(private router: Router) {}

  // Alterna o estado da sidebar (recolher/expandir)
  alternarSidebar(): void {
    this.estaRecolhida = !this.estaRecolhida;
  }

  // metodo de logout 
  fazerLogout(): void {
    console.log('Usuário deslogado do sistema');
    this.router.navigate(['']);
  }
}