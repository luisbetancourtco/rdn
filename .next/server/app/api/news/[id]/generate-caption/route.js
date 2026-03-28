"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/news/[id]/generate-caption/route";
exports.ids = ["app/api/news/[id]/generate-caption/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("worker_threads");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("node:fs");

/***/ }),

/***/ "node:stream":
/*!******************************!*\
  !*** external "node:stream" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:stream");

/***/ }),

/***/ "node:stream/web":
/*!**********************************!*\
  !*** external "node:stream/web" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("node:stream/web");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fnews%2F%5Bid%5D%2Fgenerate-caption%2Froute&page=%2Fapi%2Fnews%2F%5Bid%5D%2Fgenerate-caption%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnews%2F%5Bid%5D%2Fgenerate-caption%2Froute.ts&appDir=%2Fhome%2Falfred%2Fproyectos%2Fradar%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Falfred%2Fproyectos%2Fradar&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fnews%2F%5Bid%5D%2Fgenerate-caption%2Froute&page=%2Fapi%2Fnews%2F%5Bid%5D%2Fgenerate-caption%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnews%2F%5Bid%5D%2Fgenerate-caption%2Froute.ts&appDir=%2Fhome%2Falfred%2Fproyectos%2Fradar%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Falfred%2Fproyectos%2Fradar&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_alfred_proyectos_radar_app_api_news_id_generate_caption_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/news/[id]/generate-caption/route.ts */ \"(rsc)/./app/api/news/[id]/generate-caption/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/news/[id]/generate-caption/route\",\n        pathname: \"/api/news/[id]/generate-caption\",\n        filename: \"route\",\n        bundlePath: \"app/api/news/[id]/generate-caption/route\"\n    },\n    resolvedPagePath: \"/home/alfred/proyectos/radar/app/api/news/[id]/generate-caption/route.ts\",\n    nextConfigOutput,\n    userland: _home_alfred_proyectos_radar_app_api_news_id_generate_caption_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/news/[id]/generate-caption/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZuZXdzJTJGJTVCaWQlNUQlMkZnZW5lcmF0ZS1jYXB0aW9uJTJGcm91dGUmcGFnZT0lMkZhcGklMkZuZXdzJTJGJTVCaWQlNUQlMkZnZW5lcmF0ZS1jYXB0aW9uJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGbmV3cyUyRiU1QmlkJTVEJTJGZ2VuZXJhdGUtY2FwdGlvbiUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGYWxmcmVkJTJGcHJveWVjdG9zJTJGcmFkYXIlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRmhvbWUlMkZhbGZyZWQlMkZwcm95ZWN0b3MlMkZyYWRhciZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDd0I7QUFDckc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yYWRhci8/ZTNmMiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvaG9tZS9hbGZyZWQvcHJveWVjdG9zL3JhZGFyL2FwcC9hcGkvbmV3cy9baWRdL2dlbmVyYXRlLWNhcHRpb24vcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL25ld3MvW2lkXS9nZW5lcmF0ZS1jYXB0aW9uL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvbmV3cy9baWRdL2dlbmVyYXRlLWNhcHRpb25cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL25ld3MvW2lkXS9nZW5lcmF0ZS1jYXB0aW9uL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL2hvbWUvYWxmcmVkL3Byb3llY3Rvcy9yYWRhci9hcHAvYXBpL25ld3MvW2lkXS9nZW5lcmF0ZS1jYXB0aW9uL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9uZXdzL1tpZF0vZ2VuZXJhdGUtY2FwdGlvbi9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fnews%2F%5Bid%5D%2Fgenerate-caption%2Froute&page=%2Fapi%2Fnews%2F%5Bid%5D%2Fgenerate-caption%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnews%2F%5Bid%5D%2Fgenerate-caption%2Froute.ts&appDir=%2Fhome%2Falfred%2Fproyectos%2Fradar%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Falfred%2Fproyectos%2Fradar&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/news/[id]/generate-caption/route.ts":
