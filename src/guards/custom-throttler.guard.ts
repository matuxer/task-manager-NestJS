import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected errorMessage =
    'Has excedido el límite de solicitudes. Por favor, espera un momento e inténtalo de nuevo.';
}
