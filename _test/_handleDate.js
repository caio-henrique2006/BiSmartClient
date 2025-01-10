const HandleDate = require("../scripts/handleDate.js");
const _test = require("./_test.js");

class _handleDate {
    runTests() {
        Object.keys(this.#tests).forEach((test) => {
            _test.log_start_test("Teste: " + test);
            this.#tests[test]();
            _test.log_end_test();
        })
    }

    #tests = {
        checkDate: () => {
            const handleDate = new HandleDate();
            const test_cases = [
                {
                    data_inicio: "",
                    data_fim: "",
                    expected: false
                },
                {
                    data_inicio: "",
                    data_fim: "2024-01",
                    expected: false
                },
                {
                    data_inicio: null,
                    data_fim: null,
                    expected: false
                },
                {
                    data_inicio: 2024,
                    data_fim: 2024,
                    expected: false
                },
                {
                    data_inicio: "2024-01",
                    data_fim: "2024-00",
                    expected: false
                },
                {
                    data_inicio: "2024-01",
                    data_fim: "2024-01",
                    expected: true
                },
                {
                    data_inicio: "2024-01-01",
                    data_fim: "2024-01-01",
                    expected: false
                },
                {
                    data_inicio: "2024-03-",
                    data_fim: "2024-04-",
                    expected: false
                },
                {
                    data_inicio: "2024-13",
                    data_fim: "2024-12",
                    expected: false
                },
                {
                    data_inicio: "2024-10",
                    data_fim: "2024-09",
                    expected: false
                },
                {
                    data_inicio: "2023-09",
                    data_fim: "2024-09",
                    expected: true
                },
            ]
            let counter = 0;
            test_cases.forEach((test) => {
                try {
                    counter += 1;
                    if (test.expected == handleDate.checkDate(test.data_inicio, test.data_fim)) {
                        _test.log_passed(counter);
                    } else {
                        _test.log_exception(counter);
                    }
                } catch (e) {
                    if (test.expected) {
                        _test.log_exception(counter);
                    } else {
                        _test.log_passed(counter);
                    }
                } 
            })
        }
    }
}

const instance = new _handleDate();
instance.runTests();
