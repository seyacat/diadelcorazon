(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var matrix = /** @class */ (function () {
    function matrix() {
    }
    matrix.indentity = function (size) {
        var matrix = new Array(size).fill(0).map(function () { return new Array(size).fill(0); });
        for (var i = 0; i < size; i++) {
            matrix[i][i] = 1;
        }
        return matrix;
    };
    matrix.empty = function (rows, cols) {
        var matrix = [];
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                if (!matrix[i])
                    matrix.push([]);
                matrix[i].push(0);
            }
        }
        console.log({ matrix: matrix });
        return matrix;
    };
    matrix.multiply = function (m1, m2) {
        var a = m1;
        var b = m2;
        if (typeof m1[0] === "number") {
            // @ts-ignore
            a = [m1];
        }
        if (typeof m2[0] === "number") {
            // @ts-ignore
            b = m2.map(function (x) { return [x]; });
        }
        var c = matrix.empty(a.length, b[0].length);
        for (var i = 0; i < a.length; i++) {
            for (var j = 0; j < b[0].length; j++) {
                var sum = 0;
                for (var k = 0; k < a[0].length; k++) {
                    sum += a[i][k] * b[k][j];
                }
                c[i][j] = sum;
            }
        }
        return c;
    };
    return matrix;
}());
exports.default = matrix;

},{}],2:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var arrayMatrix_1 = __importDefault(require("../lib/arrayMatrix"));
var canvas;
var ctx;
var imageLoader;
var onDrag = false;
var pointerId = null;
var canvasTransformMatrix = arrayMatrix_1.default.indentity(2);
var items = [];
var resolution = { width: 1024, height: 1024 };
var main = function () {
    var _a, _b, _c;
    canvas = document.getElementById("canvas");
    canvas.width = resolution.width;
    canvas.height = resolution.height;
    resizeCanvas();
    ctx = canvas.getContext("2d");
    //Listeners
    canvas.addEventListener("pointerdown", pointerdown);
    canvas.addEventListener("pointermove", pointermove);
    canvas.addEventListener("pointerup", pointerup);
    //LOAD OBJECTS
    var corona = new Image();
    corona.src = "public/marcob.png";
    addItem({
        id: 1,
        img: corona,
        position: { x: 0, y: 0 },
        w: resolution.width,
        h: resolution.height,
        z: 100,
    });
    var sample = new Image();
    sample.src = "public/sample.png";
    addItem({
        id: 2,
        img: sample,
        position: { x: 0, y: 0 },
        w: resolution.width,
        h: resolution.height,
        z: 1,
    });
    corona.onload = function () {
        refreshCanvas();
    };
    (_a = document.getElementById("takePhotoButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        var _a;
        (_a = document.getElementById("photoLoader")) === null || _a === void 0 ? void 0 : _a.click();
    }, false);
    (_b = document.getElementById("openPhotoButton")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
        var _a;
        (_a = document.getElementById("imageLoader")) === null || _a === void 0 ? void 0 : _a.click();
    }, false);
    (_c = document.getElementById("downloadPhotoButton")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () {
        downloadCanvasAsImage();
    }, false);
    imageLoader = document.getElementById("imageLoader");
    imageLoader === null || imageLoader === void 0 ? void 0 : imageLoader.addEventListener("change", handleImage, false);
    if (localStorage.getItem("image")) {
        showLoadedImage();
    }
};
var handleImage = function (e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var _a;
        showLoadedImage("".concat((_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.result));
    };
    reader.readAsDataURL(e.target.files[0]);
};
var downloadCanvasAsImage = function () {
    var link = document.createElement("a");
    link.download = "DiaCorazon".concat(new Date()
        .toISOString()
        .split("T")[0]
        .replace(/-/g, ""), ".png");
    link.href = canvas.toDataURL();
    link.click();
};
function showLoadedImage(strImage) {
    if (strImage === void 0) { strImage = null; }
    var img = new Image();
    img.onload = function () {
        var aspect = img.width / img.height;
        var w = resolution.width;
        var h = resolution.height;
        if (img.width > img.height) {
            w = h * aspect;
        }
        else {
            h = w / aspect;
        }
        addItem({
            id: 2,
            img: img,
            position: { x: 0, y: (resolution.height - h) / 2 },
            w: w,
            h: h,
            z: 1,
            selected: true,
        });
    };
    if (strImage) {
        img.src = strImage;
    }
    //img.src = localStorage.getItem("image") + "";
}
var resizeCanvas = function () {
    var width = canvas.getBoundingClientRect().width;
    var height = width;
    canvas.style.height = height + "px";
    var sx = resolution.width / width;
    var sy = resolution.height / height;
    canvasTransformMatrix = [
        [sx, 0],
        [0, sy],
    ];
    console.log({ canvasTransformMatrix: canvasTransformMatrix });
};
var addItem = function (newItem) {
    var existentItem = items.find(function (item) { return item.id === newItem.id; });
    if (existentItem) {
        items.splice(items.indexOf(existentItem), 1);
    }
    items.push(newItem);
    sortItems();
    refreshCanvas();
};
var sortItems = function () {
    items.sort(function (a, b) {
        return a.z - b.z;
    });
};
var refreshCanvas = function () {
    if (!ctx)
        return;
    ctx.fillStyle = "white";
    ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, resolution.width, resolution.height);
    ctx.fillRect(0, 0, resolution.width, resolution.height);
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(item.img, item.position.x, item.position.y, item.w, item.h);
    }
};
//CANVAS LISTENERS
var pointerdown = function (e) {
    onDrag = true;
    pointerId = e.pointerId;
    e.preventDefault();
};
var pointermove = function (e) {
    e.preventDefault();
    if (!ctx || !onDrag || pointerId !== e.pointerId)
        return;
    console.log("pointermove", e);
    var position = arrayMatrix_1.default.multiply(canvasTransformMatrix, [
        [e.offsetX],
        [e.offsetY],
    ]).map(function (x) { return x[0]; });
    var delta = arrayMatrix_1.default.multiply(canvasTransformMatrix, [
        [e.movementX],
        [e.movementY],
    ]).map(function (x) { return x[0]; });
    console.log({ canvasTransformMatrix: canvasTransformMatrix, delta: delta });
    ctx.fillStyle = "red";
    ctx.fillRect(position[0] - 10, position[1] - 10, 21, 21);
    var selectItem = items.find(function (item) {
        return item.selected;
    });
    if (selectItem) {
        selectItem.position.x = selectItem.position.x + delta[0];
        selectItem.position.y = selectItem.position.y + delta[1];
        refreshCanvas();
    }
};
var pointerup = function (e) {
    onDrag = false;
    e.preventDefault();
    console.log("pointerup");
};
window.onload = main;
window.onresize = resizeCanvas;
setInterval(function () {
    refreshCanvas();
}, 1000);

},{"../lib/arrayMatrix":1}]},{},[2]);
