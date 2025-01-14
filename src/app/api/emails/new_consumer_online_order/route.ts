import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    // Verifica que la clave API esté configurada
    if (!process.env.NEXT_PUBLIC_RESEND_API_KEY) {
        return NextResponse.json({
            message: 'RESEND_API_KEY is not defined',
            status: 500,
        });
    }

    try {
        const formData = await request.formData();
        const emailTo = formData.get('email_to') as string;
        const shippingPrice = formData.get('shipping_price') as string;
        const totalPrice = formData.get('total_price') as string;
        const subtotalPrice = formData.get('subtotal_price') as string;
        const orderNumber = formData.get('order_number') as string;
        const orderItemsCount = parseInt(
            formData.get('order_items_count') as string,
        );

        // Información de envío
        const shippingName = formData.get('shipping_name') as string;
        const shippingLastname = formData.get('shipping_lastname') as string;
        const shippingDocumentId = formData.get(
            'shipping_document_id',
        ) as string;
        const shippingPhone = formData.get('shipping_phone') as string;
        const shippingAddress = formData.get('shipping_address') as string;
        const shippingAddressExtra = formData.get(
            'shipping_address_extra',
        ) as string;
        const shippingCountry = formData.get('shipping_country') as string;
        const shippingRegion = formData.get('shipping_region') as string;
        const shippingSubRegion = formData.get('shipping_sub_region') as string;
        const shippingCity = formData.get('shipping_city') as string;
        const shippingZipcode = formData.get('shipping_zipcode') as string;

        // Información de facturación
        const billingName = formData.get('billing_name') as string;
        const billingLastname = formData.get('billing_lastname') as string;
        const billingDocumentId = formData.get('billing_document_id') as string;
        const billingPhone = formData.get('billing_phone') as string;
        const billingAddress = formData.get('billing_address') as string;
        const billingCountry = formData.get('billing_country') as string;
        const billingRegion = formData.get('billing_region') as string;
        const billingSubRegion = formData.get('billing_sub_region') as string;
        const billingCity = formData.get('billing_city') as string;
        const billingZipcode = formData.get('billing_zipcode') as string;
        const billingIsCompany = formData.get('billing_is_company') === 'true';

        let orderItems = [];

        for (let i = 0; i < orderItemsCount; i++) {
            const item = {
                product_id: formData.get(
                    `order_items[${i}][product_id]`,
                ) as string,
                name: formData.get(`order_items[${i}][name]`) as string,
                price: parseFloat(
                    formData.get(`order_items[${i}][price]`) as string,
                ),
                quantity: parseInt(
                    formData.get(`order_items[${i}][quantity]`) as string,
                ),
            };

            orderItems.push(item);
        }

        const urlOrder = `${process.env.NEXT_PUBLIC_BASE_URL}/es/checkout/view_order?order_number=${orderNumber}`;

        const res = await axios.post(
            'https://api.resend.com/emails',
            {
                from: 'info@cervezanas.beer',
                to: emailTo,
                subject: `Nuevo pedido recibido #${orderNumber}`,
                html: `
              <!DOCTYPE html>
              <html lang="es">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmación de pedido</title>
                <style>
                  /* RESETEO BÁSICO */
                  body, h1, h2, h3, p, ul, li, a {
                    margin: 0;
                    padding: 0;
                  }
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5dc; /* Tono crema */
                    color: #333;
                  }
      
                  /* CONTENEDOR PRINCIPAL */
                  .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                  }
      
                  /* CABECERA */
                  .header {
                    background-color: #fbb123; /* Tono dorado */
                    color: #fff;
                    text-align: center;
                    padding: 15px;
                    font-size: 24px;
                    font-weight: bold;
                  }
      
                  /* CONTENIDO */
                  .content {
                    padding: 20px;
                    text-align: left;
                    line-height: 1.6;
                  }
                  .content h2 {
                    margin-bottom: 10px;
                    font-size: 20px;
                  }
                  .content p {
                    margin-bottom: 15px;
                  }
      
                  /* SECCIONES DE RESUMEN DE PEDIDO */
                  .order-summary {
                    margin: 20px 0;
                  }
                  .order-summary h2 {
                    font-size: 18px;
                    margin-bottom: 10px;
                    color: #fbb123;
                  }
                  .order-item {
                    border-bottom: 1px solid #eee;
                    padding: 10px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  }
                  .order-item:last-child {
                    border-bottom: none;
                  }
                  .order-item-name {
                    font-weight: bold;
                  }
                  .order-item-quantity {
                    color: #666;
                  }
                  .order-item-price {
                    font-weight: bold;
                    margin-left: 10px;
                  }
                  
                  /* TOTALES */
                  .total-summary {
                    margin-top: 20px;
                    text-align: right;
                  }
                  .total-summary div {
                    margin-bottom: 8px;
                  }
                  .total {
                    font-size: 18px;
                    font-weight: bold;
                    color: #fbb123;
                  }
      
                  /* BOTÓN */
                  .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #fbb123;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                    margin-top: 25px;
                    text-align: center;
                  }
                  .button:hover {
                    background-color: #dda014;
                  }
      
                  /* LINKS */
                  a {
                    color: #fbb123;
                    text-decoration: none;
                  }
                  a:hover {
                    text-decoration: underline;
                  }
      
                  /* INFORMACIÓN DE ENVÍO / FACTURACIÓN */
                  .info-section {
                    margin-top: 20px;
                  }
                  .info-section h3 {
                    color: #fbb123;
                    margin-bottom: 8px;
                  }
                  .info-section p {
                    margin-bottom: 5px;
                  }
      
                  /* PIE DE PÁGINA (OPCIONAL) */
                  .footer {
                    margin-top: 30px;
                    font-size: 14px;
                    text-align: center;
                    color: #777;
                  }
                  .footer p {
                    margin: 4px 0;
                  }
      
                  @media only screen and (max-width: 600px) {
                    .container {
                      margin: 10px;
                      width: auto;
                    }
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <!-- Cabecera -->
                  <div class="header">
                    ¡Gracias por tu pedido en Cervezanas!
                  </div>
      
                  <!-- Contenido principal -->
                  <div class="content">
                    <p>Hola,</p>
                    <p>
                      Hemos recibido tu pedido <strong>#${orderNumber}</strong> y estamos trabajando en procesarlo.
                      A continuación, encontrarás un resumen detallado de tu compra:
                    </p>
      
                    <!-- Resumen del pedido -->
                    <div class="order-summary">
                      <h2>Detalles del pedido</h2>
                      ${orderItems
                          .map(
                              (item) => `
                        <div class="order-item">
                          <div>
                            <span class="order-item-name">${item.name}</span>
                            <span class="order-item-quantity"> x${
                                item.quantity
                            }</span>
                          </div>
                          <div class="order-item-price">
                            ${item.price.toFixed(2)}€
                          </div>
                        </div>
                        <div style="font-size: 14px; margin-bottom: 8px;">
                          <a 
                            href="${
                                process.env.NEXT_PUBLIC_BASE_URL
                            }/products/${item.product_id}" 
                            target="_blank"
                          >
                            Ver producto
                          </a>
                        </div>
                      `,
                          )
                          .join('')}
                    </div>
      
                    <!-- Totales -->
                    <div class="total-summary">
                      <div>Subtotal: <strong>${subtotalPrice}€</strong></div>
                      <div>Envío: <strong>${shippingPrice}€</strong></div>
                      <div class="total">Total: ${totalPrice}€</div>
                    </div>
      
                    <!-- Información de Envío -->
                    <div class="info-section shipping-info">
                      <h3>Información de Envío</h3>
                      <p><strong>Nombre:</strong> ${shippingName} ${shippingLastname}</p>
                      <p><strong>Documento:</strong> ${shippingDocumentId}</p>
                      <p><strong>Teléfono:</strong> ${shippingPhone}</p>
                      <p>
                        <strong>Dirección:</strong> 
                        ${shippingAddress} 
                        ${
                            shippingAddressExtra
                                ? ', ' + shippingAddressExtra
                                : ''
                        }
                        ${shippingCity ? ', ' + shippingCity : ''} 
                        ${shippingRegion ? ', ' + shippingRegion : ''} 
                        ${shippingCountry ? ', ' + shippingCountry : ''} 
                        ${shippingZipcode ? ', ' + shippingZipcode : ''}
                      </p>
                    </div>
      
                    <!-- Información de Facturación -->
                    <div class="info-section billing-info">
                      <h3>Información de Facturación</h3>
                      <p><strong>Nombre:</strong> ${billingName} ${billingLastname}</p>
                      <p><strong>Documento:</strong> ${billingDocumentId}</p>
                      <p><strong>Teléfono:</strong> ${billingPhone}</p>
                      <p>
                        <strong>Dirección:</strong> 
                        ${billingAddress} 
                        ${billingCity ? ', ' + billingCity : ''} 
                        ${billingRegion ? ', ' + billingRegion : ''} 
                        ${billingCountry ? ', ' + billingCountry : ''} 
                        ${billingZipcode ? ', ' + billingZipcode : ''}
                      </p>
                      <p><strong>Es empresa:</strong> ${
                          billingIsCompany ? 'Sí' : 'No'
                      }</p>
                    </div>
      
                    <!-- CTA: Ver mi pedido -->
                    <p style="text-align: center;">
                      <a href="${urlOrder}" class="button">
                        Ver mi pedido
                      </a>
                    </p>
      
                    <p>
                      Si tienes alguna duda, no dudes en contactarnos en
                      <a href="mailto:info@cervezanas.beer">info@cervezanas.beer</a>.
                    </p>
                    <p><strong>¡Gracias por comprar en Cervezanas!</strong></p>
                  </div>
      
                  <!-- Pie de página -->
                  <div class="footer">
                    <p>© 2023 Cervezanas. Todos los derechos reservados.</p>
                    <p>
                      <a href="${
                          process.env.NEXT_PUBLIC_BASE_URL
                      }/es/ayuda" target="_blank">
                        Soporte
                      </a>
                      |
                      <a href="${
                          process.env.NEXT_PUBLIC_BASE_URL
                      }/es/terminos" target="_blank">
                        Términos y condiciones
                      </a>
                    </p>
                  </div>
                </div>
              </body>
              </html>
              `,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_RESEND_API_KEY}`,
                },
            },
        );

        // Devuelve la respuesta del servidor
        return NextResponse.json(res.data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: 'Error processing the request',
            status: 500,
        });
    }
}
