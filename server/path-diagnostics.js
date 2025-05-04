const { parse, tokensToFunction, compile } = require('path-to-regexp');

const routePaths = [
  "/api/products",
  "/api/income",
  "/api/queries",
  "/api/users",
  "/api/sales",
  "/api/analytics",
  "/api/auth",
  "/api/products/:productId",
  "/api/orders/:orderId",
  "/admin/[settings]",
  "/posts/:slug/comments/:commentId",
  "/malformed/[path",
  "/another/:example}/bad",
  "/",
  "/products",
  "/welcome",
  "/queries",
  "/income",
  "/shop",
  "/cart",
  "/query",
  "/login",
  "/sales",
  "/analytics",
  "/report"
  // Add your real route paths here
];

console.log("🧪 Starting route path diagnostics...\n");

routePaths.forEach((path, index) => {
  console.log(`🔍 Testing route [${index}]: "${path}"`);

  try {
    const tokens = parse(path);
    console.log("✅ parse() passed");

    const fn = tokensToFunction(tokens);
    console.log("✅ tokensToFunction() passed");

    const toPath = compile(path);
    console.log("✅ compile() passed");

    // Create mock parameters for dynamic segments
    const mockParams = {};
    tokens.forEach(t => {
      if (typeof t === 'object' && t.name) {
        mockParams[t.name] = '123';
      }
    });

    const generated = toPath(mockParams);
    console.log(`📦 Generated path: ${generated}\n`);
  } catch (err) {
    console.error("❌ Error with path:", path);
    console.error("🔻 Stack Trace:", err.stack);
    console.error("🔴 Error Message:", err.message);
    console.log("——————————————————————————————\n");
  }
});
