const SERIAL_PORT_PATH = '/dev/ttyACM0'
const SERIAL_PORT_BAUD_RATE = 9600
const serialport = require('serialport')
const serialParser = new serialport.parsers.Readline('\r\n')

const sp = new serialport(SERIAL_PORT_PATH, {
    baudRate: SERIAL_PORT_BAUD_RATE,
})

sp.on('open', () => {
    console.log('open')
})

serialParser.on('data', (data) => console.log(data))

sp.pipe(serialParser)
