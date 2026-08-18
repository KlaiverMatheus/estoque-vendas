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

  // Variáveis dos filtros (todos opcionais e combináveis entre si)
  filtroData: string = '';       // formato "yyyy-MM-dd" do input type="date"
  filtroAcao: string = '';       // '', 'CRIACAO', 'ATUALIZACAO', 'EXCLUSAO'
  filtroUsuario: string = '';    // busca parcial pelo usuário afetado
  filtroResponsavel: string = ''; // busca parcial pelo responsável

  constructor(
    private authMovimentacaoService: AuthMovimentacao,
    private cdr: ChangeDetectorRef
  ) {}

  // Não carrega nada automaticamente ao abrir a tela.
  // A busca só acontece quando o usuário clica em "Buscar".
  ngOnInit(): void {}

  limparFiltro(): void {
    this.filtroData = '';
    this.filtroAcao = '';
    this.filtroUsuario = '';
    this.filtroResponsavel = '';
    this.buscaRealizada = false;
    this.listaMovimentacoes = [];
    this.movimentacoesExibidas = [];
  }

  // Único ponto de entrada: chama a API e já aplica os filtros selecionados.
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

  // Aplica todos os filtros preenchidos ao mesmo tempo (lógica E / AND).
  // Um filtro vazio é ignorado e não restringe o resultado.
  private aplicarFiltro(dados: MovUsuarioDTO[]): MovUsuarioDTO[] {
    return dados.filter((item) => {
      // Filtro por Data (converte "yyyy-MM-dd" para "dd/MM/yyyy" para comparar com a string da API)
      if (this.filtroData) {
        const [ano, mes, dia] = this.filtroData.split('-');
        const dataFormatada = `${dia}/${mes}/${ano}`;
        if (!item.dataMov?.startsWith(dataFormatada)) {
          return false;
        }
      }

      // Filtro por Tipo de Ação (comparação exata)
      if (this.filtroAcao) {
        if (item.acaoMov !== this.filtroAcao) {
          return false;
        }
      }

      // Filtro por Usuário Afetado (busca parcial, sem diferenciar maiúsculas/minúsculas)
      const termoUsuario = this.filtroUsuario.trim().toLowerCase();
      if (termoUsuario) {
        if (!item.nomeUser?.toLowerCase().includes(termoUsuario)) {
          return false;
        }
      }

      // Filtro por Responsável (busca parcial, sem diferenciar maiúsculas/minúsculas)
      const termoResponsavel = this.filtroResponsavel.trim().toLowerCase();
      if (termoResponsavel) {
        if (!item.responsavel?.toLowerCase().includes(termoResponsavel)) {
          return false;
        }
      }

      return true;
    });
  }
}