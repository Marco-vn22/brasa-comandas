# Brasa · Comandas para pollería

Aplicación React para registrar pedidos en mesa o para llevar, cobrar y coordinar la cocina en tiempo real con Firebase Realtime Database.

## Funciones

- Carta de pollos, mostrito, bebidas y complementos; cantidades y notas de cocina.
- Pago en efectivo con cálculo del vuelto en soles, usando céntimos para evitar errores de redondeo.
- Registro de pago por Yape con confirmación manual del mesero.
- Cocina con tarjetas compactas, columnas adaptables y una lista desplazable con cabecera fija.
- Un botón por comanda: **Preparar pedido**, seguido de **Todo listo**.
- Estados amarillo, verde y azul; aviso visual al recibir nuevas comandas.
- Confirmación de entrega al cliente desde el salón. El pedido deja de aparecer en cocina y se conserva en el historial.
- Autenticación con correo y contraseña, con acceso limitado al personal autorizado.
- Modo de demostración local, independiente de los pedidos de Firebase.

## Requisitos

Node.js 20.19+ o 22.12+ y npm.

```sh
npm ci
npm run dev
```

Abre la dirección que muestra Vite.

```sh
npm test       # Cálculos y transiciones de estado
npm run build # Compilación en dist/
```

## Firebase

La aplicación usa **Realtime Database**, no Firestore. El proyecto `polleria-8f1ee` está preconfigurado en `src/firebase-config.js`.

Para usar otro proyecto, cambia la configuración en ese archivo o en la pantalla **Configuración** de la aplicación. La configuración introducida en pantalla solo afecta al navegador actual.

1. Registra una aplicación web en Firebase y crea Realtime Database.
2. Activa Authentication con correo electrónico y contraseña.
3. Crea las cuentas del personal en la consola de Authentication.
4. Publica las reglas de `database.rules.json`.
5. Desde la consola de Realtime Database, registra `staff/<UID>` con el valor booleano `true` para cada cuenta autorizada.
6. Inicia sesión desde los dispositivos del salón y la cocina usando el mismo proyecto.

Los identificadores de configuración web de Firebase son públicos. No añadas claves privadas de cuentas de servicio, tokens ni contraseñas al repositorio. La autorización depende de Authentication y de las reglas de Realtime Database.

Las reglas no permiten que el cliente modifique `staff`. Todas las cuentas autorizadas tienen las mismas funciones; las vistas de salón y cocina no constituyen roles separados.

## Publicación en Firebase Hosting

Después de instalar y autenticar Firebase CLI con tu cuenta:

```sh
npm run build
firebase deploy --only hosting,database --project polleria-8f1ee
```

El archivo `firebase.json` incluye la configuración de Hosting y la ubicación de las reglas.

## Personalización y alcance

El catálogo y sus precios ilustrativos se encuentran en el array `menu` de `src/main.jsx`. Ajusta los productos, precios e imágenes antes de operar. Las mesas disponibles se definen en el mismo archivo.

Yape requiere verificación manual: no existe integración bancaria, cobro automático ni emisión de comprobantes fiscales. El personal autorizado puede crear pedidos desde el cliente; para validar precios y sumas contra manipulaciones se necesita un backend adicional.

El modo demo guarda datos en el navegador. Firebase sincroniza los pedidos reales entre las sesiones autorizadas. Las fotografías son ilustrativas y se cargan desde Unsplash; las fuentes se cargan desde Google Fonts.

Consulta `LEEME.txt` para los detalles de operación y las verificaciones realizadas.
