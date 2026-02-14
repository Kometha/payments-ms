import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';
import type { Response } from 'express';

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
    return 'Payment canceled!!';
  }

  @Post('webhook')
  async stripeWebhook(@Req() req, @Res() res: Response) {
    return this.paymentsService.stripeWebhook(req, res);
  }
}
