const rows = 'ABCDEFGHIJ';
const seats = [];
let selectedSeat = null;
let cart = [];
try {
  const savedCart = JSON.parse(localStorage.getItem('cinemaCart') || '[]');
  cart = Array.isArray(savedCart) ? savedCart : [];
} catch (error) {
  cart = [];
}
let scale = 1;
let moveX = 0;
let moveY = 0;

for (let i = 0; i < rows.length; i++) {
  for (let number = 1; number <= 12; number++) {
    let category = i < 2 ? 'VIP' : i < 5 ? 'Premium' : 'Standard';
    let price = category === 'VIP' ? 25 : category === 'Premium' ? 15 : 10;
    seats.push({ id: rows[i] + number, row: rows[i], number, category, price, unavailable: (i * 12 + number) % 13 === 0 });
  }
}

const seatArea = document.getElementById('seats');
const details = document.getElementById('details');
const addBtn = document.getElementById('addBtn');
const cartItems = document.getElementById('cartItems');
const total = document.getElementById('total');
const venue = document.getElementById('venue');

cart = cart.filter((id, index) => typeof id === 'string' && seats.some(s => s.id === id && !s.unavailable) && cart.indexOf(id) === index);

function saveCart() { localStorage.setItem('cinemaCart', JSON.stringify(cart)); }

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
      button.textContent = seat.number;
      button.title = seat.id + ' - ' + seat.price + ' AZN';
      button.setAttribute('aria-label', 'Seat ' + seat.id + ', ' + seat.category + ', ' + seat.price + ' AZN');
      button.className = 'seat ' + (seat.unavailable ? 'unavailable' : cart.includes(seat.id) ? 'cart-seat' : selectedSeat === seat.id ? 'selected' : 'available');
      if (seat.number === 7) button.classList.add('aisle');
      button.disabled = seat.unavailable;
      button.onclick = () => inspectSeat(seat.id);
      rowDiv.appendChild(button);
    }
    seatArea.appendChild(rowDiv);
  }
}

function inspectSeat(id) {
  const seat = seats.find(s => s.id === id);
  if (!seat || seat.unavailable) return;
  selectedSeat = id;
  details.innerHTML = '<strong>Seat: ' + seat.id + '</strong><br>Category: ' + seat.category + '<br>Price: ' + seat.price + ' AZN' + (cart.includes(id) ? '<br>Already in cart' : '');
  addBtn.disabled = cart.includes(id) || seat.unavailable;
  showSeats();
}

addBtn.onclick = function () {
  if (!selectedSeat || cart.includes(selectedSeat)) return;
  const seat = seats.find(s => s.id === selectedSeat);
  if (!seat || seat.unavailable) return;
  cart.push(selectedSeat);
  saveCart();
  inspectSeat(selectedSeat);
  showCart();
};

function removeSeat(id) {
  cart = cart.filter(item => item !== id);
  saveCart();
  if (selectedSeat === id) inspectSeat(id);
  else showSeats();
  showCart();
}

function showCart() {
  cartItems.innerHTML = '';
  let sum = 0;
  if (cart.length === 0) cartItems.textContent = 'Your cart is empty.';
  for (const id of cart) {
    const seat = seats.find(s => s.id === id);
    sum += seat.price;
    const item = document.createElement('div');
    item.className = 'cart-item';
    const name = document.createElement('span');
    name.textContent = seat.id + ' - ' + seat.price + ' AZN';
    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.onclick = () => removeSeat(id);
    item.append(name, remove);
    cartItems.appendChild(item);
  }
  total.textContent = sum + ' AZN';
}

function updateView() {
  moveX = Math.max(-450, Math.min(450, moveX));
  moveY = Math.max(-450, Math.min(450, moveY));
  venue.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px) scale(' + scale + ')'; }
document.getElementById('zoomIn').onclick = () => { scale = Math.min(1.8, scale + 0.1); updateView(); };
document.getElementById('zoomOut').onclick = () => { scale = Math.max(0.6, scale - 0.1); updateView(); };
document.getElementById('up').onclick = () => { moveY -= 30; updateView(); };
document.getElementById('down').onclick = () => { moveY += 30; updateView(); };
document.getElementById('left').onclick = () => { moveX -= 30; updateView(); };
document.getElementById('right').onclick = () => { moveX += 30; updateView(); };
document.getElementById('reset').onclick = () => { scale = 1; moveX = 0; moveY = 0; updateView(); };

saveCart();
showSeats();
showCart();


// Optional mouse controls (bonus)
const viewport = document.getElementById('viewport');
let dragging = false;
let dragX = 0;
let dragY = 0;

viewport.addEventListener('wheel', function (event) {
  event.preventDefault();
  scale = Math.max(0.6, Math.min(1.8, scale + (event.deltaY < 0 ? 0.1 : -0.1)));
  updateView();
}, { passive: false });

viewport.addEventListener('pointerdown', function (event) {
  if (event.button !== 0 || event.target.closest('button')) return;
  dragging = true;
  dragX = event.clientX;
  dragY = event.clientY;
  viewport.classList.add('dragging');
  viewport.setPointerCapture(event.pointerId);
});
viewport.addEventListener('pointermove', function (event) {
  if (!dragging) return;
  moveX += event.clientX - dragX;
  moveY += event.clientY - dragY;
  dragX = event.clientX;
  dragY = event.clientY;
  updateView();
});
function stopDragging() {
  dragging = false;
  viewport.classList.remove('dragging');
}
viewport.addEventListener('pointerup', stopDragging);
viewport.addEventListener('pointercancel', stopDragging);
