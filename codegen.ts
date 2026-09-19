import type { CodegenConfig } from "@graphql-codegen/cli";

// Generates typed operations from src/graphql/**/*.graphql into
// src/graphql/generated/ (run: `pnpm codegen`, or `pnpm codegen:watch`).
//
// The schema is read LIVE from the backend, so the Go server must be running
// (make it reachable, then run codegen). Override the URL with
// GRAPHQL_SCHEMA_URL; otherwise it falls back to NEXT_PUBLIC_GRAPHQL_URL from
// .env, then to the local default. The codegen CLI does not load .env itself,
// so it is loaded here (Node >= 20.12).
try {
  process.loadEnvFile(".env");
} catch {
  // No .env file - fall through to the environment / default below.
}

const schemaUrl =
  process.env.GRAPHQL_SCHEMA_URL ??
  process.env.NEXT_PUBLIC_GRAPHQL_URL ??
  "http://localhost:8090/query";

const config: CodegenConfig = {
  schema: schemaUrl,
  documents: ["src/graphql/**/*.graphql"],
  ignoreNoDocuments: true,
  generates: {
    "./src/graphql/generated/": {
      preset: "client",
      presetConfig: {
        // Off on purpose. Masked types hide every fragment field behind an
        // opaque ref that only `useFragment` can open, but Apollo Client does
        // not mask the runtime data (dataMasking is off), so masked types
        // would hide fields that are really there. Flat types match what you
        // actually receive.
        fragmentMasking: false,
      },
      config: {
        useTypeImports: true,
        enumsAsTypes: true,
        // Fail generation on any custom scalar that is not mapped below,
        // instead of silently typing it `any`/`unknown`.
        strictScalars: true,
        // How each scalar looks on the wire (JSON has no Date/BigInt) -
        // keep in sync with graph/schema/scalars.graphqls in the backend.
        scalars: {
          // Opaque string IDs (UUIDs). Without this, inputs accept
          // `string | number`.
          ID: { input: "string", output: "string" },
          // ISO-8601 timestamp, e.g. "2026-09-16T23:25:15.349433+05:30".
          Time: { input: "string", output: "string" },
          // Serialised as a plain JSON number (file sizes). Safe up to 2^53.
          Int64: { input: "number", output: "number" },
          // Free-form JSON (e.g. flowchart data): narrow it at the use site.
          JSON: { input: "unknown", output: "unknown" },
          // Multipart upload; the server never returns one.
          Upload: { input: "File", output: "never" },
        },
      },
    },
  },
};

export default config;
