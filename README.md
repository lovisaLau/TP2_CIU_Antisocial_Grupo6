# UnaHur Anti-Social Net – Interfaz de Usuario
 
FrontEnd en **React + TypeScript** de la red social **"UnaHur Anti-Social Net"**, hecho para el Trabajo Práctico 2 de **Construcción de Interfaces de Usuario** (UNAHUR).
 
La aplicación permite navegar publicaciones, ver su detalle con comentarios, registrarse, iniciar sesión, comentar y crear publicaciones con imágenes y etiquetas. Consume la API REST que el grupo desarrolló en **Estrategias de Persistencia**.
 
## 👩‍💻 Integrantes (Grupo 6)
 
- Laura Lovisa
- Marilín Grisafi
- María Milagros Carucci
- Miria Silvina Yáñez
 
## 🔗 Enlaces
 
- Repositorio del FrontEnd: https://github.com/lovisaLau/TP2_CIU_Antisocial_Grupo6
- Repositorio del BackEnd (Estrategias de Persistencia): https://github.com/lovisaLau/TP2_CIU_AntiSocial_BackEnd_Grupo6
- URL de la API utilizada: `http://localhost:3000` (BackEnd propio corriendo en local)
 
## 🛠️ Tecnologías
 
| Tema | Cómo lo usamos |
| --- | --- |
| React 19 + TypeScript | Proyecto creado con Vite (plantilla `react-ts`). Interfaces para los datos de la API, props y estado tipados |
| `useState`, `useEffect` | Estado de formularios y pantallas; carga de datos desde la API |
| `useContext` | `AuthContext` guarda el usuario logueado para toda la app |
| React Router DOM 7 | Rutas, ruta dinámica `/post/:id`, rutas protegidas y página 404 |
| Formularios controlados | Login, registro, comentarios y nueva publicación |
| `fetch` | Todos los pedidos están en `src/services/api.ts` |
| React Bootstrap 2 + CSS propio | Diseño responsive (celular, tablet y escritorio) |
| localStorage | La sesión se mantiene al recargar la página |
| Validaciones | Campos obligatorios con mensajes en rojo debajo de cada campo y errores del servidor en pantalla |
| ESLint | Revisión del código (`npm run lint`), con las reglas de hooks de React |
 
## ✨ Funcionalidades
 
- **Inicio de sesión:** con nickName y contraseña. El usuario se guarda en el contexto y en localStorage.
- **Registro:** valida los campos antes de enviar (`POST /users`) y muestra el error del servidor, por ejemplo "El nickName ya está en uso". Si sale bien, inicia sesión directamente.
- **Home:** banner de bienvenida, datos de la red, la publicación más comentada, feed de publicaciones recientes (descripción, imágenes, etiquetas, cantidad de comentarios y botón "Ver más") y sección "Sobre nosotros".
- **Detalle de publicación (`/post/:id`):** descripción completa, imágenes, etiquetas, comentarios visibles (filtrados por la API) y formulario para comentar (`POST /comments`).
- **Perfil (protegido):** nickName, publicaciones del usuario con su cantidad de comentarios y botón "Ver más", y botón para cerrar sesión.
- **Nueva publicación (protegida):** descripción obligatoria, una o más URLs de imágenes y etiquetas traídas de la API. Crea el post y después asocia cada imagen.
- **Página 404** para direcciones que no existen.
 
### Bonus
 
- **Contraseña propia y login validado por el BackEnd** (`POST /users/login`), con mensajes de error o éxito según la respuesta del servidor.
- **Filtro por etiquetas** en la Home (queda en la URL: `/?etiqueta=node`).
- **Publicación destacada:** la más comentada.
- **Paginación:** el feed muestra de a 6 publicaciones con el botón "Ver más publicaciones".
- **Animaciones suaves** al aparecer las tarjetas y al pasar el mouse.
- **Alertas visuales** de éxito y de error.
 
## 🔌 Endpoints que usa el FrontEnd
 
Usamos nuestro propio BackEnd. Algunas rutas tienen otro nombre que en la consigna, pero cumplen la misma función:
 
