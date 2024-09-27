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
//# sourceMappingURL=arrayMatrix.js.map