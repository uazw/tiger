
module.exports = {
    cron: "*/5 * * * * *",
    state: {count: 0},
    handler: ({count}) => {
      console.log(`${count++}`);
      return {count}
    }
}