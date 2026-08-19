import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovUsuarioDTO } from '../models/mov-usuario-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthMovimentacao {
  private apiUrl = 'http://localhost:8080/movimentacao'; 

  constructor(private http: HttpClient) {}

  listarMovimentacoes(): Observable<MovUsuarioDTO[]> {
    return this.http.get<MovUsuarioDTO[]>(`${this.apiUrl}/listAllMov`);
  }

  filtrarMovimentacoes(filtros: any): Observable<MovUsuarioDTO[]> {
    let params = new HttpParams();

    if (filtros.dataInicio) params = params.set('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params = params.set('dataFim', filtros.dataFim);
    if (filtros.acao) params = params.set('acao', filtros.acao);
    if (filtros.usuarioAfetado) params = params.set('usuarioAfetado', filtros.usuarioAfetado);
    if (filtros.responsavel) params = params.set('responsavel', filtros.responsavel);

    return this.http.get<MovUsuarioDTO[]>(`${this.apiUrl}/filtrar`, { params });
  }
}