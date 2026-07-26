import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSelectDTO } from '../models/user-select.dto';



@Injectable({
  providedIn: 'root',
})
export class AuthGerenciadorUsuario {
  private apiUrl = 'http://localhost:8080/usuario/gerenciador'

  constructor(private http: HttpClient) {}

  // metodo para buscar a lista de usuarios para a tabela
  listarUsuarios(): Observable<UserSelectDTO[]> {
    return this.http.get<UserSelectDTO[]>(this.apiUrl);
  }

  // metodo para inatviar
  inativarUsuario(userId: string, usuarioLogado: string): Observable<any> {
  const headers = new HttpHeaders({
    'X-Usuario-Logado': usuarioLogado
  });

  // Envia a requisiçao para inativar
  return this.http.patch<any>(`${this.apiUrl}/${userId}/inativar`, {}, { headers: headers });
  }


  AuthGerenciadorUsuario(userId: string, nome: string, senha: string, email: any, telefone: string, userCargo: string, usuarioLogado: string): Observable<any> {
    const dadosAuthGerenciadorUsuario = {
      userId: userId,
      nome: nome,
      senha: senha,
      email: email,
      telefone: telefone,
      userCargo: userCargo
    };
    
        const headers = new HttpHeaders({
        'X-Usuario-Logado': usuarioLogado
      });

      return this.http.post<any>(this.apiUrl, dadosAuthGerenciadorUsuario, { headers: headers });
  }
}
