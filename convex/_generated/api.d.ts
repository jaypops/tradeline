/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as checkUserExpiry from "../checkUserExpiry.js";
import type * as deactivateExpiredUsers from "../deactivateExpiredUsers.js";
import type * as generateShareableLink from "../generateShareableLink.js";
import type * as listShareableLinks from "../listShareableLinks.js";
import type * as registerFromShareableLink from "../registerFromShareableLink.js";
import type * as stocks from "../stocks.js";
import type * as users from "../users.js";
import type * as validateShareableLink from "../validateShareableLink.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  checkUserExpiry: typeof checkUserExpiry;
  deactivateExpiredUsers: typeof deactivateExpiredUsers;
  generateShareableLink: typeof generateShareableLink;
  listShareableLinks: typeof listShareableLinks;
  registerFromShareableLink: typeof registerFromShareableLink;
  stocks: typeof stocks;
  users: typeof users;
  validateShareableLink: typeof validateShareableLink;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
