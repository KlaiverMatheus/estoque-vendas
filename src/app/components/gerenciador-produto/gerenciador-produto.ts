import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectAllProdDTO } from '../../models/select-all-prod-dto';
import { AuthGerenciadorProduto } from '../../services/auth-gerenciador-produto';
import { Router } from '@angular/router';


@Component({
  selector: 'app-gerenciador-produto',
  imports: [FormsModule, CommonModule],
  templateUrl: './gerenciador-produto.html',
  styleUrl: './gerenciador-produto.css',
})
export class GerenciadorProduto implements OnInit{
  prodIdSelecionado: string = '';
  nomeDigitado: string = '';
  marcaDigitada: string = '';
  codBarraDigitada: string = '';
  quantidadeDigitada: number = 0;
  precoCustoDigitado: number = 0;
  precoVendaDigitado: number = 0;

  carregando: boolean = false;

  listaProdutos: SelectAllProdDTO[] = [];

  constructor(private AuthGerenciadorProdutoService: AuthGerenciadorProduto, private router: Router, private cdr: ChangeDetectorRef) {}

    // Verifica se pode salvar: precisa ter um usuário selecionado
  // e os campos obrigatórios preenchidos
  get podeSalvar(): boolean {
    return (
      !!this.prodIdSelecionado &&
      this.nomeDigitado.trim().length > 0 &&
      this.marcaDigitada.trim().length > 0 &&
      this.quantidadeDigitada != null &&
      this.precoCustoDigitado != null &&
      this.precoVendaDigitado != null
    );
  }

    // metodo para carrregar sempre que a tela atulizar
  ngOnInit(): void {
    this.carregarListaProdutos();
  }

  carregarListaProdutos(): void {

    this.AuthGerenciadorProdutoService.listarProdutos().subscribe({
      next: (dados) => {
        this.listaProdutos = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro ao buscar produtos', erro)
    });
  }

  // Efeito de subir os dados para o formulario ao clicar na lista
  selecionarProduto(produto: SelectAllProdDTO): void {
    this.prodIdSelecionado = produto.prodId;
    this.nomeDigitado = produto.nome;
    this.marcaDigitada = produto.marca;
    this.codBarraDigitada = produto.codBarra || '';
    this.quantidadeDigitada = produto.quantidade;
    this.precoCustoDigitado = produto.precoCusto;
    this.precoVendaDigitado = produto.precoVenda;

    console.log('Produto selecionado para ediçao:', produto);
  }

  inativarProduto(produto: SelectAllProdDTO, event: Event): void {

    // impede duplo clique
    event.stopPropagation();

    const confirmacao = confirm(`Tem certeza que deseja inativar o produto ${produto.nome}?`);

    if (!confirmacao) {
      return;
    }

    console.log('Inativando produto ID:', produto.prodId);

    const usuarioAtual = localStorage.getItem('usuarioLogado') || 'Sistema';
    this.AuthGerenciadorProdutoService.inativarProduto(produto.prodId, usuarioAtual).subscribe ({
      next: () => {
        alert(`Produto ${produto.nome} inativado com sucesso!`)
        this.carregarListaProdutos();
      },
      error: (erro) => {
        console.error('Erro ao inativar Produto:', erro);
        alert('Não foi possível inativar o produto.');
      }
    });

  }

  executarGerenciadorProduto(): void {
    if (this.carregando) {
      return;
    }
    if (!this.podeSalvar) {
      alert('Selecione um produto na lista e preencha os campos obrigatórios antes de salvar.')
      return;
    }
    this.carregando = true;
    console.log('Tentando atualizar produto...')

    const usuarioAtual = localStorage.getItem('usuarioLogado') || 'Sistema';

    this.AuthGerenciadorProdutoService.atualizarProduto(this.prodIdSelecionado, this.nomeDigitado, this.marcaDigitada, this.codBarraDigitada, this.quantidadeDigitada, 
    this.precoCustoDigitado, this.precoVendaDigitado, usuarioAtual).subscribe({
      next: (resposta) => {
        console.log('Atualização realizada com sucesso', resposta)
        setTimeout(() => {
          this.carregando = false;
          this.cdr.detectChanges();
        },50)
        setTimeout(() => {
          alert('Atualização realizada com sucesso')
        }, 50);
        this.carregarListaProdutos();
      },
      error: (erro) => {
        setTimeout(() => {
          console.log('Erro ao tentar realizar a atualização', erro)
          this.carregando = false;
          this.cdr.detectChanges();
        }, 50)
        setTimeout(() => {
          alert('Atualização de produto nao foi possivel')
        }, 50)
      }
    })
  }
}  

