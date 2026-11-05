// Tipos de los datos que devuelve la API de UnaHur Anti-Social Net.
// Los nombres de los campos (nickName, description, content...) son los de la API.

export interface Usuario {
  id: number;
  nickName: string;
  createdAt?: string;
}

// Autor que viene incluido dentro de un post o de un comentario
export interface Autor {
  id: number;
  nickName: string;
}

export interface Etiqueta {
  id: number;
  name: string;
}

export interface Imagen {
  id: number;
  url: string;
}

export interface Comentario {
  id: number;
  content: string;
  userId: number;
  postId: number;
  createdAt: string;
  visible: boolean;
  user?: Autor;
}

export interface Publicacion {
  id: number;
  description: string;
  userId: number;
  createdAt: string;
  user?: Autor;
  images: Imagen[];
  tags: Etiqueta[];
  comments: Comentario[]; // la API ya los manda filtrados: solo los visibles
}

// Respuesta de POST /users y de POST /users/login
export interface RespuestaUsuario {
  message: string;
  usuario: Usuario;
}

// Lo que se manda en POST /posts
export interface DatosNuevaPublicacion {
  description: string;
  userId: number;
  tags: number[];
}

// Lo que se manda en POST /comments
export interface DatosNuevoComentario {
  content: string;
  userId: number;
  postId: number;
}
