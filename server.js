"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//express server
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
console.log(__dirname);
app.use("/public", express_1.default.static(__dirname + "/public"));
app.use("/lib", express_1.default.static(__dirname + "/lib"));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.listen(3000, function () {
    console.log("listening on *:3000");
});
//# sourceMappingURL=server.js.map