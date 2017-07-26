export default {
  methods: {
    // Format date as per system setup
    formatDate: function(date, format){
      return moment(date).format(getJSDateFormat(format));
    },

    // Format date as per system setup
    formatTime: function(date, format){
      return moment(date).format(getJSTimeFormat(format));
    },
  }
}
