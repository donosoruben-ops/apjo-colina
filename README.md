# Generador APJO - Auto Apertura Juicio Oral

Aplicación web para generar Autos de Apertura de Juicio Oral (APJO) para el Juzgado de Garantía de Colina.

## Características

- Carga y procesamiento de PDFs de acusaciones fiscales usando IA Claude Vision
- Generación automática de plantillas Word
- Interfaz para defensa y ministerio público
- Despliegue en Firebase Hosting

## Despliegue en Firebase

1. **Instala Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Inicia sesión en Firebase:**
   ```bash
   firebase login
   ```

3. **Despliega la aplicación:**
   ```bash
   firebase deploy --only hosting
   ```

4. **Abre tu aplicación:**
   Firebase te dará la URL de despliegue (generalmente `https://tu-proyecto.web.app`)

## Uso

1. Abre la aplicación en tu navegador
2. Ingresa tu API Key de Claude Vision
3. Haz clic en "Conectar" para validar la API
4. Carga un PDF de acusación fiscal
5. Haz clic en "BARRIDO Y LECTURA IA DEL PDF" para extraer datos
6. Completa los campos de defensa si es necesario
7. Genera el documento Word

## Tecnologías

- HTML/CSS/JavaScript (Tailwind CSS)
- PDF.js para procesamiento de PDFs
- Mammoth.js para plantillas Word
- Claude Vision API de Anthropic (llamadas directas desde navegador)

## Estructura del proyecto

```
/
├── index.html          # Aplicación principal
├── firebase.json       # Configuración de Firebase Hosting
├── .firebaserc         # Configuración del proyecto Firebase
└── README.md           # Este archivo
```

## Notas

- La aplicación hace llamadas directas a la API de Anthropic desde el navegador usando el header `anthropic-dangerously-allow-browser`
- Compatible con PDFs de acusaciones fiscales chilenas
- No requiere servidor backend