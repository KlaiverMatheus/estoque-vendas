import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthCadastroProduto } from '../../services/auth-cadastro-produto';
import { GerenciadorProduto } from '../gerenciador-produto/gerenciador-produto';


@Component({
  selector: 'app-cadastro-produto',
  imports: [FormsModule, CommonModule, GerenciadorProduto],
  templateUrl: './cadastro-produto.html',
  styleUrl: './cadastro-produto.css',
})
export class CadastroProduto {

  abaAtiva: 'cadastrar' | 'atualizar' = 'cadastrar';

  nomeDigitado: string = '';
  marcaDigitada: string = '';
  codBarraDigitada: string = '';
  quantidadeDigitada: number = 0;
  precoCustoDigitado: number = 0;
  precoVendaDigitado: number = 0;

  carregando: boolean = false;

    //funcao para mudar as abas
  alternarAba(aba: 'cadastrar' | 'atualizar'): void {
    this.abaAtiva = aba;
  }

  constructor(private cadastroProdutoService: AuthCadastroProduto, private router: Router, private cdr: ChangeDetectorRef) {}

  executarCadastroProduto(): void {
    if (this.carregando) {
      return;
    }
    this.carregando = true;
    console.log('Tentando cadastrar produto...')

    const usuarioAtual = localStorage.getItem('usuarioLogado') || 'Sistema';

    this.cadastroProdutoService.cadastroProduto(this.nomeDigitado, this.marcaDigitada, this.codBarraDigitada, this.quantidadeDigitada, this.precoCustoDigitado, this.precoVendaDigitado, usuarioAtual).subscribe({

      next: (resposta) => {
        console.log('Produto cadastrado com sucesso', resposta)
        setTimeout(() => {
          this.carregando = false;
          this.cdr.detectChanges();
        }, 50)
        setTimeout(() => {
          alert('Cadastro realizado com sucesso')
        }, 50)
      },
      error: (error) => {
        setTimeout(() => {
          console.log('Erro ao tentar cadastrar produto', error);
          this.carregando = false;
          this.cdr.detectChanges();
        }, 50)
        setTimeout(() => {
          alert('Cadastro do produto não foi possivel')
        }, 50)
      }
    })
  }
}
