# Mi Punto – Frontend

## 📌 Descripción del proyecto

Mi Punto es una plataforma web que permite a los usuarios descubrir negocios locales, visualizar su ubicación en un mapa, consultar información relevante y dejar reseñas.

Este repositorio contiene la capa de presentación del sistema, encargada de la interacción con el usuario.

---

## 🚀 Tecnologías utilizadas

* React (con Vite)
* TailwindCSS
* shadcn/ui (componentes)
* Jotai (manejo de estado)

---

## 🧠 Arquitectura

El proyecto implementa **Screaming Architecture** con un enfoque de **arquitectura monolítica modular**, donde la estructura del código está organizada por dominios del negocio en lugar de capas técnicas.

Esto permite mayor escalabilidad, mantenibilidad y claridad en el desarrollo.

---

## 📁 Estructura del proyecto

src/
│
├── modules/        # Módulos por dominio (auth, business, reviews)
├── shared/         # Componentes y utilidades reutilizables
├── app/            # Configuración global, rutas y estado
│
└── main.jsx        # Punto de entrada

---

## ⚙️ Instalación y ejecución

1. Clonar el repositorio:

```
git clone <URL_DEL_REPOSITORIO>
```

2. Instalar dependencias:

```
npm install
```

3. Ejecutar el proyecto:

```
npm run dev
```

---

## 🧪 Estado del proyecto

En desarrollo – implementación por sprints bajo metodología ágil Scrum.

---

## 👥 Equipo de desarrollo

* Natalia Bravo
* Juan Camilo

---

## 📄 Notas

Este proyecto hace parte del desarrollo de un MVP, siguiendo una construcción incremental basada en historias de usuario definidas en Jira.