/*!*****************************************************!*\
  !*** ./app/api/news/[id]/generate-caption/route.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_session__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/session */ \"(rsc)/./lib/session.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var _lib_caption__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/caption */ \"(rsc)/./lib/caption.ts\");\n\n\n\n\nasync function POST(req, { params }) {\n    const session = await (0,_lib_session__WEBPACK_IMPORTED_MODULE_1__.getSession)();\n    if (!session.authenticated) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Unauthorized\"\n    }, {\n        status: 401\n    });\n    const { id } = await params;\n    const item = await _lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.newsItem.findUnique({\n        where: {\n            id: parseInt(id)\n        }\n    });\n    if (!item) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Not found\"\n    }, {\n        status: 404\n    });\n    const caption = await (0,_lib_caption__WEBPACK_IMPORTED_MODULE_3__.generateCaption)(item.title, item.summary ?? \"\", item.url);\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        caption\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL25ld3MvW2lkXS9nZW5lcmF0ZS1jYXB0aW9uL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQXVEO0FBQ2I7QUFDTDtBQUNVO0FBRXhDLGVBQWVJLEtBQUtDLEdBQWdCLEVBQUUsRUFBRUMsTUFBTSxFQUF1QztJQUMxRixNQUFNQyxVQUFVLE1BQU1OLHdEQUFVQTtJQUNoQyxJQUFJLENBQUNNLFFBQVFDLGFBQWEsRUFBRSxPQUFPUixxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO1FBQUVDLE9BQU87SUFBZSxHQUFHO1FBQUVDLFFBQVE7SUFBSTtJQUU5RixNQUFNLEVBQUVDLEVBQUUsRUFBRSxHQUFHLE1BQU1OO0lBQ3JCLE1BQU1PLE9BQU8sTUFBTVgsK0NBQU1BLENBQUNZLFFBQVEsQ0FBQ0MsVUFBVSxDQUFDO1FBQUVDLE9BQU87WUFBRUosSUFBSUssU0FBU0w7UUFBSTtJQUFFO0lBQzVFLElBQUksQ0FBQ0MsTUFBTSxPQUFPYixxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO1FBQUVDLE9BQU87SUFBWSxHQUFHO1FBQUVDLFFBQVE7SUFBSTtJQUUxRSxNQUFNTyxVQUFVLE1BQU1mLDZEQUFlQSxDQUFDVSxLQUFLTSxLQUFLLEVBQUVOLEtBQUtPLE9BQU8sSUFBSSxJQUFJUCxLQUFLUSxHQUFHO0lBQzlFLE9BQU9yQixxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO1FBQUVTO0lBQVE7QUFDckMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yYWRhci8uL2FwcC9hcGkvbmV3cy9baWRdL2dlbmVyYXRlLWNhcHRpb24vcm91dGUudHM/NzMyZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInXG5pbXBvcnQgeyBnZXRTZXNzaW9uIH0gZnJvbSAnQC9saWIvc2Vzc2lvbidcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gJ0AvbGliL3ByaXNtYSdcbmltcG9ydCB7IGdlbmVyYXRlQ2FwdGlvbiB9IGZyb20gJ0AvbGliL2NhcHRpb24nXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogTmV4dFJlcXVlc3QsIHsgcGFyYW1zIH06IHsgcGFyYW1zOiBQcm9taXNlPHsgaWQ6IHN0cmluZyB9PiB9KSB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXNzaW9uKClcbiAgaWYgKCFzZXNzaW9uLmF1dGhlbnRpY2F0ZWQpIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnVW5hdXRob3JpemVkJyB9LCB7IHN0YXR1czogNDAxIH0pXG5cbiAgY29uc3QgeyBpZCB9ID0gYXdhaXQgcGFyYW1zXG4gIGNvbnN0IGl0ZW0gPSBhd2FpdCBwcmlzbWEubmV3c0l0ZW0uZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGlkOiBwYXJzZUludChpZCkgfSB9KVxuICBpZiAoIWl0ZW0pIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnTm90IGZvdW5kJyB9LCB7IHN0YXR1czogNDA0IH0pXG5cbiAgY29uc3QgY2FwdGlvbiA9IGF3YWl0IGdlbmVyYXRlQ2FwdGlvbihpdGVtLnRpdGxlLCBpdGVtLnN1bW1hcnkgPz8gJycsIGl0ZW0udXJsKVxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBjYXB0aW9uIH0pXG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZ2V0U2Vzc2lvbiIsInByaXNtYSIsImdlbmVyYXRlQ2FwdGlvbiIsIlBPU1QiLCJyZXEiLCJwYXJhbXMiLCJzZXNzaW9uIiwiYXV0aGVudGljYXRlZCIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsImlkIiwiaXRlbSIsIm5ld3NJdGVtIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwicGFyc2VJbnQiLCJjYXB0aW9uIiwidGl0bGUiLCJzdW1tYXJ5IiwidXJsIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/news/[id]/generate-caption/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/caption.ts":
