declare module "*.css";

// apollo-upload-client ships plain .mjs files typed via JSDoc (`@ts-check`),
// not a .d.ts - TypeScript can only pick those up with `module`/
// `moduleResolution` settings this project doesn't use (see its readme).
// Typed narrowly to the constructor options this project actually passes,
// rather than falling back to `any`.
declare module "apollo-upload-client/UploadHttpLink.mjs" {
  import { ApolloLink } from "@apollo/client/link";

  interface UploadHttpLinkOptions {
    uri?: string;
    credentials?: string;
    headers?: Record<string, string>;
  }

  export default class UploadHttpLink extends ApolloLink {
    constructor(options?: UploadHttpLinkOptions);
  }
}