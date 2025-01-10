
class HandleDate {
    checkDate(data_inicio, data_fim) {
        if (
        this.IsFormatMonth(data_inicio, data_fim) &&
        this.inicioIsBeforeFim(data_inicio, data_fim)
        ) {
            return true;
        } else {
            return false;
        }
    }

    isFormatMonth(data_inicio, data_fim) {

    }

    inicioIsBeforeFim(data_inicio, data_fim) {

    }
}

module.exports = HandleDate;