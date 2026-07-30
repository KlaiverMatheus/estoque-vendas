import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthGerenciadorUsuario } from '../../services/auth-gerenciador-usuario';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importar CommonModule para usar o *ngFor na tabela
import { UserSelectDTO } from '../../models/user-select.dto'; // interface
import { NgxMaskDirective } from 'ngx-mask'; // para deixar o telefone melhor

@Component({
  selector: 'app-gerenciador-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskDirective],
  templateUrl: './gerenciador-usuario.html',
  styleUrl: './gerenciador-usuario.css',
})
export class GerenciadorUsuario implements OnInit{
  idSelecionado: string = ''; // Guarda o ID do usuário clicado
  nomeDigitado: string = '';
  senhaDigitada: string = '';
  emailDigitado: string = '';
  telefoneDigitado: string = '';
  cargoDigitado: string = '';

  // lista para guardar os usuarios
  listaUsuarios: UserSelectDTO[] = [];

  carregando: boolean = false;

  constructor(private AuthGerenciadorUsuarioService: AuthGerenciadorUsuario, private router: Router, private cdr: ChangeDetectorRef) {}

  // Verifica se pode salvar: precisa ter um usuário selecionado
  // e os campos obrigatórios preenchidos
  get podeSalvar(): boolean {
    return (
      !!this.idSelecionado &&
      this.nomeDigitado.trim().length > 0 &&
      this.emailDigitado.trim().length > 0 &&
      this.cargoDigitado.trim().length > 0
    );
  }

  // metodo para carrregar sempre que a tela atulizar
  ngOnInit(): void {
    this.carregarListaUsuarios();
  }

  // Busca a lista de usuarios no serviço
  carregarListaUsuarios(): void {
    // USUARIO TESTE LOCAL (Apagar quando o Java estiver rodando):
  // this.listaUsuarios = [
  //   { 
  //     userId: '1', 
  //     nome: 'Klaiver Matheus', 
  //     email: 'klaiver@email.com', 
  //     telefone: '(62) 99999-8888', 
  //     cargo: 'ADMINISTRADOR', 
  //     status: 'Ativo' 
  //   },
  //   { 
  //     userId: '2', 
  //     nome: 'João Silva', 
  //     email: 'joao@email.com', 
  //     telefone: '(62) 98888-7777', 
  //     cargo: 'BALCONISTA', 
  //     status: 'Ativo' 
  //   }
  // ];
  // final do teste ----------------------------------------

    // Quando ligar o Java, use esta linha:
    this.AuthGerenciadorUsuarioService.listarUsuarios().subscribe({
      next: (dados) => {
        this.listaUsuarios = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro ao buscar usuários', erro)
    });
    // final ---------------
  }

  // Efeito de subir os dados para o formulario ao clicar na lista
  selecionarUsuario(usuario: UserSelectDTO): void {
    this.idSelecionado = usuario.userId;
    this.nomeDigitado = usuario.nome;
    this.emailDigitado = usuario.email;
    this.telefoneDigitado = usuario.telefone || ''; // caso nao tenha fica vazio
    this.cargoDigitado = usuario.cargo ? usuario.cargo.toUpperCase() : ''; // toUpperCase() faz para encixar no select
    this.senhaDigitada = ''; // limpa a senha por segurança ao selecionar
    
    console.log('Usuario selecionado para ediçao:', usuario);
  }

  // Metodo para inativar 
  inativarUsuario(usuario: UserSelectDTO, event: Event): void {
    
    // Impede que o clique no botao de excluir selecione a linha para edição
    event.stopPropagation();

    const confirmacao = confirm(`Tem certeza que deseja inativar o usuário ${usuario.nome}?`);
    
    if (!confirmacao) {
      return;
    }

    console.log('Inativando usuário ID:', usuario.userId);

    // MOCK DE TESTE LOCAL:
    // Altera o status do usuário na lista local instantaneamente

    // usuario.status = 'Inativo';
    // this.cdr.detectChanges();
    // alert(`Usuário ${usuario.nome} foi inativado com sucesso!`);

    // // CHAMADA REAL DO JAVA (ativar quando o back-end estiver pronto):
    const usuarioAtual = localStorage.getItem('usuarioLogado') || 'Sistema';
    this.AuthGerenciadorUsuarioService.inativarUsuario(usuario.userId, usuarioAtual).subscribe({
      next: () => {
        alert(`Usuário ${usuario.nome} inativado com sucesso!`);
        this.carregarListaUsuarios(); // recarrega a lista para atualizar o status
      },
      error: (erro) => {
        console.error('Erro ao inativar usuário:', erro);
        alert('Não foi possível inativar o usuário.');
      }
    });
    // // final do chamdo
  }

  executarGerenciadorUsuario(): void {
    if (this.carregando) {
      return;
    }
    if (!this.podeSalvar) {
    alert('Selecione um usuário na lista e preencha os campos obrigatórios antes de salvar.');
    return;
    }
    this.carregando = true;
    console.log('Tentando atualizar usuario...')
    
    const usuarioAtual = localStorage.getItem('usuarioLogado') || 'Sistema'; 

    this.AuthGerenciadorUsuarioService.atualizarUsuario(this.idSelecionado, this.nomeDigitado, this.senhaDigitada, this.emailDigitado, this.telefoneDigitado, this.cargoDigitado, usuarioAtual).subscribe({
      next: (resposta) => {
        console.log('Atualização realizada com sucesso', resposta)
        setTimeout(() => {
          this.carregando = false;
          this.cdr.detectChanges();
        }, 50)
        setTimeout(() => {
          alert('Atualização realizada com sucesso')
        }, 50);
        this.carregarListaUsuarios(); // recarrega para mostrar os novos dados
      },
      error: (erro) => {
        setTimeout(() => {
          console.log('Erro ao tentar realizar a atualização', erro)  
          this.carregando = false;
          this.cdr.detectChanges();
        },50)
        setTimeout(() => {
          alert('Atualização de usuario nao foi possivel');
        },50)
      }
    })

  }
}