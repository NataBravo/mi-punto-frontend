# Interfaces sugeridas en Figma para la propuesta de diseño de Mi Punto

De acuerdo con el proyecto **Mi Punto**, la propuesta de diseño en Figma debe contemplar interfaces para los **tres tipos de usuario** definidos en el sistema:

1. **Usuario final**
2. **Administrador de negocio**
3. **Dueño de la aplicación**

El diseño debe enfocarse en una **webapp responsive** orientada al descubrimiento de negocios locales, visualización en mapa/listado, gestión de perfiles comerciales, publicación de reseñas y consulta de métricas básicas.

---

## 1. Interfaces para usuario público y usuario final

### 1.1 Pantalla de inicio / landing page

Interfaz pública inicial para presentar la plataforma.

**Elementos sugeridos:**

- Nombre y logo de **Mi Punto**.
- Mensaje principal relacionado con descubrir negocios locales cercanos.
- Botones de acción:
  - **Iniciar sesión**
  - **Registrarse**
  - **Explorar negocios**
- Sección breve de beneficios para usuarios y negocios.
- Diseño responsive para escritorio y móvil.

**Objetivo de la interfaz:**  
Contextualizar la propuesta antes de que el usuario acceda al catálogo o se autentique.

---

### 1.2 Registro e inicio de sesión

Como el proyecto contempla autenticación y roles, es importante diseñar pantallas de acceso al sistema.

**Interfaces sugeridas:**

- Pantalla de **inicio de sesión**.
- Pantalla de **registro**.
- Opción para identificar o asignar tipo de usuario:
  - Usuario final.
  - Administrador de negocio.
  - Dueño de la aplicación, si aplica solo internamente.
- Recuperación de contraseña, opcional para el prototipo.

**Objetivo de la interfaz:**  
Permitir el acceso seguro al sistema y representar la separación de funcionalidades según el rol del usuario.

---

### 1.3 Selección de ciudad o ubicación

Pantalla clave para el flujo del usuario final.

**Elementos sugeridos:**

- Botón para autorizar geolocalización.
- Selector de ciudad manual.
- Mensaje alternativo si el usuario niega permisos de ubicación.
- Botón para continuar al catálogo.

**Objetivo de la interfaz:**  
Permitir que el usuario consulte negocios por ciudad o cercanía, manteniendo una experiencia funcional incluso si no autoriza la geolocalización.

---

### 1.4 Catálogo de negocios

Una de las interfaces principales del MVP.

**Elementos sugeridos:**

- Buscador.
- Filtros por:
  - Ciudad.
  - Categoría.
  - Cercanía.
- Tarjetas de negocios con:
  - Imagen.
  - Nombre del negocio.
  - Categoría.
  - Calificación promedio.
  - Dirección o distancia aproximada.
  - Estado abierto/cerrado, si se desea como mejora visual.
- Opción para alternar entre:
  - **Vista de lista**
  - **Vista de mapa**

**Objetivo de la interfaz:**  
Permitir que el usuario final explore negocios activos disponibles en una ciudad o zona cercana.

---

### 1.5 Vista de mapa con marcadores

Pantalla donde el usuario visualiza los negocios de forma geográfica.

**Elementos sugeridos:**

- Mapa principal.
- Marcadores de negocios.
- Panel lateral o inferior con tarjetas resumidas.
- Filtros rápidos.
- Botón para centrar en la ubicación actual.
- Tarjeta emergente al hacer clic en un marcador.

**Objetivo de la interfaz:**  
Facilitar la ubicación visual de negocios cercanos y mejorar la experiencia de descubrimiento mediante geolocalización.

---

### 1.6 Perfil detallado del negocio

Pantalla fundamental para que el usuario decida si visita un establecimiento.

**Elementos sugeridos:**

- Imagen principal del negocio.
- Galería multimedia.
- Nombre del negocio.
- Categoría.
- Descripción.
- Dirección.
- Ciudad.
- Datos de contacto.
- Ubicación en mapa.
- Calificación promedio.
- Lista de reseñas.
- Botón para publicar reseña.

**Objetivo de la interfaz:**  
Presentar información completa y confiable sobre un negocio para apoyar la decisión del usuario.

---

### 1.7 Publicar reseña

Puede diseñarse como pantalla independiente o como modal dentro del perfil del negocio.

**Elementos sugeridos:**

- Calificación por estrellas.
- Campo de comentario.
- Botón **Publicar reseña**.
- Mensajes de validación.
- Confirmación de publicación.

**Objetivo de la interfaz:**  
Permitir que el usuario final comparta su experiencia mediante una calificación y comentario.

---

## 2. Interfaces para administrador de negocio

### 2.1 Dashboard del administrador de negocio

Pantalla privada para que el administrador gestione su negocio.

**Elementos sugeridos:**

- Nombre del negocio administrado.
- Métricas principales:
  - Visitas al perfil.
  - Número de reseñas.
  - Calificación promedio.
- Accesos rápidos:
  - Editar perfil.
  - Gestionar galería.
  - Ver reseñas.
  - Responder comentarios.

**Objetivo de la interfaz:**  
Brindar una vista resumida del desempeño del negocio y accesos directos a las funciones principales.

---

### 2.2 Crear o editar perfil del negocio

Interfaz tipo formulario para gestionar la información visible del establecimiento.

**Campos sugeridos:**

- Nombre del negocio.
- Descripción.
- Categoría.
- Dirección.
- Ciudad.
- Datos de contacto.
- Imagen de perfil.
- Estado del perfil, si aplica.
- Botón para guardar cambios.

**Objetivo de la interfaz:**  
Permitir que el administrador mantenga actualizado el perfil comercial de su negocio.

---

