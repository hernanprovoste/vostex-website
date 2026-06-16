# Vostex — Rediseño visual "Nuggets style" + SEO técnico

**Fecha:** 2026-06-15
**Tipo:** Re-skin visual del landing one-pager (sin funcionalidad nueva) + SEO técnico completo
**Referencia visual:** Nuggets (agencia digital) — titulares display gigantes, alternancia fuerte oscuro/blanco, color de acento que resalta palabras, ítems divididos por líneas finas (hairline), mucho aire.

---

## 1. Contexto

Sitio actual: landing one-pager en Next.js 16 (App Router, Turbopack), Tailwind v4, framer-motion, next-intl (en/es). Middleware = `src/proxy.ts` (renombrado en Next 16). Secciones actuales y orden:

`Navbar → Hero → Problem → Services → Process → Portfolio → About → Contact → Footer`

Marca: navy `#0D1F3C`, dark `#060D1A`, cyan `#00C2FF` (+ variantes), platinum `#E8ECF0`, slate. Fuentes: Space Grotesk (display, hasta peso 700) e Inter (cuerpo). Iconografía Lucide. Ya tiene: focus rings, reduced-motion, 44px touch targets, validación de formulario con a11y, skip link, JSON-LD Organization, contraste corregido en footer/labels.

Objetivo del usuario: adoptar el lenguaje visual de Nuggets **manteniendo colores, fuentes y los mockups de proyecto tipo ventana de navegador**, y dejar el sitio **muy amigable con SEO**.

## 2. Objetivos / No-objetivos

**Objetivos**
- Re-skin completo de las 7 secciones + Navbar/Footer al lenguaje Nuggets, **manteniendo el contenido y orden actuales**.
- SEO técnico completo sobre el one-pager.

**No-objetivos (fuera de alcance)**
- Páginas de contenido nuevas (blog, detalle de servicios, casos). Se mencionó como lo que realmente mueve el SEO de descubrimiento, pero queda fuera de este trabajo.
- Cambios de funcionalidad (formulario, envío de email, etc.).
- Métricas/stats inventadas.
- Cambio de tipografías o paleta de marca.

## 3. Decisiones tomadas (Q&A)

| Tema | Decisión |
|------|----------|
| Alcance | Re-skin completo, mismo contenido (7 secciones + nav/footer) |
| Titular Hero | Mantener el mensaje actual, renderizado gigante/apilado con palabra de acento |
| Fila de stats | **Sin stats inventados**; mantener "compromisos honestos" reestilados en grande |
| Fondo Hero | **Oscuro** (mantener base navy/dark) |
| SEO | Técnico completo en el one-pager |
| `localePrefix` | Cambiar a **`as-needed`** (inglés en `/`, español en `/es`) |
| Enfoque visual | **A — Alternancia fiel a Nuggets** |

## 4. Sistema visual (aplica a todo el sitio)

**Tipografía**
- Titulares Space Grotesk 700: tamaños mucho mayores que hoy, apilados, tracking ~`-0.03em`, `line-height` ~`0.95–1.0`. Títulos de sección grandes, alineados a la izquierda.
- Cuerpo Inter: sin cambios.
- Una palabra de acento por titular (cyan).

**Color de acento — restricción de accesibilidad (crítica)**
El cyan brillante `#00C2FF` **no es legible sobre blanco** (~2:1). Regla por fondo:
- Sobre fondo **oscuro** → acento `#00C2FF` (≈9:1).
- Sobre fondo **claro** → `#0090C8` para titulares grandes (≥24px, cumple 3:1 de texto grande) y `#0077A8` para resaltados en texto chico (cumple 4.5:1).
Esta regla aplica también a los resaltados de keywords dentro de párrafos de intro.

**Ritmo oscuro/blanco (Enfoque A)**

| Sección | Fondo |
|---------|-------|
| Hero | Oscuro `#060D1A` |
| Problem | Blanco |
| Services | **Oscuro** (cambia) |
| Process | Blanco |
| Portfolio | Blanco |
| About | **Oscuro** (cambia) |
| Contact | Oscuro `#0D1F3C` |
| Footer | Oscuro `#060D1A` |

"Negros" = `#060D1A`; navy `#0D1F3C` para superficies/tarjetas elevadas dentro de lo oscuro.

**De cajas a líneas (cambio clave)**
Reemplazar las tarjetas con borde+fondo gris por **ítems con hairline arriba** (línea fina → ícono/número → título → texto), sin caja. Hairline: `white/10` en oscuro, `navy/10` (`#0D1F3C`/10) en claro. Afecta sobre todo a Services, Process, About, Problem y Portfolio.

**Espaciado y movimiento**
- Padding de sección más generoso (`py-28/36`).
- Se mantienen los reveals de framer-motion (`AnimatedSection`) y el respeto a `prefers-reduced-motion`.
- Iconografía Lucide (sin emojis), stroke consistente.

## 5. Tratamiento por sección

