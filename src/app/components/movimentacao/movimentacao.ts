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
  buscaRealizada: boolean = false;

  listaMovimentacoes: MovUsuarioDTO[] = [];
  movimentacoesExibidas: MovUsuarioDTO[] = [];

  dataInicio: string = '';       
  dataFim: string = '';       
  filtroAcao: string = '';       
  filtroUsuario: string = '';    
  filtroResponsavel: string = ''; 

  constructor(
    private authMovimentacaoService: AuthMovimentacao,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  limparFiltro(): void {
    this.dataInicio = '';
    this.dataFim = '';
    this.filtroAcao = '';
    this.filtroUsuario = '';
    this.filtroResponsavel = '';
    this.buscaRealizada = false;
    this.listaMovimentacoes = [];
    this.movimentacoesExibidas = [];
  }

  buscarMovimentacoes(): void {
    this.carregando = true;

    const filtros: any = {};
    if (this.dataInicio) filtros.dataInicio = this.dataInicio;
    if (this.dataFim) filtros.dataFim = this.dataFim;
    if (this.filtroAcao) filtros.acao = this.filtroAcao;
    if (this.filtroUsuario) filtros.usuarioAfetado = this.filtroUsuario;
    if (this.filtroResponsavel) filtros.responsavel = this.filtroResponsavel;

    this.authMovimentacaoService.filtrarMovimentacoes(filtros).subscribe({
      next: (dados) => {
        this.listaMovimentacoes = dados;
        this.movimentacoesExibidas = dados; 
        this.buscaRealizada = true;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao buscar movimentações:', erro);
        this.movimentacoesExibidas = [];
        this.buscaRealizada = true;
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }
}