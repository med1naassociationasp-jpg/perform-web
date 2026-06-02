import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { firstname, lastname, email, mobile, cf_1023, description } = body;

    // Validar campos obligatorios
    if (!firstname || !lastname || !email || !mobile || !cf_1023 || !description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos requeridos' })
      };
    }

    // Crear los parámetros exactos que Mantic360 espera
    const params = new URLSearchParams();
    params.append('firstname', firstname.trim());
    params.append('lastname', lastname.trim());
    params.append('email', email.trim());
    params.append('mobile', mobile.trim());
    params.append('cf_1023', cf_1023.trim());
    params.append('description', description.trim());
    
    // Tokens de autenticación
    params.append('__vtrftk', 'sid:1252d0a63cd506c686e56ed1d57c17a133fbf62f,1780428904');
    params.append('publicid', 'ce69c86b1ce09c8659c1963b6472b129');

    console.log('Enviando a Mantic360:', {
      firstname,
      lastname,
      email,
      mobile,
      cf_1023,
      description: description.substring(0, 50) + '...'
    });

    const response = await fetch('https://perform.mantic360-s1.net/modules/Webforms/capture.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const responseText = await response.text();
    console.log('Mantic360 Status:', response.status);
    console.log('Mantic360 Response:', responseText);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Solicitud enviada correctamente. Te contactaremos pronto.'
      })
    };

  } catch (error) {
    console.error('Error en submit-form:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Error al procesar la solicitud'
      })
    };
  }
};

export { handler };