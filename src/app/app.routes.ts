import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { NgModule } from '@angular/core';
import { CadastroUsuario } from './components/cadastro-usuario/cadastro-usuario';
import { CadastroProduto } from './components/cadastro-produto/cadastro-produto';

//aqui criamos as rotas das paginas
export const routes: Routes = [
    {path: '', component: Login},
    {path: 'dashboard', component: Dashboard},
    {path: 'cadastro-usuario', component: CadastroUsuario},
    {path: 'cadastro-produto', component: CadastroProduto},
    // rota para caso o usuario digite algo que nao existe, ele cai no login de novo
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)], // isso e para que o roteador saiba nossas rotas
    exports: [RouterModule]  // exporta para o resto do projeto
})
export class AppRoutingModule {}