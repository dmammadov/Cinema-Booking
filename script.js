const rows = 'ABCDEFGHIJ';
const seats = [];
for (let i = 0; i < rows.length; i++) {
  for (let number = 1; number <= 12; number++) {
    let category = i < 2 ? 'VIP' : i < 5 ? 'Premium' : 'Standard';
    let price = category === 'VIP' ? 25 : category === 'Premium' ? 15 : 10;
    seats.push({ id: rows[i] + number, row: rows[i], number, category, price,
      unavailable: (i * 12 + number) % 13 === 0 });
  }
}