| Consigna | Nuestro BackEnd | Dónde se usa |
| --- | --- | --- |
| `GET /users` + contraseña fija | `POST /users/login` (bonus) | Login |
| `POST /users` | `POST /users` (con `password`) | Registro |
| `GET /posts` | `GET /posts` | Home |
| `GET /posts/:id` | `GET /posts/:id` | Detalle |
| `GET /posts?userId=xxx` | `GET /posts?userId=xxx` | Perfil |
| `POST /posts` | `POST /posts` | Nueva publicación |
| `GET /tags` | `GET /tags` | Home (filtro) y Nueva publicación |
| `GET /comments/post/:postId` | Vienen dentro de `GET /posts/:id`, ya filtrados | Detalle |
| `POST /comments` | `POST /comments` | Detalle |
| `POST /postimages` | `POST /posts/:id/images` | Nueva publicación |
 
## 🚀 Cómo correrlo en local
 
Se necesita **Node.js 20.19 o superior** (recomendado: la versión LTS) y **Git**. Hacen falta **dos terminales**: una para la API y otra para la app.
 
### 1. BackEnd (API)
 
```bash
git clone https://github.com/lovisaLau/TP2_CIU_AntiSocial_BackEnd_Grupo6.git
cd TP2_CIU_AntiSocial_BackEnd_Grupo6
npm install
cp .env.example .env      # en Windows: copy .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```
 
La API queda en `http://localhost:3000` (documentación en `http://localhost:3000/docs`).
 
### 2. FrontEnd
 
En **otra terminal**:
 
```bash
git clone https://github.com/lovisaLau/TP2_CIU_Antisocial_Grupo6.git
cd TP2_CIU_Antisocial_Grupo6
npm install
cp .env.example .env      # en Windows: copy .env.example .env
npm run dev
```
 
Abrir `http://localhost:5173`.
 
La dirección de la API se configura en `.env`:
 
```text
VITE_API_URL=http://localhost:3000
```
 
> La API solo acepta pedidos desde `localhost:5173` (`npm run dev`) y `localhost:4173` (`npm run preview`). Si el puerto 5173 está ocupado, `npm run dev` avisa y no arranca: cerrar la otra instancia y volver a correrlo.
 
### Usuarios de prueba
 
`laura`, `marilin`, `mili` y `silvina` (las cuatro integrantes), todos con la contraseña **`123456`**. También se puede crear un usuario nuevo desde "Registrarme".
 
### Scripts
 
| Comando | Para qué sirve |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (puerto 5173) |
| `npm run build` | Revisa los tipos con TypeScript y arma la versión final en `dist/` |
| `npm run preview` | Muestra la versión final (puerto 4173) |
| `npm run lint` | Revisa el código con ESLint |
 
## 📁 Estructura del proyecto
 
```text
src/
├── components/                  # Piezas reutilizables
│   ├── BarraNavegacion.tsx      # Barra con links según haya sesión o no
│   ├── CambioDeRuta.tsx         # Sube la página y cambia el título en cada ruta
│   ├── Cargando.tsx             # Spinner mientras responde la API
│   ├── FormularioComentario.tsx # Formulario controlado para comentar
│   ├── GaleriaImagenes.tsx      # Grilla de imágenes de un post
│   ├── ListaEtiquetas.tsx       # Etiquetas como #unahur #node
│   ├── PiePagina.tsx            # Footer
│   ├── RutaProtegida.tsx        # Solo deja pasar con sesión iniciada
│   └── TarjetaPublicacion.tsx   # Publicación del feed
├── context/
│   └── AuthContext.tsx          # Usuario logueado (useContext + localStorage)
├── pages/                       # Una por ruta
│   ├── Home.tsx                 # /
│   ├── Login.tsx                # /login
│   ├── Registro.tsx             # /registro
│   ├── DetallePublicacion.tsx   # /post/:id
│   ├── Perfil.tsx               # /perfil (protegida)
│   ├── NuevaPublicacion.tsx     # /nueva-publicacion (protegida)
│   └── NoEncontrada.tsx         # cualquier otra (404)
├── services/
│   └── api.ts                   # Todos los fetch a la API
├── types/
│   └── index.ts                 # Interfaces de TypeScript (Usuario, Publicacion...)
├── utils/
│   └── formato.ts               # Fechas, textos y validación de URLs
├── App.tsx                      # Rutas
├── main.tsx                     # Punto de entrada (BrowserRouter + Bootstrap)
└── index.css                    # Estilos globales y paleta
```

