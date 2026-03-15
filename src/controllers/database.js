const database = {
    users: [
        {
            id: "1",
            name: "Saad",
            email: "Saad@email.com",
            password: "1234",
            wallet: {
                balance: 16182,
                currency: "MAD",
                cards: [
                    { numcards: "124847", type: "visa", balance: 14712, expiry: "14-08-27", vcc: "147" },
                    { numcards: "124478", type: "mastercard", balance: 1470, expiry: "14-08-28", vcc: "257" }
                ],
                transactions: [
                    { id: "1", type: "credit", amount: 140, date: "14-08-25", from: "Ahmed", to: "124847" },
                    { id: "2", type: "debit", amount: 200, date: "13-08-25", from: "124847", to: "Amazon" },
                    { id: "3", type: "credit", amount: 250, date: "12-08-25", from: "Ahmed", to: "124478" }
                ]
            }
        },
        {
            id: "2",
            name: "Ahmed",
            email: "Ahmed@email.com",
            password: "1234",
            wallet: {
                balance: 28382,
                currency: "MAD",
                cards: [
                    { numcards: "133847", type: "visa", balance: 14112, expiry: "14-12-27", vcc: "747" },
                    { numcards: "125578", type: "mastercard", balance: 14270, expiry: "01-09-28", vcc: "237" }
                ],
                transactions: [
                    { id: "1", type: "credit", amount: 140, date: "14-08-25", from: "Saad", to: "133847" },
                    { id: "2", type: "debit", amount: 200, date: "13-08-25", from: "133847", to: "Amazon" },
                    { id: "3", type: "credit", amount: 250, date: "12-08-25", from: "Ali", to: "125578" }
                ]
            }
        }
    ]
};

const finduser = (mail) => {
    return database.users.find((u) => u.email === mail);
}

const finsuserbymail = (mail, password) => {
    return database.users.find((u) => u.email === mail && u.password === password);
}

const getusers = () => {
    return database.users;
}

export { finduser, finsuserbymail, getusers };