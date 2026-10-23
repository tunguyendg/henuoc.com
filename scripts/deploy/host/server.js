// henuoc-app/server.js — Passenger entry (docs/06-DEPLOYMENT.md §3)
process.env.NODE_ENV = "production";
// import() chạy được trong CommonJS và nạp được server.js (CJS) của bản standalone
import("./app/server.js");
