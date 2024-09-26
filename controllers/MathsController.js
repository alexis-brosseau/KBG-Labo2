import CourseModel from '../models/course.js';
import Repository from '../models/repository.js';
import Controller from './Controller.js';

export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
    }

    throw(error_message) {
        this.HttpContext.payload["error"] = error_message;
        this.HttpContext.response.JSON(this.HttpContext.payload);
        return;
    }

    missingKeys(object, keys) {
        for (let i = 0; i < keys.length; i++)
            if (!object[keys[i]]) {
                this.throw(`'${keys[i]}' parameter is missing.`)
                return true;
            }
        return false;
    }

    get() {

        let payload = this.HttpContext.payload;
        let response = this.HttpContext.response;

        if (this.missingKeys(payload, ["op"]))
            return;

        switch (payload["op"]) {
            case " ":
                if (this.missingKeys(payload, ["x", "y"]))
                    return;
                
                let x = parseInt(payload.x);
                if (isNaN(x))
                    return this.throw("'x' parameter is not a number");

                let y = parseInt(payload.y);
                if (isNaN(y))
                    return this.throw("'y' parameter is not a number");
                
                payload["op"] = "+"
                payload["value"] = x + y;
                response.JSON(payload);
                return;
            case "-":
                return;
            case "x":
                return;
            case "/":
                return;
            case "%":
                return;
            case "!":
                return;
            case "n":
                return;
            case "np":
                return;
            default:
                this.throw("'op' parameter is not valid.");
                return;
        }
    }
}