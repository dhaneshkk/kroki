#!/usr/bin/env node
const nomnoml = require('nomnoml')

const encoding = 'utf-8'
let data

function convert () {
  const source = data.toString(encoding)
  if (source === '') {
    return
  }
  console.log(nomnoml.renderSvg(source))
}

const [ , , ...args ] = process.argv;
if (args[0] === '--version') {
  const version = require('./package.json').dependencies.nomnoml
  console.log(`nomnoml ${version}`)
  return
}

if (process.stdin.isTTY) {
  // Even though executed by name, the first argument is still "node",
  // the second the script name. The third is the string we want.
  data = Buffer.from(process.argv[2] || '', encoding)
  convert()
} else {
  // Accepting piped content. E.g.:
  // echo "pass in this string as input" | ./example-script
  data = ''
  process.stdin.setEncoding(encoding)

  process.stdin.on('readable', function () {
    let chunk
    while (chunk = process.stdin.read()) {
      data += chunk
    }
  })

  process.stdin.on('end', function () {
    // There will be a trailing \n from the user hitting enter. Get rid of it.
    data = data.replace(/\n$/, '')
    convert()
  })
}
