import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { cadastroUsuario } from "../../services/cadastro-usuario";
import { CommonModule } from '@angular/common'; // importante para liberar recursos de controle de fluxo
import { GerenciadorUsuario } from '../gerenciador-usuario/gerenciador-usuario'; // atualiza usuario
import { NgxMaskDirective } from 'ngx-mask'; // para deixar o telefone melhor

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule, GerenciadorUsuario, NgxMaskDirective],
  templateUrl: './cadastro-usuario.html',
  styleUrl: './cadastro-usuario.css',
})
export class CadastroUsuario {
  // aba que inicia
  abaAtiva: 'cadastrar' | 'atualizar' = 'cadastrar';

  nomeDigitado: string = '';
  senhaDigitada: string = '';
  emailDigitado: string = '';
  telefoneDigitado: string = '';
  cargoDigitado: string = '';

  carregando: boolean = false;

  //funcao para mudar as abas
  alternarAba(aba: 'cadastrar' | 'atualizar'): void {
    this.abaAtiva = aba;
  }

  constructor(private cadastroUsuarioService: cadastroUsuario, private router: Router, private cdr: ChangeDetectorRef) {}

  executarCadastroUsuario(): void {
    if (this.carregando) {
      return;
    }
    this.carregando = true;
    console.log('Tentando realizar o cadastro...')

    const usuarioAtual = localStorage.getItem('usuarioLogado') || 'Sistema'; //LINHA ALTERADA ATUALIZADO


    this.cadastroUsuarioService.cadastroUsuario(this.nomeDigitado, this.senhaDigitada, this.emailDigitado, this.telefoneDigitado, this.cargoDigitado,usuarioAtual).subscribe({

      next: (resposta) => {
        console.log('Cadastro realizado com sucesso', resposta)
        setTimeout(() => {
          this.carregando = false;
          this.cdr.detectChanges();
        }, 50)
        setTimeout(() => {
          alert('Cadastro realizado com sucesso')
        }, 50)
      },
      error: (erro) => {
        setTimeout(() => {
          console.log('Erro ao tentar realizar cadastrar', erro)  
          this.carregando = false;
          this.cdr.detectChanges();
        },50)
        setTimeout(() => {
          alert('Cadastro nao foi possivel');
        },50)
      }
    })
  }
}
