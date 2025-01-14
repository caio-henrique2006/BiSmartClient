const handleDate = require("../scripts/handleDate.js");
const _test = require("./_test.js");

class _handleDate {
    runTests() {
        _test.log_start_test("handleDate");
        Object.keys(this.#tests).forEach((test) => {
            _test.log_start_test("Teste: " + test);
            this.#tests[test]();
            _test.log_end_test();
        });
        _test.log_end_test("handleDate");
    }

    #tests = {
        checkDate: () => {
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
        },
        completeInicioFimDate: () => {
            const test_cases = [
                {
                    data_inicio: "2024-01",
                    data_fim: "2024-01",
                    json_obj: "complete_data_inicio",
                    expected: "2024-01-01"
                },
                {
                    data_inicio: "2024-01",
                    data_fim: "2024-01",
                    json_obj: "complete_data_fim",
                    expected: "2024-01-31"
                },
                {
                    data_inicio: "2024-02",
                    data_fim: "2024-02",
                    json_obj: "complete_data_inicio",
                    expected: "2024-02-01"
                },
                {
                    data_inicio: "2024-02",
                    data_fim: "2024-02",
                    json_obj: "complete_data_fim",
                    expected: "2024-02-29"
                },
                {
                    data_inicio: "2025-02",
                    data_fim: "2025-02",
                    json_obj: "complete_data_fim",
                    expected: "2025-02-28"
                },
                {
                    data_inicio: "2024-12",
                    data_fim: "2024-12",
                    json_obj: "complete_data_fim",
                    expected: "2024-12-31"
                },{
                    data_inicio: "2024-12",
                    data_fim: "2025-01",
                    json_obj: "complete_data_fim",
                    expected: "2025-01-31"
                },
            ]
            let counter = 0;
            test_cases.forEach((test) => {
                try {
                    counter += 1;
                    if (test.expected == handleDate.completeInicioFimDate(test.data_inicio, test.data_fim)[test.json_obj]) {
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
        },
        getListOfMonths: () => {
            const test_cases = [
                {
                    data_inicio: "2024-01",
                    data_fim: "2024-06",
                    obs: "length",
                    expected: 6
                },
                {
                    data_inicio: "2024-01",
                    data_fim: "2024-01",
                    obs: "length",
                    expected: 1
                },
            ]
            let counter = 0;
            test_cases.forEach((test) => {
                try {
                    counter += 1;
                    if (test.expected == handleDate.getListOfMonths(test.data_inicio, test.data_fim)[test.obs]) {
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
