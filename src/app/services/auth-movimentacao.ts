import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovUsuarioDTO } from '../models/mov-usuario-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthMovimentacao {
  private apiUrl = 'http://localhost:8080/movimentacao'; // ajuste o endpoint base se necessário

  constructor(private http: HttpClient) {}

  // Método para buscar a lista de movimentações para a tabela
  listarMovimentacoes(): Observable<MovUsuarioDTO[]> {
    return this.http.get<MovUsuarioDTO[]>(`${this.apiUrl}/listAll`);
  }
}