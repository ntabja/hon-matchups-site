# HoN Matchups — sitio listo para publicar

## Qué es esta carpeta
Un sitio web estático (un solo `index.html`) que carga React desde un CDN.
Funciona en **cualquier hosting** (Vercel, Netlify, GitHub Pages o un servidor simple).

## Dónde poner las imágenes
Pon los íconos aquí:
`/assets/hon/`

Ejemplo de nombres de archivo (reemplaza espacios por guiones bajos):
- Witch_Slayer.webp
- Magmus.webp
- Pebbles.webp
- ...

Si una imagen no existe en `.webp`, el código intentará `.png` y luego `.jpg`.
Si ninguna existe, verás las iniciales del héroe.

## Cómo publicar en Vercel (gratis)
1) Crea cuenta en https://vercel.com con Google o GitHub.
2) En el panel, botón **Add New → Project → Import → seleccionar “Upload”**.
3) Arrastra esta **carpeta completa** o sube el **ZIP**.
4) Clic en **Deploy**. Vercel te dará una URL pública como `https://hon-matchups.vercel.app`.

## Cómo publicar en Netlify (gratis)
1) Crea cuenta en https://netlify.com.
2) Botón **Add new site → Deploy manually**.
3) Arrastra esta **carpeta** o el **ZIP** al recuadro.
4) Listo: te dará una URL pública.

¡Eso es todo!