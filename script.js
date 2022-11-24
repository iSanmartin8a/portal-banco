/// //////////////////////////////////////////////
/// //////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Juan Sánchez',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
}

const account2 = {
  owner: 'María Portazgo',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
}

const account3 = {
  owner: 'Estefanía Pueyo',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
}

const account4 = {
  owner: 'Javier Rodríguez',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
}

const accounts = [account1, account2, account3, account4]

function createUsernames(users) {
  users.forEach((user) => {
    // eslint-disable-next-line no-param-reassign
    user.username = user.owner
      .toLowerCase()
      .split(' ')
      .map((e) => e[0])
      .join('')
  })
}

createUsernames(accounts)

// Elements
const labelWelcome = document.querySelector('.welcome')
const labelDate = document.querySelector('.date')
const labelBalance = document.querySelector('.balance__value')
const labelSumIn = document.querySelector('.summary__value--in')
const labelSumOut = document.querySelector('.summary__value--out')
const labelSumInterest = document.querySelector('.summary__value--interest')
const labelTimer = document.querySelector('.timer')

const containerApp = document.querySelector('.app')
const containerMovements = document.querySelector('.movements')

const btnLogin = document.querySelector('.login__btn')
const btnTransfer = document.querySelector('.form__btn--transfer')
const btnLoan = document.querySelector('.form__btn--loan')
const btnClose = document.querySelector('.form__btn--close')
const btnSort = document.querySelector('.btn--sort')

const inputLoginUsername = document.querySelector('.login__input--user')
const inputLoginPin = document.querySelector('.login__input--pin')
const inputTransferTo = document.querySelector('.form__input--to')
const inputTransferAmount = document.querySelector('.form__input--amount')
const inputLoanAmount = document.querySelector('.form__input--loan-amount')
const inputCloseUsername = document.querySelector('.form__input--user')
const inputClosePin = document.querySelector('.form__input--pin')

btnLogin.addEventListener('click', (event) => {
  event.preventDefault()
  const currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  )

  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Bienvenido ${
      currentAccount.owner.split(' ')[0]
    }`
    containerApp.style.opacity = 100
    // calcDisplaySummary(currentAccount.movements)
    calcDisplayBalance(currentAccount.movements)
    displayMovements(currentAccount.movements)
    startTimer(2, labelTimer);

    btnSort.addEventListener('click', (event) => {
      const sortedMovements = currentAccount.movements.reverse()
      if(btnSort.innerHTML == '↓ SORT') {
        btnSort.innerHTML = '&uparrow; SORT'
      } else {
        btnSort.innerHTML = '&downarrow; SORT'
      }
      displayMovements(sortedMovements)
    })
  }

  console.log(currentAccount)
})



/* calcular y mostrar ingresos totales, retiradas totales e intereses */
function calcDisplaySummary(movements) {}

/* calcular y mostrar balance */
function calcDisplayBalance(movements) {
  const balance = movements.reduce(
    (acc, cur) => acc + cur,
     0)
  labelBalance.textContent = `${balance.toFixed(2)} €`

  const income = movements.reduce((acc, cur) => {
    if (cur > 0) {
      return acc + cur
    }
    return acc
  }
  , 0)
  labelSumIn.textContent = `${income.toFixed(2)} €`

  const outcome = movements.reduce((acc, cur) => {
    if (cur < 0) {
      return acc + cur
    }
    return acc
  }
  , 0)
  labelSumOut.textContent = `${Math.abs(outcome).toFixed(2)} €`

  const interest = movements.reduce((acc, cur) => {
    if (cur > 0) {
      return acc + cur * 1.2 / 100
    }
    return acc
  }
  , 0)

  if(interest < 5) {
    labelSumInterest.textContent = '0.00 €'
  } else {
    labelSumInterest.textContent = `${interest.toFixed(2)} €`
  }
}

/* mostrar movimientos de la cuenta de un usuario */
function displayMovements(movements) {
  containerMovements.innerHTML = ''
  let html = ''
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal'
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i} ${type}</div>
          <div class="movements__date"></div>
          <div class="movements__value">${mov}€</div>
        </div>
    `

    // containerMovements.innerHTML = html
    // insertAdjacentHTML
    containerMovements.insertAdjacentHTML('afterbegin', html)
  })

}

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault()

  const amount = Number(inputTransferAmount.value)
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  )

  inputTransferAmount.value = inputTransferTo.value = ''

if (
  amount > 0 &&
  receiverAcc &&
  currentAccount.balance >= amount &&
  receiverAcc?.username !== currentAccount.username
) {
  currentAccount.movements.push(-amount)
  receiverAcc.movements.push(amount)
}
})

function startTimer(duration, display) {
  var timer = duration, minutes, seconds;
  if (minutes != '00' && seconds != '00') {
    setInterval(function () {
      minutes = parseInt(timer / 60, 10)
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
        timer = duration;
      }
    }, 1000);
  } else if (minutes == '00' & seconds == '00') {
    containerApp.style.opacity = 0
    currentAccount = undefined
  }
}
