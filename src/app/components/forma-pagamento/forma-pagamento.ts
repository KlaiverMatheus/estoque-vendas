import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { SelectFormPag } from '../../models/forma-pagamento-dto';
import { AuthFormaPagamento } from '../../services/auth-forma-pagamento';

@Component({
  selector: 'app-forma-pagamento',
  imports: [FormsModule, CommonModule],
  templateUrl: './forma-pagamento.html',
  styleUrl: './forma-pagamento.css',
})
export class FormaPagamento implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  descricaoDigitado: string = '';

  listarFormaPag: SelectFormPag[] = [];

  carregando: boolean = false;

  /** Guarda as descrições que estão em processo de inativação, para desabilitar o botão individualmente */
  inativando: Set<string> = new Set();

  constructor(
    private authFormaPagamentoService: AuthFormaPagamento,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarListaFormaPagamento();
  }

  carregarListaFormaPagamento(): void {
    this.authFormaPagamentoService
      .listarFormaPagamento()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dados) => {
          this.listarFormaPag = dados;
          this.cdr.detectChanges();
        },
        error: (erro) => console.error('Erro ao buscar as formas de pagamento', erro),
      });
  }

  inativarFormaPagamento(formaPagamento: SelectFormPag, event: Event): void {
    event.stopPropagation();

    if (this.inativando.has(formaPagamento.descricao)) {
      return; // já está processando, evita duplo clique
    }

    const confirmacao = confirm(
      `Tem certeza que quer inativar essa forma de pagamento ${formaPagamento.descricao}?`
    );

    if (!confirmacao) {
      return;
    }

    this.inativando.add(formaPagamento.descricao);

    const usuarioAtual = localStorage.getItem('usuarioLogado') || 'Sistema';

    this.authFormaPagamentoService
      .inativarFormaPagamento(formaPagamento.descricao, usuarioAtual)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          alert(`Forma de pagamento ${formaPagamento.descricao} inativada com sucesso!`);
          this.inativando.delete(formaPagamento.descricao);
          this.carregarListaFormaPagamento();
        },
        error: (erro) => {
          console.error('Erro ao inativar forma de pagamento:', erro);
          alert('Não foi possível inativar');
          this.inativando.delete(formaPagamento.descricao);
          this.cdr.detectChanges();
        },
      });
  }

  isInativando(formaPagamento: SelectFormPag): boolean {
    return this.inativando.has(formaPagamento.descricao);
  }

  executarFormaPagamento(): void {
    if (this.carregando) {
      return;
    }

    const descricao = this.descricaoDigitado.trim();
    if (!descricao) {
      return;
    }

    this.carregando = true;

    const usuarioAtual = localStorage.getItem('usuarioLogado') || 'Sistema';

    this.authFormaPagamentoService
      .cadastroFormaPagamento(descricao, usuarioAtual)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.carregando = false;
          this.descricaoDigitado = '';
          this.cdr.detectChanges();
          alert('Cadastro realizado com sucesso');
          this.carregarListaFormaPagamento();
        },
        error: (erro) => {
          console.error('Erro ao tentar cadastrar', erro);
          this.carregando = false;
          this.cdr.detectChanges();
          alert('Cadastro não foi possível');
        },
      });
  }

  trackByDescricao(_index: number, item: SelectFormPag): string {
    return item.descricao;
  }
}