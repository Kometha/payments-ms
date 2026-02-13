import {
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession() {
    return this.paymentsService.createPaymentSession();
  }

  @Get('success')
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get('cancel')
  findOne() {
    return 'Payment canceled!!'
  }

  @Post('webhook')
  async stripeWebhook() {
    return 'stripeWebhook';
  }
}
