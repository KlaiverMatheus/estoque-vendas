import { Component, ChangeDetectorRef } from '@angular/core';
import { Auth } from '../../services/auth';
import { FormsModule } from "@angular/forms"; //importando o serviço aut
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  //para armazenar o que o usuario digitar
  usuarioDigitado: string = '';
  senhaDigitada: string = '';

  carregando: boolean = false;
    
  //puxamos para usar a funçao de login
  constructor(private Auth: Auth, private router: Router, private cdr: ChangeDetectorRef) {}

  //vai ser usado quando acionar o botao de Entrar
  executarLogin(): void {
    // se caso ja esteja carregado evita duplo clique
    if (this.carregando) {
      return;
    }
    //verificaçao para se o usuario nao tiver digitado nada
    if (!this.usuarioDigitado || !this.senhaDigitada) {
      alert('Preencha todos os campos!');
      return;
    }
    this.carregando = true;
    console.log('Tentando conectar com o Back-end...')

    // colocar um usuario teste por enquanto ----------------------------------------------------------------

    // const usuarioTeste = 'admin';
    // const senhaTeste = '123';

    // if (this.usuarioDigitado === usuarioTeste && this.senhaDigitada === senhaTeste) {
    //   console.log('Login realizado com sucesso');
    //   setTimeout(() => {
    //     this.carregando = false;
    //     this.cdr.detectChanges(); // força a tela a recarregar
    //     this.router.navigate(['/dashboard']);
    //   }, 1000);
    //   return;
    // }

    // setTimeout(() => {
    //   this.carregando = false;
    //   this.cdr.detectChanges(); 

    //   setTimeout(() => {
    //     alert('Falha no login! Usuário ou senha incorretos.');
    //   }, 50);
    // }, 1000);
    // return; 

    // caso o codigo acima esteja ativa, o abaixo vai desativar, deixar ativado apenas quando os testes 
    //estiver acontecendo sem o back end, aqui e fim do teste ------------------------------------------------------

    //chamando o metodo e passando as variaveis, o subscribe e para sabermos se deu certo ou errado 
    this.Auth.login(this.usuarioDigitado, this.senhaDigitada).subscribe({ 
      // se a resposta for sucesso
      next: (resposta) => {
        
        console.log('Login efetuado com sucesso!', resposta)

        // 👉 ESTA LINHA SALVA O USUÁRIO LOGADO NO NAVEGADOR
        localStorage.setItem('usuarioLogado', this.usuarioDigitado); //ATUALIZADO


        //por enquanto um alert para o usuario
        alert('Bem-vindo ao sistema!');

        //mandando o usuario para o dashboard
        this.carregando = false; //desativando o carregamento
        this.cdr.detectChanges(); // força a tela a recarregar
        this.router.navigate(['/dashboard'])
      },
      error: (erro) => {
        console.error('Erro ao tentar fazer login: ', erro);
        alert('Usuario ou senha incorretos!')
        this.carregando = false; //desativando o carregamento
        this.cdr.detectChanges(); // força a tela a recarregar
      }
    });
  }
}
