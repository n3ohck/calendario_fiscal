**Calendario Fiscal API para México**

Este proyecto es una API de calendario fiscal diseñada para informar a los contribuyentes mexicanos sobre todas las fechas importantes según su régimen fiscal. Desarrollada con Node.js y Express, y utilizando MySQL como base de datos, esta herramienta busca proporcionar información precisa y oportuna para ayudar a los contribuyentes a cumplir con sus obligaciones fiscales.

Descripción
El Calendario Fiscal API para México es una solución integral que permite a los contribuyentes:

* Obtener información detallada sobre fechas importantes de acuerdo a su régimen fiscal.
* Suscribirse para recibir notificaciones sobre próximos eventos fiscales.
* Acceder a datos ingresados manualmente por contadores reconocidos y titulados, asegurando la precisión y la confiabilidad de la información.


* **Características**
* Desarrollado con Node.js y Express: Aprovechando la flexibilidad y eficiencia de estas tecnologías para manejar solicitudes y respuestas HTTP.
* Base de datos MySQL: Utilizada para almacenar y gestionar de manera eficiente la información fiscal y las suscripciones de los usuarios.
* Notificaciones personalizadas: Los usuarios pueden suscribirse para recibir alertas sobre fechas fiscales relevantes para su régimen fiscal específico.
* Eventos fiscales capturados por expertos: Todos los eventos son ingresados manualmente por contadores reconocidos y titulados, garantizando la calidad y la exactitud de la información proporcionada.

*Ejemplo de uso*

* ** PRUEBA DE USO DE LA API**
* http://127.0.01:3000/api/test
* *Body POST*
*  {
*  "email":"n3ohck.mx@gmail.com",
*  "name":"alex salgado"
*  }


* **Suscribir un email**
http://127.0.01:3000/api/suscribe
* **Body POST*
* {
*  "email":"alexsalgado@outlook.com",
* "taxRegimeId": 1
* }


* ** Remover un email**
* http://127.0.01:3000/api/unsuscribe
* * **Body PUT*
* {
*  "id": 1
*  }


* ** Obtener todos los eventos fiscales GET**
* http://127.0.01:3000/api/sat/events?tax_regime_id=1&year=2024&month=01



* ** Crear un evento fiscal**
* http://127.0.01:3000/api/sat/events
* *Body POST*
* {
*  "tax_regime_id": 1,
*  "title" :"Evento de prueba",
*  "description":"descripcion de prueba",
*  "image":"https://algo.com/imagen.jpg",
*  "status_event":"vigente",
*  "status":"activo",
*  "year":"2024",
*  "month":"08"
*  }