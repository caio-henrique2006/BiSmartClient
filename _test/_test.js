const _test = {
    log_start_test: (title) => {
        console.group("\x1b[34m" + title);
    },
    log_end_test: () => {
        console.groupEnd();
    },
    log_passed: (id) => {
        console.log("\x1b[32mpassed test " + id + "\x1b[0m");
    },
    log_exception: (id) => {
        console.log("\x1b[31mexception test " + id+ "\x1b[0m");
    }
};

module.exports = _test;