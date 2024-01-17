export default {
  getCurrentTime: () => {
    var today = new Date();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time;
  },
};
