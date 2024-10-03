const API_URL = "http://localhost:5000/api/maths";
let currentHttpError = "";

function API_getcurrentHttpError() {
    return currentHttpError;
}

function API_RunTest(test) {
    return new Promise(resolve => {
        const params = new URLSearchParams(test).toString();
        $.ajax({
            url: `${API_URL}?${params}`,
            success: result => { 
                currentHttpError = ""; 
                resolve(result); 
            },
            error: (xhr) => { 
                console.log(xhr); 
                currentHttpError = xhr.responseJSON.error_description || "An error occurred";
                resolve(null); 
            }
        });
    });
}

function API_RunAllTests(tests) {
    return Promise.all(tests.map(test => API_RunTest(test)));
}