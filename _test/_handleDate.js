const HandleDate = require("../scripts/handleDate.js");

class _handleDate {
    runTests() {
        Object.keys(this.#tests).forEach((test) => {
            this.#tests[test]();
        })
    }

    #tests = {
        test_func: () => {
            const handleDate = new HandleDate();
            console.log("Teste feito");
        }
    }
}

const test = new _handleDate();
test.runTests();
