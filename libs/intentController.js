import { Models } from 'mongoose';

export default function intentController(result) {
  switch (result.intent.displayName) {
    case 'catalogo':
      const res = catalogo(result.fulfillmentText);
      return request(res, result.intent.displayName);
      break;

    default:
      break;
  }
}

function catalogo(response) {
  // buscar en la base de datos las pizzas
  const dataDB = Models.Pizza.find();
  // crear un array con los nombres de las pizzas y sus precios
  const data = [];
  dataDB.forEach((pizza) => {
    data.push({
      title: pizza.nombre,
      subtitle: pizza.precio,
      image_url: pizza.imagen,
      default_action: {
        type: 'web_url',
        url: 'https://www.facebook.com/pizzaspizzariasc',
        messenger_extensions: true,
        webview_height_ratio: 'tall',
        fallback_url: 'https://www.facebook.com/pizzaspizzariasc',
      },
    });
  });
  const res = response.replace('[x]', data.toString());
  return res;
}

function request(res, intent) {
  switch (intent) {
    case 'catalogo':
      const request_body = {
        recipient: {
          id: senderId,
        },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: 'First card',
                  subtitle: 'Element #1 of an hscroll',
                  image_url:
                    'https://petersfancybrownhats.com/company_image.png',
                  default_action: {
                    type: 'web_url',
                    url: 'https://petersfancybrownhats.com/view?item=103',
                    messenger_extensions: true,
                    webview_height_ratio: 'tall',
                    fallback_url: 'https://petersfancybrownhats.com/',
                  },
                },
              ],
            },
          },
        },
      };
      break;

    default:
      break;
  }
}
