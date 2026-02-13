import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession(@Body() paymentSessionDto: PaymentSessionDto) {
    return this.paymentsService.createPaymentSession(paymentSessionDto);
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
