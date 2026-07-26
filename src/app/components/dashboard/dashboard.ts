import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Sidebar } from "../sidebar/sidebar";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  //usado para mudar de tela sem recarregar
  constructor(private router: Router) {}

  //metodo para sair do sistema
  fazerLogout(): void {
    console.log('Usuario saiu do sistema');
    //metodo para mandar o usuario de volta pro login
    this.router.navigate(['']);
  }
}
