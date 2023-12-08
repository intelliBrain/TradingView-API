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

function dumpSessionBars(chart, title) {
  if (!chart.periods[0]) return;

  for (
    let periodIndex = chart.periods.length - 1;
    periodIndex >= 0;
    periodIndex -= 1
  ) {
    const p = chart.periods[periodIndex];
    const humanReadableDate = convertUnixTimestampToHumanReadable(p.time);

    console.log(
      `${title}: [${chart.periods.length}bars] hist: ${chart.infos.name}: ${chart.infos.currency_id}: ${humanReadableDate} (${p.time}): [${periodIndex}]  o=${p.open}, h=${p.max}, l=${p.min}, c=${p.close}`,
    );
  }
}

/**
 * This example creates a BTCEUR daily chart
 */

const client = new TradingView.Client(); // Creates a websocket client

const chartM1 = new client.Session.Chart(); // Init a Chart session
const chartM5 = new client.Session.Chart(); // Init a Chart session

let histDumpedM1 = true;
let histDumpedM5 = true;

chartM1.setMarket('FOREXCOM:EURUSD', {
  // Set the market
  timeframe: '1', // 1 = 1 minute
  range: 2000,
});

chartM5.setMarket('FOREXCOM:EURUSD', {
  // Set the market
  timeframe: '5', // 5 = 5 minute
  range: 2000,
});

chartM1.onError((...err) => {
  // Listen for errors (can avoid crash)
  console.error('chartM1 error:', ...err);
  // Do something...
});

chartM5.onError((...err) => {
  // Listen for errors (can avoid crash)
  console.error('chartM5 error:', ...err);
  // Do something...
});

chartM1.onSymbolLoaded(() => {
  // When the symbol is successfully loaded

  console.warn(
    `Market "${chartM1.infos.description}" loaded: ${chartM1.periods.length} bars`,
  );
});

chartM5.onSymbolLoaded(() => {
  // When the symbol is successfully loaded

  console.warn(
    `Market "${chartM5.infos.description}" loaded: ${chartM5.periods.length} bars`,
  );
});

chartM1.onUpdate(() => {
  // When price changes

  if (histDumpedM1 === false) {
    console.clear();
    console.warn(`onUpdate: ${chartM1.periods.length} bars`);
    dumpSessionBars(chartM1, 'M1');
    histDumpedM1 = true;
  }

  if (!chartM1.periods[0]) return;

  const humanReadableDate = convertUnixTimestampToHumanReadable(
    chartM1.periods[0].time,
  );

  console.log(
    `M1 [${chartM1.periods.length}bars] updt: ${chartM1.infos.name}: ${chartM1.infos.currency_id}: ${humanReadableDate} (${chartM1.periods[0].time}): [0]  o=${chartM1.periods[0].open}, h=${chartM1.periods[0].max}, l=${chartM1.periods[0].min}, c=${chartM1.periods[0].close}`,
  );
  // Do something...
});

chartM5.onUpdate(() => {
  // When price changes

  if (histDumpedM5 === false) {
    console.clear();
    console.warn(`M5 onUpdate: ${chartM5.periods.length} bars`);
    dumpSessionBars(chartM5, 'M5');
    histDumpedM5 = true;
  }

  if (!chartM5.periods[0]) return;

  const humanReadableDate = convertUnixTimestampToHumanReadable(
    chartM5.periods[0].time,
  );

  console.log(
    `M5 [${chartM5.periods.length}bars] updt: ${chartM5.infos.name}: ${chartM5.infos.currency_id}: ${humanReadableDate} (${chartM5.periods[0].time}): [0]  o=${chartM5.periods[0].open}, h=${chartM5.periods[0].max}, l=${chartM5.periods[0].min}, c=${chartM5.periods[0].close}`,
  );
  // Do something...
});

// // Wait 5 seconds and set the market to BINANCE:ETHEUR
// setTimeout(() => {
//   console.log('\nSetting market to BINANCE:ETHEUR...');
//   chartM1.setMarket('BINANCE:ETHEUR', {
//     timeframe: 'D',
//   });
// }, 5000);

// // Wait 10 seconds and set the timeframe to 15 minutes
// setTimeout(() => {
//   console.log('\nSetting timeframe to 15 minutes...');
//   chartM1.setSeries('15');
// }, 10000);

// // Wait 15 seconds and set the chartM1 type to "Heikin Ashi"
// setTimeout(() => {
//   console.log('\nSetting the chartM1 type to "Heikin Ashi"s...');
//   chartM1.setMarket('BINANCE:ETHEUR', {
//     timeframe: 'D',
//     type: 'HeikinAshi',
//   });
// }, 15000);

// // Wait 20 seconds and close the chartM1
// setTimeout(() => {
//   console.log('\nClosing the chartM1...');
//   chartM1.delete();
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
