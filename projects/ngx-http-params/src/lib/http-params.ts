import { HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';

class CustomHttpParamEncoder extends HttpUrlEncodingCodec {
  encodeValue(value: string | Date | number): string {
    if (value === undefined || value === null) {
      return '';
    }
    return encodeURIComponent(value instanceof Date ? value.toISOString() : value);
  }
}

const encoder = new CustomHttpParamEncoder();

export function httpParams(dto: Record<string, any>): HttpParams {
  return new HttpParams({
    fromObject: fromEntries(flattenObject(dto)),
    encoder,
  });
}

export function flattenObject(obj: object, prefix = ''): [string, any][] {
  const entries: [string, any][] = [];
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)) {
      entries.push(...flattenObject(value, `${prefix}${key}.`));
    } else if (value !== undefined) {
      entries.push([prefix + key, value]);
    }
  });

  return entries;
}

function fromEntries(entries: [string, any][]): Record<string, any> {
  const obj: Record<string, any> = {};
  entries.forEach(([key, value]) => obj[key] = value);
  return obj;
}
