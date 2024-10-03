import Controller from './Controller.js';
import { findMissingKeys, findExcessKeys } from '../utilities.js';
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
        if (findMissingKeys(this.HttpContext.payload, ["op"])) {
            this.throw(this.HttpContext.payload);
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
            this.throw("'op' parameter is not valid.");
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
        let excessKey = findExcessKeys(this.HttpContext.payload, ["op", ...keys]);
        if (excessKey)
            return `'${excessKey}' too many parameters`;

        let missingKey = findMissingKeys(this.HttpContext.payload, keys);
        if (missingKey)
            return `'${missingKey}' parameter is missing`;
        
        return null;
    }

    parseFloats(keys) {
        return new Promise((resolve, reject) => {
            let params = {};
            for (let key of keys) {
                let value = parseFloat(this.HttpContext.payload[key]);
                if (isNaN(value)) {
                    reject(`'${this.HttpContext.payload[key]}' parameter is not a number`);
                    return;
                }
                params[key] = value;
            }
            resolve(params);
        });
    }

    add() {
        return new Promise(async (resolve, reject) => {
            let payloadError = this.verifyPayload(["x", "y"]);
            if (payloadError != null) 
                reject(payloadError);
    
            let params = await this.parseFloats(["x", "y"])
            .catch((error) => {
                reject(error);
            });
    
            resolve(params.x + params.y);
        });
    }
    

    subtract() {
        return new Promise(async (resolve, reject) => {
            let payloadError = this.verifyPayload(["x", "y"]);
            if (payloadError != null) 
                return reject(payloadError);
    
            let params = await this.parseFloats(["x", "y"]).catch((error) => {
                return reject(error);
            });
    
            if (!params) return reject("Parameters 'x' or 'y' are undefined.");
            resolve(params.x - params.y);
        });
    }
    

    multiply() {
        return new Promise(async (resolve, reject) => {

            let payloadError = this.verifyPayload(["x", "y"]);
            if (payloadError != null)
                reject(payloadError);

            let params = await this.parseFloats(["x", "y"])
            .catch((error) => {
                reject(error);
            });

            resolve(params.x * params.y);
        });
    }

    divide() {
        return new Promise(async (resolve, reject) => {

            let payloadError = this.verifyPayload(["x", "y"]);
            if (payloadError != null)
                reject(payloadError);

            let params = await this.parseFloats(["x", "y"])
            .catch((error) => {
                reject(error);
            });

            if (params.y == 0)
                (params.x == 0) ? resolve("NaN") : resolve("Infinity");

            resolve(params.x / params.y);
        });
    }

    modulo() {
        return new Promise(async (resolve, reject) => {

            let payloadError = this.verifyPayload(["x", "y"]);
            if (payloadError != null)
                reject(payloadError);

            let params = await this.parseFloats(["x", "y"])
            .catch((error) => {
                reject(error);
            });

            if (params.y == 0)
                resolve("NaN");

            resolve(params.x % params.y);
        });
    }

    factorial() {
        return new Promise(async (resolve, reject) => {

            let payloadError = this.verifyPayload(["x", "y"]);
            if (payloadError != null)
                reject(payloadError);

            let params = await this.parseFloats(["x", "y"])
            .catch((error) => {
                reject(error);
            });

            if (params.n%1 != 0 || params.n < 1)
                reject("'n' parameter must be an integer > 0");

            resolve(factorial(params.n));
        });
    }

    isPrime() {
        return new Promise(async (resolve, reject) => {

            let payloadError = this.verifyPayload(["x", "y"]);
            if (payloadError != null)
                reject(payloadError);

            let params = await this.parseFloats(["x", "y"])
            .catch((error) => {
                reject(error);
            });

            if (params.n%1 != 0 || params.n < 1)
                reject("'n' parameter must be an integer > 0");

            resolve(isPrime(params.n));
        });
    }

    nthPrime() {
        return new Promise(async (resolve, reject) => {
            
            let payloadError = this.verifyPayload(["x", "y"]);
            if (payloadError != null)
                reject(payloadError);

            let params = await this.parseFloats(["x", "y"])
            .catch((error) => {
                reject(error);
            });

            if (params.n%1 != 0 || params.n < 1)
                reject("'n' parameter must be an integer > 0");

            resolve(findPrime(params.n));
        });
    }
}