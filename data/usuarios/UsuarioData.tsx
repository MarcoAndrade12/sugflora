import Usuario from "./Usuario";
import Message from "../../Messages/Message";

class UsuarioData {
  usuarios: Usuario[] = [];

  constructor() {
    const usuarioADM1 = new Usuario(
      1,
      "Administrador",
      "do sistema",
      "adm",
      "adm",
      "111.111.111-1",
      "111.111.111-11",
      "Rua A, 123",
      "adm1@email.com",
      "ADMIN"
    );
    const usuarioADM2 = new Usuario(
      2,
      "Administrador II",
      "do sistema",
      "adm II",
      "123",
      "222.222.222-2",
      "222.222.222-22",
      "Rua B, 456",
      "adm2@email.com",
      "ADMIN"
    );

    this.usuarios.push(usuarioADM1)
    this.usuarios.push(usuarioADM2)

    console.log("Todos os usuários: ", this.getAll());
  }

  public getByUsername(username: string): Message<Usuario> {
    const usuario = this.usuarios.find(
      (usuario) => usuario.username === username
    );
    if (usuario != undefined) {
      return new Message(200, "Usuario localizado", usuario);
    } else {
      return new Message(404, "Usuário não localizado");
    }
  }

  // Adicionado: Método para obter usuário por ID
  public getById(id: number): Message<Usuario> {
    const usuario = this.usuarios.find((usuario) => usuario.id === id);
    if (usuario != undefined) {
      return new Message(200, "Usuario localizado", usuario);
    } else {
      return new Message(404, "Usuário não localizado pelo ID");
    }
  }

  getLastId(): number {
    if (this.usuarios.length == 0) {
      return 0;
    } else {
      const id: number | undefined = this.usuarios[this.usuarios.length - 1].id;
      return id ? id : 0;
    }
  }

  public add(usuario: Usuario): Message<Usuario> {
    const exists: Message<Usuario> = this.getByUsername(usuario.username);

    if (exists.status === 404) {
      usuario.id = this.getLastId() + 1;
      this.usuarios.push(usuario);
      return new Message(201, "Cadastro de novo usuário concluído", usuario);
    } else {
      return new Message(409, "Já existe um usuário com esse Username");
    }
  }

  // Adicionado: Método para atualizar usuário
  public update(usuario: Usuario): Message<Usuario> {
    const index = this.usuarios.findIndex((u) => u.id === usuario.id);

    if (index !== -1) {
      // Verifica se o username já existe para outro usuário (se o username foi alterado)
      const usernameExists = this.usuarios.some(
        (u) => u.username === usuario.username && u.id !== usuario.id
      );
      if (usernameExists) {
        return new Message(409, "Já existe outro usuário com esse Username");
      }

      // Preservar a senha existente se não for fornecida
      const senhaAtual = usuario.senha || this.usuarios[index].senha;

      // Criar objeto atualizado preservando campos existentes
      const usuarioAtualizado = {
        ...this.usuarios[index],
        ...usuario,
        senha: senhaAtual,
        updated_at: new Date().toISOString(),
      };

      this.usuarios[index] = usuarioAtualizado;
      return new Message(
        200,
        "Usuário atualizado com sucesso",
        this.usuarios[index]
      );
    } else {
      return new Message(404, "Usuário não encontrado para atualização");
    }
  }

  // Adicionado: Método para deletar usuário
  public delete(id: number): Message<boolean> {
    const initialLength = this.usuarios.length;
    this.usuarios = this.usuarios.filter((usuario) => usuario.id !== id);
    if (this.usuarios.length < initialLength) {
      return new Message(200, "Usuário deletado com sucesso", true);
    } else {
      return new Message(404, "Usuário não encontrado para exclusão", false);
    }
  }

  public getAll(): Message<Usuario[]> {
    return new Message(200, undefined, this.usuarios.slice());
  }

  public login(username: string, senha: string): Message<Usuario> {
    const response = this.getByUsername(username);
    if (response.status === 200) {
      const usuario: Usuario = response.data!;
      if (usuario.senha === senha) {
        return new Message(200, "Login efetuado com sucesso", usuario);
      } else {
        return new Message(403, "Credenciais incorretas!");
      }
    }
    return new Message(403, "Credenciais incorretas!");
  }
}

export default UsuarioData;
