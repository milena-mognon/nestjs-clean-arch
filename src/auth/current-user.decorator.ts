import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserPayload } from './jwt.strategy';

// criando um decorator para um método
export const CurrentUser = createParamDecorator(
  // primeiro parâmetro é o que é passado diretamente para o decorator Ex. @AuthGuard('jwt'), 'jwt' seria o primeiro parâmetro
  // segundo parâmetro é o contexto da requisição. consegue pegar qual classe, qual método está aplicado, etc
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.user as UserPayload;
  },
);
