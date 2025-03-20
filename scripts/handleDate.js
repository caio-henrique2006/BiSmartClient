const {
  isMatch,
  isBefore,
  isEqual,
  lastDayOfMonth,
  format,
  addMonths,
  differenceInMonths,
} = require("date-fns");

const handleDate = {
  date_format: "yyyy-MM-dd",
  month_format: "yyyy-MM",
  adjust_timezone: "T12:00:00Z",

  getListOfMonths(data_inicio, data_fim) {
    /* differenceInMonths retorna um valor negativo caso: data_inicio < data_fim. 
        Por isso é multiplicado por -1*/
    const list_months = [];
    const amount_months =
      differenceInMonths(
        data_inicio + this.adjust_timezone,
        data_fim + this.adjust_timezone
      ) * -1;
    for (let i = 0; i <= amount_months; i++) {
      current_data_inicio = format(
        addMonths(data_inicio + this.adjust_timezone, i),
        this.month_format
      );
      current_data_fim = format(
        addMonths(data_inicio + this.adjust_timezone, i),
        this.month_format
      );
      const { complete_data_inicio, complete_data_fim } =
        this.completeInicioFimDate(current_data_inicio, current_data_fim);
      list_months.push({
        data_inicio: complete_data_inicio,
        data_fim: complete_data_fim,
      });
    }
    return list_months;
  },

  completeInicioFimDate(data_inicio, data_fim) {
    complete_data_inicio = format(
      new Date(data_inicio + "-01" + this.adjust_timezone),
      this.date_format
    );
    complete_data_fim = format(
      lastDayOfMonth(new Date(data_fim + this.adjust_timezone)),
      this.date_format
    );
    return { complete_data_inicio, complete_data_fim };
  },

  checkDate(data_inicio, data_fim) {
    try {
      return (
        this.isFormatDate(data_inicio, data_fim) &&
        this.inicioIsBeforeFim(data_inicio, data_fim)
      );
    } catch (e) {
      console.log(e);
      return false;
    }
  },

  isFormatMonth(data_inicio, data_fim) {
    return (
      isMatch(data_inicio, this.month_format) &&
      isMatch(data_fim, this.month_format)
    );
  },

  isFormatDate(data_inicio, data_fim) {
    return (
      isMatch(data_inicio, this.date_format) &&
      isMatch(data_fim, this.date_format)
    );
  },

  inicioIsBeforeFim(data_inicio, data_fim) {
    return isBefore(data_inicio, data_fim) || isEqual(data_inicio, data_fim);
  },
};

module.exports = handleDate;
