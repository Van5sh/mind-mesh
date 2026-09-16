import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../mind-mesh-be/schema/**/*.graphqls",
  documents: ["src/graphql/**/*.graphql"],
  generates: {
    "./src/graphql/generated/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;