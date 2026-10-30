import Ajv, { type JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';

/** Contratos (JSON Schema) esperados da API. Garantem estrutura e tipos, não só o status HTTP. */
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
}

export const productSchema: JSONSchemaType<Product> = {
  type: 'object',
  required: ['id', 'title', 'description', 'category', 'price', 'discountPercentage', 'rating', 'stock'],
  properties: {
    id: { type: 'integer', minimum: 1 },
    title: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    category: { type: 'string', minLength: 1 },
    price: { type: 'number', exclusiveMinimum: 0 },
    discountPercentage: { type: 'number', minimum: 0, maximum: 100 },
    rating: { type: 'number', minimum: 0, maximum: 5 },
    stock: { type: 'integer', minimum: 0 },
  },
  additionalProperties: true,
};

export interface ProductList {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const productListSchema: JSONSchemaType<ProductList> = {
  type: 'object',
  required: ['products', 'total', 'skip', 'limit'],
  properties: {
    products: { type: 'array', items: productSchema },
    total: { type: 'integer', minimum: 0 },
    skip: { type: 'integer', minimum: 0 },
    limit: { type: 'integer', minimum: 0 },
  },
  additionalProperties: true,
};

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export const loginSchema: JSONSchemaType<LoginResponse> = {
  type: 'object',
  required: ['id', 'username', 'email', 'accessToken', 'refreshToken'],
  properties: {
    id: { type: 'integer' },
    username: { type: 'string' },
    email: { type: 'string', format: 'email' },
    accessToken: { type: 'string', minLength: 20 },
    refreshToken: { type: 'string', minLength: 20 },
  },
  additionalProperties: true,
};

/** Valida um payload contra o schema e devolve os erros legíveis (lista vazia = contrato respeitado). */
export function validateContract<T>(schema: JSONSchemaType<T>, data: unknown): string[] {
  const validate = ajv.compile(schema);
  return validate(data) ? [] : (validate.errors ?? []).map((e) => `${e.instancePath || '(raiz)'} ${e.message}`);
}
