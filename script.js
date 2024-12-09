let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

document.getElementById("purchase-btn").addEventListener("click", () => {
    const cash = parseFloat(document.getElementById("cash").value);

    const changeDueElement = document.getElementById("change-due");

    if (cash < price) {
        alert("Customer does not have enough money to purchase the item");
        return;
    } else if (cash === price) {
        changeDueElement.textContent = "No change due - customer paid with exact cash";
        return;
    }

    const change = cash - price;
    const result = calculateChange(change, cid);

    if (result.status === "INSUFFICIENT_FUNDS") {
        changeDueElement.textContent = "Status: INSUFFICIENT_FUNDS";
    } else if (result.status === "CLOSED") {
        const changeString = result.change.map(([name, amount]) => `${name}: $${amount.toFixed(2)}`).join(" ");
        changeDueElement.textContent = `Status: CLOSED ${changeString}`;
    } else {
        const changeString = result.change.map(([name, amount]) => `${name}: $${amount.toFixed(2)}`).join(" ");
        changeDueElement.textContent = `Status: OPEN ${changeString}`;
    }
});

function calculateChange(change, cid) {
    const denominations = [
        { name: "ONE HUNDRED", value: 100 },
        { name: "TWENTY", value: 20 },
        { name: "TEN", value: 10 },
        { name: "FIVE", value: 5 },
        { name: "ONE", value: 1 },
        { name: "QUARTER", value: 0.25 },
        { name: "DIME", value: 0.1 },
        { name: "NICKEL", value: 0.05 },
        { name: "PENNY", value: 0.01 }
    ];

    let totalCid = 0;
    const changeArray = [];

    cid.forEach(([_, amount]) => (totalCid += amount));
    totalCid = Math.round(totalCid * 100) / 100;

    if (totalCid < change) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    if (totalCid === change) {
    const sortedCid = cid
        .filter(([_, amount]) => amount > 0)
        .sort((a, b) => denominations.find(d => d.name === b[0]).value - denominations.find(d => d.name === a[0]).value);

    return { status: "CLOSED", change: sortedCid };
}


    for (let denom of denominations) {
        let amount = 0;
        const drawer = cid.find(item => item[0] === denom.name);
        const available = drawer ? drawer[1] : 0;

        while (change >= denom.value && available >= amount + denom.value) {
            amount += denom.value;
            change -= denom.value;
            change = Math.round(change * 100) / 100;
        }

        if (amount > 0) {
            changeArray.push([denom.name, amount]);
        }
    }

    if (change > 0) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    return { status: "OPEN", change: changeArray };
}