/*!************************!*\
  !*** ./lib/caption.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   generateCaption: () => (/* binding */ generateCaption)\n/* harmony export */ });\n/* harmony import */ var _anthropic_ai_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @anthropic-ai/sdk */ \"(rsc)/./node_modules/@anthropic-ai/sdk/index.mjs\");\n\nlet client = null;\nfunction getClient() {\n    if (!client) client = new _anthropic_ai_sdk__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n        apiKey: process.env.ANTHROPIC_API_KEY\n    });\n    return client;\n}\nconst SYSTEM = `Eres el asistente de contenido de Luis Betancourt, profesional de marketing digital\ncon mas de 20 anos de experiencia basado en Colombia. Luis tiene 18.400+ seguidores\nen LinkedIn y publica sobre marketing digital, growth e IA.\n\nSu voz: directa, reflexiva, sin hype, sin emojis, sin listas de tips. Parrafos cortos\nde 1-2 frases. Una sola idea por post. Cierra con pregunta abierta o reflexion incompleta.\nTono: profesional pero cercano. Nunca suena a vendedor ni coach motivacional.\n\nAl construir el post responde internamente estas cuatro preguntas sin mencionarlas:\n1) A quienes aplica directamente.\n2) Que impacto concreto genera.\n3) Por que ahora es el momento (urgencia real, no forzada).\n4) Como tomar accion para aprovecharlo.\n\nEl post debe fluir naturalmente. Formato: 900-1400 caracteres, texto plano, sin asteriscos,\nsin bullets, sin emojis, en espanol. Devuelve UNICAMENTE el texto del post.`;\nasync function generateCaption(title, summary, url) {\n    const response = await getClient().messages.create({\n        model: \"claude-sonnet-4-6\",\n        max_tokens: 1024,\n        system: SYSTEM,\n        messages: [\n            {\n                role: \"user\",\n                content: `Título: ${title}\\n\\nResumen: ${summary}\\n\\nURL: ${url}`\n            }\n        ]\n    });\n    return response.content[0].text.trim();\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvY2FwdGlvbi50cyIsIm1hcHBpbmdzIjoiOzs7OztBQUF5QztBQUV6QyxJQUFJQyxTQUEyQjtBQUUvQixTQUFTQztJQUNQLElBQUksQ0FBQ0QsUUFBUUEsU0FBUyxJQUFJRCx5REFBU0EsQ0FBQztRQUFFRyxRQUFRQyxRQUFRQyxHQUFHLENBQUNDLGlCQUFpQjtJQUFDO0lBQzVFLE9BQU9MO0FBQ1Q7QUFFQSxNQUFNTSxTQUFTLENBQUM7Ozs7Ozs7Ozs7Ozs7OzsyRUFlMkQsQ0FBQztBQUVyRSxlQUFlQyxnQkFDcEJDLEtBQWEsRUFDYkMsT0FBZSxFQUNmQyxHQUFXO0lBRVgsTUFBTUMsV0FBVyxNQUFNVixZQUFZVyxRQUFRLENBQUNDLE1BQU0sQ0FBQztRQUNqREMsT0FBTztRQUNQQyxZQUFZO1FBQ1pDLFFBQVFWO1FBQ1JNLFVBQVU7WUFDUjtnQkFDRUssTUFBTTtnQkFDTkMsU0FBUyxDQUFDLFFBQVEsRUFBRVYsTUFBTSxhQUFhLEVBQUVDLFFBQVEsU0FBUyxFQUFFQyxJQUFJLENBQUM7WUFDbkU7U0FDRDtJQUNIO0lBQ0EsT0FBTyxTQUFVUSxPQUFPLENBQUMsRUFBRSxDQUFvQ0MsSUFBSSxDQUFDQyxJQUFJO0FBQzFFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmFkYXIvLi9saWIvY2FwdGlvbi50cz84YTIyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBbnRocm9waWMgZnJvbSAnQGFudGhyb3BpYy1haS9zZGsnXG5cbmxldCBjbGllbnQ6IEFudGhyb3BpYyB8IG51bGwgPSBudWxsXG5cbmZ1bmN0aW9uIGdldENsaWVudCgpOiBBbnRocm9waWMge1xuICBpZiAoIWNsaWVudCkgY2xpZW50ID0gbmV3IEFudGhyb3BpYyh7IGFwaUtleTogcHJvY2Vzcy5lbnYuQU5USFJPUElDX0FQSV9LRVkgfSlcbiAgcmV0dXJuIGNsaWVudFxufVxuXG5jb25zdCBTWVNURU0gPSBgRXJlcyBlbCBhc2lzdGVudGUgZGUgY29udGVuaWRvIGRlIEx1aXMgQmV0YW5jb3VydCwgcHJvZmVzaW9uYWwgZGUgbWFya2V0aW5nIGRpZ2l0YWxcbmNvbiBtYXMgZGUgMjAgYW5vcyBkZSBleHBlcmllbmNpYSBiYXNhZG8gZW4gQ29sb21iaWEuIEx1aXMgdGllbmUgMTguNDAwKyBzZWd1aWRvcmVzXG5lbiBMaW5rZWRJbiB5IHB1YmxpY2Egc29icmUgbWFya2V0aW5nIGRpZ2l0YWwsIGdyb3d0aCBlIElBLlxuXG5TdSB2b3o6IGRpcmVjdGEsIHJlZmxleGl2YSwgc2luIGh5cGUsIHNpbiBlbW9qaXMsIHNpbiBsaXN0YXMgZGUgdGlwcy4gUGFycmFmb3MgY29ydG9zXG5kZSAxLTIgZnJhc2VzLiBVbmEgc29sYSBpZGVhIHBvciBwb3N0LiBDaWVycmEgY29uIHByZWd1bnRhIGFiaWVydGEgbyByZWZsZXhpb24gaW5jb21wbGV0YS5cblRvbm86IHByb2Zlc2lvbmFsIHBlcm8gY2VyY2Fuby4gTnVuY2Egc3VlbmEgYSB2ZW5kZWRvciBuaSBjb2FjaCBtb3RpdmFjaW9uYWwuXG5cbkFsIGNvbnN0cnVpciBlbCBwb3N0IHJlc3BvbmRlIGludGVybmFtZW50ZSBlc3RhcyBjdWF0cm8gcHJlZ3VudGFzIHNpbiBtZW5jaW9uYXJsYXM6XG4xKSBBIHF1aWVuZXMgYXBsaWNhIGRpcmVjdGFtZW50ZS5cbjIpIFF1ZSBpbXBhY3RvIGNvbmNyZXRvIGdlbmVyYS5cbjMpIFBvciBxdWUgYWhvcmEgZXMgZWwgbW9tZW50byAodXJnZW5jaWEgcmVhbCwgbm8gZm9yemFkYSkuXG40KSBDb21vIHRvbWFyIGFjY2lvbiBwYXJhIGFwcm92ZWNoYXJsby5cblxuRWwgcG9zdCBkZWJlIGZsdWlyIG5hdHVyYWxtZW50ZS4gRm9ybWF0bzogOTAwLTE0MDAgY2FyYWN0ZXJlcywgdGV4dG8gcGxhbm8sIHNpbiBhc3RlcmlzY29zLFxuc2luIGJ1bGxldHMsIHNpbiBlbW9qaXMsIGVuIGVzcGFub2wuIERldnVlbHZlIFVOSUNBTUVOVEUgZWwgdGV4dG8gZGVsIHBvc3QuYFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVDYXB0aW9uKFxuICB0aXRsZTogc3RyaW5nLFxuICBzdW1tYXJ5OiBzdHJpbmcsXG4gIHVybDogc3RyaW5nLFxuKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBnZXRDbGllbnQoKS5tZXNzYWdlcy5jcmVhdGUoe1xuICAgIG1vZGVsOiAnY2xhdWRlLXNvbm5ldC00LTYnLFxuICAgIG1heF90b2tlbnM6IDEwMjQsXG4gICAgc3lzdGVtOiBTWVNURU0sXG4gICAgbWVzc2FnZXM6IFtcbiAgICAgIHtcbiAgICAgICAgcm9sZTogJ3VzZXInLFxuICAgICAgICBjb250ZW50OiBgVMOtdHVsbzogJHt0aXRsZX1cXG5cXG5SZXN1bWVuOiAke3N1bW1hcnl9XFxuXFxuVVJMOiAke3VybH1gLFxuICAgICAgfSxcbiAgICBdLFxuICB9KVxuICByZXR1cm4gKHJlc3BvbnNlLmNvbnRlbnRbMF0gYXMgeyB0eXBlOiBzdHJpbmc7IHRleHQ6IHN0cmluZyB9KS50ZXh0LnRyaW0oKVxufVxuIl0sIm5hbWVzIjpbIkFudGhyb3BpYyIsImNsaWVudCIsImdldENsaWVudCIsImFwaUtleSIsInByb2Nlc3MiLCJlbnYiLCJBTlRIUk9QSUNfQVBJX0tFWSIsIlNZU1RFTSIsImdlbmVyYXRlQ2FwdGlvbiIsInRpdGxlIiwic3VtbWFyeSIsInVybCIsInJlc3BvbnNlIiwibWVzc2FnZXMiLCJjcmVhdGUiLCJtb2RlbCIsIm1heF90b2tlbnMiLCJzeXN0ZW0iLCJyb2xlIiwiY29udGVudCIsInRleHQiLCJ0cmltIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/caption.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"error\",\n        \"warn\"\n    ] : 0\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE2QztBQUU3QyxNQUFNQyxrQkFBa0JDO0FBRWpCLE1BQU1DLFNBQ1hGLGdCQUFnQkUsTUFBTSxJQUN0QixJQUFJSCx3REFBWUEsQ0FBQztJQUNmSSxLQUFLQyxLQUF5QixHQUFnQjtRQUFDO1FBQVM7S0FBTyxHQUFHLENBQVM7QUFDN0UsR0FBRTtBQUVKLElBQUlBLElBQXlCLEVBQWNKLGdCQUFnQkUsTUFBTSxHQUFHQSIsInNvdXJjZXMiOlsid2VicGFjazovL3JhZGFyLy4vbGliL3ByaXNtYS50cz85ODIyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50J1xuXG5jb25zdCBnbG9iYWxGb3JQcmlzbWEgPSBnbG9iYWxUaGlzIGFzIHVua25vd24gYXMgeyBwcmlzbWE6IFByaXNtYUNsaWVudCB9XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPVxuICBnbG9iYWxGb3JQcmlzbWEucHJpc21hIHx8XG4gIG5ldyBQcmlzbWFDbGllbnQoe1xuICAgIGxvZzogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgPyBbJ2Vycm9yJywgJ3dhcm4nXSA6IFsnZXJyb3InXSxcbiAgfSlcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWFcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWxUaGlzIiwicHJpc21hIiwibG9nIiwicHJvY2VzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ }),

