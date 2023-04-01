import { BadRequestException } from '@nestjs/common';

interface Error {
  [x: string]: string;
}

export class ValidationException extends BadRequestException {
  constructor(public validationErrors: Error[]) {
    super();
  }
}
