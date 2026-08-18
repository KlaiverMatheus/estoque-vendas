import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovUsuarioDTO } from '../../models/mov-usuario-dto';
import { AuthMovimentacao } from '../../services/auth-movimentacao';

@Component({
  selector: 'app-movimentacao',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './movimentacao.html',
  styleUrl: './movimentacao.css',
})
export class Movimentacao implements OnInit {
  carregando: boolean = false;

  // Indica se o usuário já clicou em Buscar ao menos uma vez
  // (usado para não mostrar "nenhum resultado" antes da primeira busca)
  buscaRealizada: boolean = false;

  listaMovimentacoes: MovUsuarioDTO[] = [];

  // Lista que a tabela realmente exibe (só muda quando clica em Buscar)
  movimentacoesExibidas: MovUsuarioDTO[] = [];

  // Variáveis do filtro
  tipoFiltro: 'TODOS' | 'DATA' | 'ACAO' | 'USUARIO' | 'RESPONSAVEL' = 'TODOS';
  valorFiltroTexto: string = '';
  dataFiltro: string = ''; // formato "yyyy-MM-dd" do input type="date"

  constructor(
    private authMovimentacaoService: AuthMovimentacao,
    private cdr: ChangeDetectorRef
  ) {}

  // Não carrega nada automaticamente ao abrir a tela.
  // A busca só acontece quando o usuário clica em "Buscar".
  ngOnInit(): void {}

  limparFiltro(): void {
    this.tipoFiltro = 'TODOS';
    this.valorFiltroTexto = '';
    this.dataFiltro = '';
    this.buscaRealizada = false;
    this.listaMovimentacoes = [];
    this.movimentacoesExibidas = [];
  }

  // Único ponto de entrada: chama a API e já aplica o filtro selecionado.
  // Só é executado quando o usuário clica no botão Buscar.
  buscarMovimentacoes(): void {
    this.carregando = true;

    this.authMovimentacaoService.listarMovimentacoes().subscribe({
      next: (dados) => {
        this.listaMovimentacoes = dados;
        this.movimentacoesExibidas = this.aplicarFiltro(dados);
        this.buscaRealizada = true;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao buscar movimentações:', erro);
        this.buscaRealizada = true;
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private aplicarFiltro(dados: MovUsuarioDTO[]): MovUsuarioDTO[] {
    if (this.tipoFiltro === 'TODOS') {
      return dados;
    }

    // Filtro por Data (converte "yyyy-MM-dd" para "dd/MM/yyyy" para comparar com a string da API)
    if (this.tipoFiltro === 'DATA' && this.dataFiltro) {
      const [ano, mes, dia] = this.dataFiltro.split('-');
      const dataFormatada = `${dia}/${mes}/${ano}`;
      return dados.filter((item) => item.dataMov?.startsWith(dataFormatada));
    }

    // Filtros por texto/seleção
    const termo = this.valorFiltroTexto.trim().toLowerCase();
    if (!termo) {
      return dados;
    }

    return dados.filter((item) => {
      switch (this.tipoFiltro) {
        case 'ACAO':
          return item.acaoMov?.toLowerCase() === termo;
        case 'USUARIO':
          return item.nomeUser?.toLowerCase().includes(termo);
        case 'RESPONSAVEL':
          return item.responsavel?.toLowerCase().includes(termo);
        default:
          return true;
      }
    });
  }
}