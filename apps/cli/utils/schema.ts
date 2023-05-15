import convert from "@openapi-contrib/json-schema-to-openapi-schema";
import { js2schema } from "js2schema";

/**
 * Infer an OpenAPI schema from a collection of data
 * @param data The data to infer the schema from
 */
export async function inferOpenAPISchema(data: Record<any, any>) {
  // write schema file
  const jsonSchema = js2schema(Object.values(data), {
    title: "",
    shouldConvertNumberString: true,
    typeResolvers: {},
  });
  return await convert(jsonSchema);
}
