¡Absolutamente\! Un buen `README` es la parte más importante de tu repositorio.

Aquí tienes un archivo `README.md` completo, escrito en Markdown. Solo tienes que **copiar, pegar** y **rellenar** la información en los `[corchetes]`.

-----

Crea un archivo llamado `README.md` en la raíz de tu proyecto (`restaurante-reservas/`) y pega este contenido:

````markdown
# 🍽️ Sistema de Reservas para Restaurante

Proyecto full-stack (Backend y Frontend) desarrollado para el curso de **[Nombre de tu Curso]** de la Universidad Mariano Gálvez de Guatemala, Sede Huehuetenango.

La aplicación moderniza el sistema de reservas de un restaurante familiar, reemplazando el cuaderno manual por una solución web digital que gestiona mesas, clientes y reservas en tiempo real.

![Captura de pantalla del dashboard del admin](https://i.imgur.com/tu-captura-de-pantalla.png)
*(Reemplaza esta URL con una de tus capturas de pantalla)*

---

## 🚀 Características Principales

### Backend (API en NestJS)

* **Gestión de Mesas:** CRUD completo para mesas (número, capacidad, ubicación).
* **Gestión de Clientes:** CRUD de clientes con almacenamiento de historial.
* **Gestión de Reservas:** Creación, consulta y cancelación de reservas.
* **Validaciones de Negocio:**
    * No permite doble reserva en la misma mesa y hora.
    * Valida que el número de personas no exceda la capacidad de la mesa.
    * Bloquea reservas fuera del horario laboral (p.ej., 9:00 - 22:00).
* **Consultas Especiales:**
    * Endpoint para ver la disponibilidad de mesas por fecha, hora y número de personas.
    * Endpoint para obtener todas las reservas de un día específico (`/reservas/dia/:fecha`).
    * Endpoint para obtener el historial completo de un cliente (`/clientes/:id`).

### Frontend (App en React)

* **Formulario de Cliente:** Una página pública (`/`) donde un cliente puede:
    1.  Ingresar sus datos.
    2.  Seleccionar fecha, hora y número de personas.
    3.  Buscar mesas disponibles (conectado a la API).
    4.  Seleccionar una mesa y confirmar la reserva.
* **Dashboard de Admin (`/admin`):** Muestra una tabla con todas las **reservas confirmadas para el día de hoy**.
* **Gestión de Mesas (`/admin/mesas`):**
    * Muestra una tabla con todas las mesas existentes.
    * Incluye un formulario para crear nuevas mesas.
* **Gestión de Clientes (`/admin/clientes`):**
    * Muestra una tabla de todos los clientes registrados.
    * Permite buscar clientes por nombre/email.
    * Muestra el **historial de reservas** de un cliente al seleccionarlo.

---

## 🛠️ Tecnologías Utilizadas

* **Backend:** NestJS, TypeORM, PostgreSQL
* **Frontend:** React (Vite), TypeScript, React Router
* **Base de Datos:** PostgreSQL (corriendo en Docker)
* **Pruebas de API:** Postman

---

## 🏁 Cómo Ejecutar el Proyecto

Necesitarás tener **Git**, **Node.js (npm)** y **Docker Desktop** instalados en tu máquina.

### 1. Clonar el Repositorio

```bash
git clone [https://docs.github.com/es/repositories/creating-and-managing-repositories/quickstart-for-repositories](https://docs.github.com/es/repositories/creating-and-managing-repositories/quickstart-for-repositories)
cd restaurante-reservas
````

### 2\. Backend (API)

Abre una terminal para el backend.

```bash
# 1. Navega a la carpeta del backend
cd backend

# 2. Levanta la base de datos (PostgreSQL)
# (Asegúrate de que Docker Desktop esté corriendo)
docker-compose up -d

# 3. Instala las dependencias
npm install

# 4. Configura las variables de entorno
# Crea un archivo .env en la raíz de /backend y pega esto:
DATABASE_URL="postgresql://admin:admin123@localhost:5432/reservas_db"

# 5. Inicia la API
npm run start:dev
```

✅ La API estará corriendo en `http://localhost:3000`.

### 3\. Frontend (Aplicación React)

Abre una **segunda terminal** para el frontend.

```bash
# 1. Navega a la carpeta del frontend
# (Ajusta la ruta si la llamaste diferente, ej: restaurante/front-reservas)
cd front-reservas 

# 2. Instala las dependencias
npm install

# 3. Inicia la aplicación
npm run dev
```

✅ El frontend estará corriendo en `http://localhost:5173` (o el puerto que indique la terminal).

-----

## 👨‍💻 Autor

  * **[Tu Nombre Completo]** - *[Tu Carnet (Opcional)]*

<!-- end list -->

```
```
