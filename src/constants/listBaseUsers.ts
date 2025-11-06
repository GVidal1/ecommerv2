export interface User {
  email: string;
  password: string;
  nombre: string;
  rol: "admin" | "user";
}

const usuariosBase: User[] = [
  {
    email: "ra.fernandez@duocuc.cl",
    password: "123",
    nombre: "Raúl Fernández",
    rol: "admin",
  },
  {
    email: "ga.vidal@duocuc.cl",
    password: "123",
    nombre: "Gabriel Vidal",
    rol: "admin",
  },
  {
    email: "user@test.com",
    password: "123",
    nombre: "Usuario de Prueba",
    rol: "user",
  },
];

export default usuariosBase;