/***/ "(rsc)/./lib/session.ts":
/*!************************!*\
  !*** ./lib/session.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getSession: () => (/* binding */ getSession),\n/* harmony export */   sessionOptions: () => (/* binding */ sessionOptions)\n/* harmony export */ });\n/* harmony import */ var iron_session__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! iron-session */ \"(rsc)/./node_modules/iron-session/dist/index.js\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n\n\nconst sessionOptions = {\n    password: process.env.SESSION_SECRET_KEY,\n    cookieName: \"radar_session\",\n    cookieOptions: {\n        secure: \"development\" === \"production\",\n        maxAge: 60 * 60 * 24 * 30\n    }\n};\nasync function getSession() {\n    return (0,iron_session__WEBPACK_IMPORTED_MODULE_1__.getIronSession)(await (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)(), sessionOptions);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc2Vzc2lvbi50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTZDO0FBQ1A7QUFPL0IsTUFBTUUsaUJBQWlCO0lBQzVCQyxVQUFVQyxRQUFRQyxHQUFHLENBQUNDLGtCQUFrQjtJQUN4Q0MsWUFBWTtJQUNaQyxlQUFlO1FBQ2JDLFFBQVFMLGtCQUF5QjtRQUNqQ00sUUFBUSxLQUFLLEtBQUssS0FBSztJQUN6QjtBQUNGLEVBQUM7QUFFTSxlQUFlQztJQUNwQixPQUFPWCw0REFBY0EsQ0FBYyxNQUFNQyxxREFBT0EsSUFBSUM7QUFDdEQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yYWRhci8uL2xpYi9zZXNzaW9uLnRzPzFkZTEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0SXJvblNlc3Npb24gfSBmcm9tICdpcm9uLXNlc3Npb24nXG5pbXBvcnQgeyBjb29raWVzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJ1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlc3Npb25EYXRhIHtcbiAgYXV0aGVudGljYXRlZD86IGJvb2xlYW5cbiAgbGlua2VkSW5TdGF0ZT86IHN0cmluZ1xufVxuXG5leHBvcnQgY29uc3Qgc2Vzc2lvbk9wdGlvbnMgPSB7XG4gIHBhc3N3b3JkOiBwcm9jZXNzLmVudi5TRVNTSU9OX1NFQ1JFVF9LRVkgYXMgc3RyaW5nLFxuICBjb29raWVOYW1lOiAncmFkYXJfc2Vzc2lvbicsXG4gIGNvb2tpZU9wdGlvbnM6IHtcbiAgICBzZWN1cmU6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicsXG4gICAgbWF4QWdlOiA2MCAqIDYwICogMjQgKiAzMCxcbiAgfSxcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNlc3Npb24oKSB7XG4gIHJldHVybiBnZXRJcm9uU2Vzc2lvbjxTZXNzaW9uRGF0YT4oYXdhaXQgY29va2llcygpLCBzZXNzaW9uT3B0aW9ucylcbn1cbiJdLCJuYW1lcyI6WyJnZXRJcm9uU2Vzc2lvbiIsImNvb2tpZXMiLCJzZXNzaW9uT3B0aW9ucyIsInBhc3N3b3JkIiwicHJvY2VzcyIsImVudiIsIlNFU1NJT05fU0VDUkVUX0tFWSIsImNvb2tpZU5hbWUiLCJjb29raWVPcHRpb25zIiwic2VjdXJlIiwibWF4QWdlIiwiZ2V0U2Vzc2lvbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/session.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/iron-webcrypto","vendor-chunks/iron-session","vendor-chunks/cookie","vendor-chunks/uncrypto","vendor-chunks/formdata-node","vendor-chunks/@anthropic-ai","vendor-chunks/form-data-encoder","vendor-chunks/whatwg-url","vendor-chunks/agentkeepalive","vendor-chunks/tr46","vendor-chunks/web-streams-polyfill","vendor-chunks/node-fetch","vendor-chunks/webidl-conversions","vendor-chunks/ms","vendor-chunks/humanize-ms","vendor-chunks/event-target-shim","vendor-chunks/abort-controller"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fnews%2F%5Bid%5D%2Fgenerate-caption%2Froute&page=%2Fapi%2Fnews%2F%5Bid%5D%2Fgenerate-caption%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnews%2F%5Bid%5D%2Fgenerate-caption%2Froute.ts&appDir=%2Fhome%2Falfred%2Fproyectos%2Fradar%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Falfred%2Fproyectos%2Fradar&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();