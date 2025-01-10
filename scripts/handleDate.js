const { isMatch, isBefore, isEqual } = require("date-fns");

class HandleDate {
    month_format = "yyyy-MM";

    checkDate(data_inicio, data_fim) {
        try {
            return (
                this.isFormatMonth(data_inicio, data_fim) &&
                this.inicioIsBeforeFim(data_inicio, data_fim)
            );
        } catch (e) {
            return false;
        }
    }

    isFormatMonth(data_inicio, data_fim) {
        return (
            isMatch(data_inicio, this.month_format) &&
            isMatch(data_fim, this.month_format)
        );
    }

    inicioIsBeforeFim(data_inicio, data_fim) {
        return (isBefore(data_inicio, data_fim) || isEqual(data_inicio, data_fim));
    }
}

module.exports = HandleDate;