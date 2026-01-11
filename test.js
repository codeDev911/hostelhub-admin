function parseStartingNumber(value) {
  const match = value.toString().match(/^([A-Za-z]*)(\d+)$/);

  if (!match) return null;

  return {
    letter: match[1] || null,
    number: parseInt(match[2], 10)
  };
}

let startingNumber = parseStartingNumber(2)
if (startingNumber.letter ){
for (let i = 1; i < 5; i++) {
        console.log(`${startingNumber.letter}${Number(startingNumber.number)+i}`)
}
}else{
    for (let i = 0; i < 5; i++) {
        const number = Number(startingNumber.number)+i
            console.log(number)
    }
}
