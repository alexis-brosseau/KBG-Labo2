import Controller from './Controller.js';
import { findMissingKeys, findExcessKeys } from '../utilities.js';
import { factorial, isPrime, findPrime } from '../mathUtilities.js';
import fs from 'fs';

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

        
        if (this.HttpContext.payload == null) {
            if(this.HttpContext.path.queryString == '?'){
                let content = fs.readFileSync("./wwwroot/MathsTests/help.html");
                this.HttpContext.response.content("text/html", content);
            }
            else {
                let content = fs.readFileSync("./wwwroot/MathsTests/index.html");
                this.HttpContext.response.content("text/html", content);
            }
            return;
        }

        if (findMissingKeys(this.HttpContext.payload, ["op"])) {
            this.throw("'op' parameter is missing");
            return;
        }
        

        // Url '+' sign is converted to ' ' by the browser, so we need to convert it back
        if (this.HttpContext.payload["op"] == " ") {
            this.HttpContext.payload["op"] = "+";
        }

        let operations = {
            "+": () => this.add(),
            "-": () => this.subtract(),
            "*": () => this.multiply(),
            "/": () => this.divide(),
            "%": () => this.modulo(),
            "!": () => this.factorial(),
            "p": () => this.isPrime(),
            "np": () => this.nthPrime()
        };

        // Check if the operation is valid
        let operation = operations[this.HttpContext.payload["op"]];
        if (!operation) {
            this.throw("'op' parameter is not valid");
            return;
        }

        // Perform the operation
        await operation().then((result) => {
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

    verifyPayload(keys) {
        let missingKey = findMissingKeys(this.HttpContext.payload, keys);
        if (missingKey)
            return `'${missingKey}' parameter is missing`;
        
        let excessKey = findExcessKeys(this.HttpContext.payload, ["op", ...keys]);
        if (excessKey)
            return `Too many parameters`;
        
        return null;
    }

    add() {
        return new Promise((resolve, reject) => {

            let payloadError = this.verifyPayload(["x", "y"]);
            if (payloadError != null)
                reject(payloadError);

            let x = parseFloat(this.HttpContext.payload.x);
            if (isNaN(x))
                reject("'x' parameter is not a number");

            let y = parseFloat(this.HttpContext.payload.y);
            if (isNaN(y))
                reject("'y' parameter is not a number");

            resolve(x + y);
        });
    }

    subtract() {
        return new Promise((resolve, reject) => {

            let payloadError = this.verifyPayload(["x", "y"]);
            if (payloadError != null)
                reject(payloadError);

            let x = parseFloat(this.HttpContext.payload.x);
            if (isNaN(x))
                reject("'x' parameter is not a number");

            let y = parseFloat(this.HttpContext.payload.y);
            if (isNaN(y))
                reject("'y' parameter is not a number");

            resolve(x - y);
        });
    }

    multiply() {
        return new Promise((resolve, reject) => {

            let payloadError = this.verifyPayload(["x", "y"]);
            if (payloadError != null)
                reject(payloadError);

            let x = parseFloat(this.HttpContext.payload.x);
            if (isNaN(x))
                reject("'x' parameter is not a number");

            let y = parseFloat(this.HttpContext.payload.y);
            if (isNaN(y))
                reject("'y' parameter is not a number");

            resolve(x * y);
        });
    }

    divide() {
        return new Promise((resolve, reject) => {

            let payloadError = this.verifyPayload(["x", "y"]);
            if (payloadError != null)
                reject(payloadError);

            let x = parseFloat(this.HttpContext.payload.x);
            if (isNaN(x))
                reject("'x' parameter is not a number");

            let y = parseFloat(this.HttpContext.payload.y);
            if (isNaN(y))
                reject("'y' parameter is not a number");

            if (y == 0)
                (x == 0) ? resolve("NaN") : resolve("Infinity");

            resolve(x / y);
        });
    }

    modulo() {
        return new Promise((resolve, reject) => {

            let payloadError = this.verifyPayload(["x", "y"]);
            if (payloadError != null)
                reject(payloadError);

            let x = parseFloat(this.HttpContext.payload.x);
            if (isNaN(x))
                reject("'x' parameter is not a number");

            let y = parseFloat(this.HttpContext.payload.y);
            if (isNaN(y))
                reject("'y' parameter is not a number");

            if (y == 0)
                resolve("NaN");

            resolve(x % y);
        });
    }

    factorial() {
        return new Promise((resolve, reject) => {

            let payloadError = this.verifyPayload(["n"]);
            if (payloadError != null)
                reject(payloadError);

            let n = parseFloat(this.HttpContext.payload.n);
            if (isNaN(n))
                reject("'n' parameter is not a number");

            if (n%1 != 0 || n < 1)
                reject("'n' parameter must be an integer > 0");

            resolve(factorial(n));
        });
    }

    isPrime() {
        return new Promise((resolve, reject) => {

            let payloadError = this.verifyPayload(["n"]);
            if (payloadError != null)
                reject(payloadError);

            let n = parseFloat(this.HttpContext.payload.n);
            if (isNaN(n))
                reject("'n' parameter is not a number");

            if (n%1 != 0 || n < 1)
                reject("'n' parameter must be an integer > 0");

            resolve(isPrime(n));
        });
    }

    nthPrime() {
        return new Promise((resolve, reject) => {
            
            let payloadError = this.verifyPayload(["n"]);
            if (payloadError != null)
                reject(payloadError);

            let n = parseFloat(this.HttpContext.payload.n);
            if (isNaN(n))
                reject("'n' parameter is not a number");

            if (n%1 != 0 || n < 1)
                reject("'n' parameter must be an integer > 0");

            resolve(findPrime(n));
        });
    }
}