import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimFileName',
})
export class TrimFileNamePipe implements PipeTransform {
  transform(fileName: string | null | undefined): string | null | undefined {
    if (!fileName || fileName.lastIndexOf('.') < 11) return fileName;
    return fileName.slice(0, 11) + '...' + fileName.slice(-11);
  }
}
