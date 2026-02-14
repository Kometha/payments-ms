import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items } = paymentSessionDto;

    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), //20 Dólares
        },
        quantity: item.quantity,
      };
    });

    const session = await this.stripe.checkout.sessions.create({
      // TODO: Colocar aquí el ID de mi orden
      payment_intent_data: {
        metadata: {},
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3003/payments/success',
      cancel_url: 'http://localhost:3003/payments/cancel',
    });

    return session;
  }

  async stripeWebhook(req: RequestWithRawBody, res: Response) {
    const signature = req.headers['stripe-signature'];

    // Debug: verificar que rawBody existe
    console.log('rawBody exists:', !!req.rawBody);
    console.log('rawBody type:', typeof req.rawBody);
    console.log('rawBody is Buffer:', Buffer.isBuffer(req.rawBody));
    console.log('signature:', signature);

    let event: Stripe.Event;
    // ? Testing (usar este con: stripe listen --forward-to localhost:3003/payments/webhook)
    // const endpointSecret =
    //   'whsec_c7674f0433008ff39de158fb7f715c462a06c3e6c0095195a061ddccac71a8a8';

    // ? Real (usar este en producción con webhooks reales de Stripe)
    const endpointSecret = 'whsec_cCM7hWq0Ji8CE3XPLyn88dYETlraVvuW';

    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        signature!,
        endpointSecret,
      );

      console.log({ event });

      switch (event.type) {
        case 'charge.succeeded':
          // TODO: llamar a nuestro microservicio
          console.log({ event });
          break;

        default:
          console.log(`Evento ${event.type} not handled`);
          break;
      }
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }

    return res.status(200).json({ signature });
  }

  findAll() {
    return 'Pago hecho exitosamente!!';
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update() {
    return `This action updates a payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