### 2.3 Selección de ubicación del negocio en mapa

Interfaz para definir la ubicación geográfica del negocio.

**Elementos sugeridos:**

- Campo de dirección.
- Mapa interactivo.
- Pin o marcador movible.
- Campos de latitud y longitud, opcionales.
- Botón para confirmar ubicación.

**Objetivo de la interfaz:**  
Permitir que el administrador registre con precisión la ubicación del negocio para que aparezca correctamente en el mapa.

---

### 2.4 Gestión de galería multimedia

Pantalla para administrar imágenes asociadas al negocio.

**Elementos sugeridos:**

- Imagen de perfil.
- Galería de fotos.
- Botón para subir imagen.
- Vista previa de imágenes.
- Opción de eliminar imagen.
- Opción de cambiar orden.
- Mensajes sobre restricciones de formato o tamaño.

**Objetivo de la interfaz:**  
Permitir que el negocio muestre visualmente su propuesta de valor mediante imágenes o contenido multimedia.

---

### 2.5 Gestión de reseñas y respuestas

Pantalla para que el administrador revise y responda comentarios de usuarios.

**Elementos sugeridos:**

- Lista de reseñas.
- Nombre del usuario.
- Calificación.
- Comentario.
- Fecha.
- Campo para responder.
- Estado de respuesta:
  - Respondida.
  - Pendiente.

**Objetivo de la interfaz:**  
Facilitar la gestión de reputación digital del negocio mediante respuestas a las reseñas de los usuarios.

---

## 3. Interfaces para dueño de la aplicación

### 3.1 Dashboard global de la plataforma

Pantalla administrativa principal para el dueño de la aplicación.

**Métricas sugeridas:**

- Total de negocios registrados.
- Negocios activos.
- Negocios inactivos.
- Total de reseñas.
- Visitas generales.
- Distribución de negocios por ciudad.
- Distribución de negocios por categoría.

**Objetivo de la interfaz:**  
Permitir que el dueño de la aplicación supervise el estado general de la plataforma.

---

### 3.2 Gestión global de negocios

Pantalla tipo tabla administrativa para controlar los negocios registrados.

**Columnas sugeridas:**

- Nombre del negocio.
- Ciudad.
- Categoría.
- Administrador responsable.
- Estado:
  - Activo.
  - Inactivo.
- Acciones:
  - Ver detalle.
  - Activar.
  - Desactivar.

**Objetivo de la interfaz:**  
Permitir la consulta, supervisión y moderación de los negocios registrados en la plataforma.

---

### 3.3 Detalle administrativo de negocio

Pantalla para revisar un negocio desde la perspectiva del dueño de la aplicación.

**Elementos sugeridos:**

- Datos principales del negocio.
- Estado actual.
- Administrador asociado.
- Métricas básicas.
- Reseñas recientes.
- Botón para activar o desactivar el negocio.

**Objetivo de la interfaz:**  
Complementar la moderación y supervisión de la plataforma con una vista detallada de cada negocio.

---

## 4. Componentes reutilizables recomendados en Figma

Además de las pantallas principales, es conveniente diseñar componentes reutilizables para mantener consistencia visual.

**Componentes sugeridos:**

- Navbar pública.
- Menú lateral para paneles administrativos.
- Tarjeta de negocio.
- Modal de confirmación.
- Componente de estrellas para calificación.
- Tabla administrativa.
- Formulario base.
- Estado vacío, por ejemplo: “No hay negocios registrados”.
- Estado de carga.
- Mensajes de error.
- Mensajes de éxito.
- Vista responsive móvil de catálogo.
- Vista responsive móvil de mapa.
- Vista responsive móvil del perfil del negocio.

---

## 5. Priorización sugerida para la propuesta de diseño

| Prioridad | Interfaz | Usuario |
|---|---|---|
| Alta | Landing page | Público |
| Alta | Login / registro | Todos |
| Alta | Selección de ciudad o ubicación | Usuario final |
| Alta | Catálogo de negocios | Usuario final |
| Alta | Vista de mapa | Usuario final |
| Alta | Perfil del negocio | Usuario final |
| Alta | Publicar reseña | Usuario final |
| Alta | Dashboard administrador de negocio | Administrador de negocio |
| Alta | Editar perfil del negocio | Administrador de negocio |
| Alta | Gestión de reseñas | Administrador de negocio |
| Alta | Dashboard global | Dueño de la aplicación |
| Alta | Gestión global de negocios | Dueño de la aplicación |

---

## 6. Flujo general que debería representar el prototipo

El prototipo en Figma debería representar el recorrido completo del MVP:

1. El usuario accede a la plataforma.
2. Selecciona su ciudad o permite usar su ubicación.
3. Consulta negocios en listado o mapa.
4. Entra al perfil detallado de un negocio.
5. Revisa fotos, información y reseñas.
6. Publica una reseña.
7. El administrador del negocio inicia sesión.
8. Gestiona el perfil del negocio.
9. Responde reseñas.
10. Consulta métricas básicas.
11. El dueño de la aplicación accede al dashboard global.
12. Supervisa negocios registrados.
13. Activa o desactiva negocios según corresponda.

---

## 7. Conclusión

La propuesta de diseño en Figma para **Mi Punto** debe mostrar el funcionamiento central del MVP desde tres perspectivas: el usuario final, el administrador de negocio y el dueño de la aplicación.

El diseño debe evidenciar cómo el usuario descubre un negocio, consulta su perfil y deja una reseña; cómo el administrador gestiona la información de su establecimiento y responde comentarios; y cómo el dueño de la aplicación supervisa negocios y métricas generales.

Con estas interfaces, el prototipo no solo representaría la apariencia visual del sistema, sino también la lógica funcional planteada en el proyecto.
