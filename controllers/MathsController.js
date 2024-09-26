import CourseModel from '../models/course.js';
import Repository from '../models/repository.js';
import Controller from './Controller.js';
import { missingKeys } from '../utilities.js';
import { factorial, isPrime, findPrime } from '../mathUtilities.js';

export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
    }

    throw(error_message) {
        this.HttpContext.payload["error"] = error_message;
        this.HttpContext.response.JSON(this.HttpContext.payload);
        return;
    }

    async get() {
        if (missingKeys(this.HttpContext.payload, ["op"])) {
            this.throw("'op' parameter is missing");
            return;
        }

        // Url '+' sign is converted to ' ' by the browser, so we need to convert it back
        if (this.HttpContext.payload["op"] == " ") {
            this.HttpContext.payload["op"] = "+";
        }

        let operations = {
            "+": this.add,
            "-": this.subtract,
            "*": this.multiply,
            "/": this.divide,
            "%": this.modulo,
            "!": this.factorial,
            "n": this.isPrime,
            "np": this.nthPrime
        };

        // Check if the operation is valid
        let operation = operations[this.HttpContext.payload["op"]];
        if (!operation) {
            this.throw("'op' parameter is not valid.");
            return;
        }

        // Perform the operation
        await operation(this.HttpContext.payload).then((result) => {
            this.HttpContext.payload["value"] = result;
            this.HttpContext.response.JSON(this.HttpContext.payload);
        }).catch((error) => {
            this.throw(error);
        });
    }

    post() {
        this.HttpContext.response.notImplemented("POST method is not supported");
    }

    put() {
        this.HttpContext.response.notImplemented("PUT method is not supported");
    }

    delete() {
        this.HttpContext.response.notImplemented("DELETE method is not supported");
    }

    add(payload) {
        return new Promise((resolve, reject) => {

            let missingKey = missingKeys(payload, ["x", "y"]);
            if (missingKey)
                reject(`'${missingKey}' parameter is missing`);

            let x = parseFloat(payload.x);
            if (isNaN(x))
                reject("'x' parameter is not a number");

            let y = parseFloat(payload.y);
            if (isNaN(y))
                reject("'y' parameter is not a number");

            resolve(x + y);
        });
    }

    subtract(payload) {
        return new Promise((resolve, reject) => {

            let missingKey = missingKeys(payload, ["x", "y"]);
            if (missingKey)
                reject(`'${missingKey}' parameter is missing`);

            let x = parseFloat(payload.x);
            if (isNaN(x))
                reject("'x' parameter is not a number");

            let y = parseFloat(payload.y);
            if (isNaN(y))
                reject("'y' parameter is not a number");

            resolve(x - y);
        });
    }

    multiply(payload) {
        return new Promise((resolve, reject) => {

            let missingKey = missingKeys(payload, ["x", "y"]);
            if (missingKey)
                reject(`'${missingKey}' parameter is missing`);

            let x = parseFloat(payload.x);
            if (isNaN(x))
                reject("'x' parameter is not a number");

            let y = parseFloat(payload.y);
            if (isNaN(y))
                reject("'y' parameter is not a number");

            resolve(x * y);
        });
    }

    divide(payload) {
        return new Promise((resolve, reject) => {

            let missingKey = missingKeys(payload, ["x", "y"]);
            if (missingKey)
                reject(`'${missingKey}' parameter is missing`);

            let x = parseFloat(payload.x);
            if (isNaN(x))
                reject("'x' parameter is not a number");

            let y = parseFloat(payload.y);
            if (isNaN(y))
                reject("'y' parameter is not a number");

            if (y == 0)
                (x == 0) ? resolve("NaN") : resolve("Infinity");

            resolve(x / y);
        });
    }

    modulo(payload) {
        return new Promise((resolve, reject) => {

            let missingKey = missingKeys(payload, ["x", "y"]);
            if (missingKey)
                reject(`'${missingKey}' parameter is missing`);

            let x = parseFloat(payload.x);
            if (isNaN(x))
                reject("'x' parameter is not a number");

            let y = parseFloat(payload.y);
            if (isNaN(y))
                reject("'y' parameter is not a number");

            if (y == 0)
                resolve("NaN");

            resolve(x % y);
        });
    }

    factorial(payload) {
        return new Promise((resolve, reject) => {

            let missingKey = missingKeys(payload, ["n"]);
            if (missingKey)
                reject(`'${missingKey}' parameter is missing`);

            let n = parseFloat(payload.n);
            if (isNaN(n))
                reject("'n' parameter is not a number");

            if (n%1 != 0 || n < 0)
                reject("'n' parameter must be an integer > 0");

            resolve(factorial(n));
        });
    }

    isPrime(payload) {
        return new Promise((resolve, reject) => {

            let missingKey = missingKeys(payload, ["n"]);
            if (missingKey)
                reject(`'${missingKey}' parameter is missing`);

            let n = parseFloat(payload.n);
            if (isNaN(n))
                reject("'n' parameter is not a number");

            if (n%1 != 0 || n < 0)
                reject("'n' parameter must be an integer > 0");

            resolve(isPrime(n));
        });
    }

    nthPrime(payload) {
        return new Promise((resolve, reject) => {
            
            let missingKey = missingKeys(payload, ["n"]);
            if (missingKey)
                reject(`'${missingKey}' parameter is missing`);

            let n = parseFloat(payload.n);
            if (isNaN(n))
                reject("'n' parameter is not a number");

            if (n%1 != 0 || n < 0)
                reject("'n' parameter must be an integer > 0");

            resolve(findPrime(n));
        });
    }
}