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
const seatArea = document.getElementById('seats');
function showSeats() {
  seatArea.innerHTML = '';
  for (const row of rows) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'seat-row';
    const label = document.createElement('span');
    label.className = 'row-name';
    label.textContent = row;
    rowDiv.appendChild(label);
    for (const seat of seats.filter(s => s.row === row)) {
      const button = document.createElement('button');
      button.className = 'seat available';
      button.textContent = seat.number;
      button.title = seat.id + ' - ' + seat.price + ' AZN';
      if (seat.number === 7) button.classList.add('aisle');
      rowDiv.appendChild(button);
    }
    seatArea.appendChild(rowDiv);
  }
}
showSeats();
