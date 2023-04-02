import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimBodyValuesPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (this.isObject(value) && metadata.type === 'body') {
      return this.trim(value);
    }
  }

  private isObject(value) {
    return typeof value === 'object' && Object.keys(value).length;
  }

  private trim(value: object) {
    Object.keys(value).forEach((key) => {
      if (typeof value[key] === 'string') {
        value[key] = value[key].trim();
      }
    });

    return value;
  }
}
