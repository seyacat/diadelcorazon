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
//# sourceMappingURL=index.js.map