- **Navbar** — Cambios mínimos. Mantiene logo, links, toggle de idioma, CTA pill, scrollspy y la transición oscuro/claro keyed off hero. Transparente sobre el Hero oscuro.
- **Hero (oscuro)** — De centrado a **alineado a la izquierda**. Titular gigante apilado con el mensaje actual y palabra de acento en cyan. Fila inferior: subtítulo (izq) + CTA pill (der). Mantiene indicador de scroll. Sigue siendo el `h1` único.
- **Problem (blanco)** — Título grande con acento (izq). Los 3 dolores pasan de cajas a ítems hairline.
- **Services (ahora oscuro)** — Título grande + párrafo de intro con keywords resaltadas. Los 4 servicios pasan a columnas hairline (sin la caja navy "featured"). *Build* se destaca con tag "Core" + título en acento, no con caja.
- **Process (blanco)** — Restyle a números grandes 01–04 + hairline, grid 2×2. Es el más cercano a "Our Approach" de Nuggets.
- **Portfolio (blanco)** — **Se mantiene la ventana de navegador (Tognarelli) intacta.** Reestilar entorno: encabezado editorial, pills y testimonio con hairline.
- **About (ahora oscuro)** — Título grande con acento sobre oscuro. Historia en 2 columnas. Los **compromisos** ocupan el lugar visual de la fila de stats de Nuggets: fila grande dividida por líneas, pero **cualitativa** (24h respuesta, 0 lock-in, código tuyo, soporte post-launch). Valores en grid hairline.
- **Contact (oscuro)** — Sin cambios funcionales. Título gigante con acento; formulario (ya mejorado) en tarjeta navy.
- **Footer (oscuro)** — Cambios mínimos (ya quedó con buen contraste e íconos de marca). Posible: agrandar wordmark.

**Secciones que más cambian:** Services y About (a oscuro + cajas→líneas). **Menos:** Navbar, Contact, Footer.

## 6. SEO técnico completo

1. **`generateMetadata` por idioma** en `src/app/[locale]/layout.tsx`: título y meta description localizados (nuevas claves en `messages/en.json` y `es.json`), `canonical` por locale, `alternates.languages` con hreflang `en`, `es`, `x-default`. `openGraph.locale` por idioma (`en_US`/`es_ES`) + `url` por locale + `alternateLocale`.
2. **`localePrefix: 'as-needed'`** en `src/i18n/routing.ts`: inglés (default) en `/`, español en `/es`.
   - Eliminar el redirect de `src/app/page.tsx` (`/` pasa a servir la home en inglés vía next-intl).
   - Ajustar `src/proxy.ts` si su matcher lo requiere.
   - hreflang: `en → https://vostex.io/`, `es → https://vostex.io/es`, `x-default → https://vostex.io/`.
   - Canonical: en `→ /`, es `→ /es`.
3. **`src/app/sitemap.ts`** — entradas para `/` y `/es` con `alternates.languages`.
4. **`src/app/robots.ts`** — `allow: '/'`, `host` y `sitemap` apuntando a `https://vostex.io/sitemap.xml`.
5. **OG image dinámica** — `src/app/[locale]/opengraph-image.tsx` con `next/og` (`ImageResponse`), 1200×630, wordmark + título sobre navy, por idioma. Reusar como `twitter` image.
6. **Structured data** — mantener `Organization` (ya está, en `[locale]/layout.tsx`); agregar `WebSite` y `ProfessionalService` (servicios como ofertas + `areaServed` Valdivia/Chile/LatAm). Honesto, sin inventar.
7. **Jerarquía de headings** — un solo `h1` (Hero), `h2` por sección, `h3` en tarjetas; los tamaños gigantes son solo CSS. Eyebrow labels como `<p>`. Verificar que no se salten niveles.
8. **Alt text + landmarks** — toda imagen significativa con `alt` descriptivo; decorativos `aria-hidden`; `header/main/footer` + skip link (ya presentes).
9. **Core Web Vitals** — `next/font` con `display: swap` (size-adjust → sin CLS por fuente). LCP del Hero = texto. Imagen de Portfolio lazy + dimensiones. Verificar que las secciones nuevas no introduzcan CLS ni horizontal scroll.

## 7. Restricciones y riesgos

- **Space Grotesk tope peso 700**: no es tan "fat/condensed" como la tipografía de Nuggets. Se compensa con tamaño, tracking ajustado y la palabra de acento. Aceptado por el usuario.
- **Acento cyan sobre blanco**: prohibido `#00C2FF` como texto sobre claro; usar `#0090C8`/`#0077A8` (ver §4). Riesgo de regresión de contraste si no se respeta.
- **Más secciones oscuras** (Services, About): cuidar contraste de texto secundario (usar `#94A3B8`, no `#4A5568`, sobre `#060D1A`).
- **`as-needed`**: toca routing + `proxy.ts` + elimina el redirect de `page.tsx`. Verificar que `/`, `/es` y el cambio de idioma sigan funcionando, y que el apex no quede en bucle.
- Verificar que los mockups de navegador (Portfolio) no rompan en los nuevos fondos.

## 8. Verificación (criterios de aceptación)

- `next build` pasa (TypeScript + generación estática) — invocar binario local (`node node_modules/next/dist/bin/next build`) porque `next`/`pnpm` no están en PATH; instalar deps con `corepack pnpm install`.
- Las 8 zonas (7 secciones + nav/footer) reflejan el lenguaje Nuggets con el ritmo oscuro/blanco de §4.
- Contraste AA verificado en cada par texto/fondo nuevo (≥4.5:1 texto normal, ≥3:1 texto grande/glyphs).
- Un único `h1`; jerarquía de headings sin saltos.
- `/`, `/es` y `/sitemap.xml`, `/robots.txt` responden 200; cambio de idioma funciona; hreflang y canonical correctos por locale.
- OG image renderiza por idioma.
- `prefers-reduced-motion` respetado; sin horizontal scroll en 375px; touch targets ≥44px.
- Mockups de navegador (Tognarelli) intactos.

## 9. Notas de implementación

- Trabajar sobre componentes existentes en `src/components/sections/*`, `src/components/layout/*`, `src/components/ui/*` y `src/app/globals.css`. Seguir el idiom actual (valores Tailwind arbitrarios `text-[#...]`).
- Agregar tokens/utilidades en `globals.css` solo si reducen repetición (p. ej. clase de acento por contexto).
- i18n: cualquier texto nuevo (claves SEO) va a `messages/en.json` y `messages/es.json`.
