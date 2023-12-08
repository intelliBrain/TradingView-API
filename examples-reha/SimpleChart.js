const readline = require('readline');
const TradingView = require('../main');

process.stdin.setRawMode(true);
process.stdin.resume(); // Make sure stdin is in readable state

function padNumber(number) {
  return number < 10 ? `0${number}` : number;
}

function convertUnixTimestampToHumanReadable(timestamp) {
  // Convert the timestamp to milliseconds
  const timestampInMilliseconds = timestamp * 1000;

  // Create a Date object from the timestamp
  const date = new Date(timestampInMilliseconds);

  // Extract the year, month, day, hour, minute, and second from the Date object
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are indexed from 0 to 11, so add 1
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  // const second = date.getSeconds();

  // Format the date and time and return the result
  const formattedDate = `${year}.${padNumber(month)}.${padNumber(
    day,
  )} ${padNumber(hour)}:${padNumber(minute)}`;
  return formattedDate;
}

function dumpSessionBars(chart) {
  if (!chart.periods[0]) return;

  for (
    let periodIndex = chart.periods.length - 1;
    periodIndex >= 0;
    periodIndex -= 1
  ) {
    const p = chart.periods[periodIndex];
    const humanReadableDate = convertUnixTimestampToHumanReadable(p.time);

    console.log(
      `[${chart.periods.length}bars] hist: ${chart.infos.name}: ${chart.infos.currency_id}: ${humanReadableDate} (${p.time}): [${periodIndex}]  o=${p.open}, h=${p.max}, l=${p.min}, c=${p.close}`,
    );
  }
}

/**
 * This example creates a BTCEUR daily chart
 */

const client = new TradingView.Client(); // Creates a websocket client

const chart = new client.Session.Chart(); // Init a Chart session

let histDumped = false;

chart.setMarket('FOREXCOM:EURUSD', {
  // Set the market
  timeframe: '1', // 1 = 1 minute
  range: 2000,
});

chart.onError((...err) => {
  // Listen for errors (can avoid crash)
  console.error('Chart error:', ...err);
  // Do something...
});

chart.onSymbolLoaded(() => {
  // When the symbol is successfully loaded

  console.warn(
    `Market "${chart.infos.description}" loaded: ${chart.periods.length} bars`,
  );
});

chart.onUpdate(() => {
  // When price changes

  if (histDumped === false) {
    console.clear();
    console.warn(`onUpdate: ${chart.periods.length} bars`);
    dumpSessionBars(chart);
    histDumped = true;
  }

  if (!chart.periods[0]) return;

  const humanReadableDate = convertUnixTimestampToHumanReadable(
    chart.periods[0].time,
  );

  console.log(
    `[${chart.periods.length}bars] updt: ${chart.infos.name}: ${chart.infos.currency_id}: ${humanReadableDate} (${chart.periods[0].time}): [0]  o=${chart.periods[0].open}, h=${chart.periods[0].max}, l=${chart.periods[0].min}, c=${chart.periods[0].close}`,
  );
  // Do something...
});

// // Wait 5 seconds and set the market to BINANCE:ETHEUR
// setTimeout(() => {
//   console.log('\nSetting market to BINANCE:ETHEUR...');
//   chart.setMarket('BINANCE:ETHEUR', {
//     timeframe: 'D',
//   });
// }, 5000);

// // Wait 10 seconds and set the timeframe to 15 minutes
// setTimeout(() => {
//   console.log('\nSetting timeframe to 15 minutes...');
//   chart.setSeries('15');
// }, 10000);

// // Wait 15 seconds and set the chart type to "Heikin Ashi"
// setTimeout(() => {
//   console.log('\nSetting the chart type to "Heikin Ashi"s...');
//   chart.setMarket('BINANCE:ETHEUR', {
//     timeframe: 'D',
//     type: 'HeikinAshi',
//   });
// }, 15000);

// // Wait 20 seconds and close the chart
// setTimeout(() => {
//   console.log('\nClosing the chart...');
//   chart.delete();
// }, 20000);

readline.emitKeypressEvents(process.stdin);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    // Check for Ctrl+C
    console.log('EXIT - BYE BYE');
    client.end();
    process.exit(); // Exit the application
  }
});

// // Wait 25 seconds and close the client
// setTimeout(() => {
//   console.log('\nClosing the client...');
//   client.end();
// }, 25000);
