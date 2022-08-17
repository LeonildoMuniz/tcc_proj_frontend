export class AuthTokenErro extends Error{
    constructor(){
        super('Erro de autenticação do token.')
    }
}