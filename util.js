const uuidv4 = require('uuid/v4');
var config = require('./config');
var moment = require('moment-timezone');
var fs = require('fs');
var nodeUtil = require('util');
var EventEmitter = require('events');
var WAValidator = require('wallet-address-validator');
var i18n = require("i18n");
var translator = {};

i18n.configure({
    locales: ['en', 'de', 'es', 'fr'],
    directory: __dirname + '/locales'
});

function isNewUser(chatId, callback, connection, bot) {
    connection.query("SELECT * from `users` where `chatId` = '" + chatId + "'",
        function(error, results, fields) {
            if (error) {
                console.log(error);
                return;
            }
            if (results.length === 0) {
                return callback(true);
            } else {
                return callback(results);
            }
        });

}

function saveNewUser(msg, connection, bot, ref_) {
    var chatIdUser = msg.chat.id;
    var name = msg.chat.first_name;
    var nameUser = msg.from.first_name;
    var usernameUser = msg.from.username;
    var dateUser = Date.now();
    if (nodeUtil.isNullOrUndefined(ref_)) {
        var user = { nameUser: nameUser, username: usernameUser, dateJoined: dateUser, chatId: chatIdUser };
    } else {
        var user = { nameUser: nameUser, username: usernameUser, dateJoined: dateUser, chatId: chatIdUser, referred_by: ref_ };
    }
    connection.query("insert into `users` SET ?", user, function(error, results) {
        if (error) {
            console.log(error);
            return;
        }
        if (results.affectedRows === 1) {
            var language = "Please select your language";
            bot.sendMessage(msg.chat.id, language, {
                "reply_markup": {
                    "keyboard": [
                        ["English"],
                        ["German"],
                        ["French"],
                        ["Spanish"]
                    ]
                }

            });
            var account = { chatId: chatIdUser, balance: 0.000000, status: config.FROZEN };
            connection.query("insert into `account` SET ?", account, function(err, results) {
                if (results.affectedRows === 1) {
                    //  bot.sendMessage(chatIdUser, "Please select your language");
                }
            });

        }
    });
}

function createOrder(amount, callback_url, user, connection, callback, client) {
    existingOrder(user, connection, function(response) {
        if (response === false) {
            init();
        } else if (response === false) {
            callback(false);
        }
    });

    function init() {
        var order = {
            name: uuidv4(),
            status: config.PENDING,
            amount: amount,
            created_at: moment().tz('Africa/Lagos').unix(),
            callback_url: callback_url,
            user: user
        };
        client.getAccount('primary', function(err, account) {
            if (err) {
                console.log(err);
                return;
            }
            account.createAddress({ name: order.name, callback_url: order.callback_url }, function(err, addr) {
                if (err === null) {
                    order.address = addr.address;
                    order.uuid = addr.id;
                    connection.query("insert into `orders` SET ?", order, function(err, results) {
                        if (err) {
                            return;
                        }
                        if (results.affectedRows > 0) {
                            callback(order);
                        } else {
                            order(false);
                        }
                    });
                }
            });
        });

    }
}

function existingOrder(user, connection, callback) {
    connection.query("SELECT * from `orders` where `user` = '" + user + "' and `status` = '" + config.PENDING + "'",
        function(err, results) {
            if (err) {
                console.log(err);
                return;
            }
            if (results.length === 0) {
                callback(false);
            } else if (results.length > 0) {
                callback(results);
            }
        });
}

function confirmOrder(order, connection, callback, client) {
    if (nodeUtil.isNullOrUndefined(order.uuid)) {

    } else {
        connection.query("SELECT * from `orders` where `uuid` = '" + order.uuid + "' and `status` = '" + config.PENDING + "'",
            function(err, results) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (results.length === 0) {
                    callback(false);
                } else if (results.length > 0) {
                    var amount = order.amount;
                    var address = order.address;
                    var uuid = order.uuid;
                    var user = results[0].user;
                    getLanguage(connection, user, function(language) {
                        if (language !== true) {
                            i18n.setLocale(language);
                        } else {
                            i18n.setLocale('en');
                        }
                        if (amount == results[0].amount) {
                            updateOrderStatus(uuid, connection, function(response) {
                                if (response === true) {
                                    updateBalance(user, config.ACTIVE, amount, connection, function(response) {
                                        if (response === true) {
                                            callback({ message: i18n.__("Your order has been successfully confirmed."), user: user });
                                            notifyBalanceHandlers(amount, user);
                                            var transaction = {
                                                address: address,
                                                amount: amount
                                            };
                                            var transactionJson = JSON.stringify(transaction);
                                            newTransactionOccured(user, config.NEW_PAYMENT, transactionJson, connection, function(response) {});
                                            payReferralBonus(user, amount, 1, connection, client);
                                        } else {
                                            callback({ message: i18n.__('You order was rejected. Payment made did not match order.'), user: user });
                                        }
                                    });

                                }
                            });
                        } else if (amount <= results[0].amount || amount > results[0].amount) {
                            callback({ message: i18n.__('You order was rejected. Payment made did not match order.'), user: user });
                        }
                    });
                }
            });
    }
}

function updateOrderStatus(uuid, connection, callback) {
    connection.query("update `orders` set `status` = '" + config.CONFIRMED + "' where `uuid` = '" + uuid + "'",
        function(err, results) {
            if (results.affectedRows > 0) {
                callback(true);
            } else {
                // log error
                callback(false);
            }
        });
}

function updateBalance(user, status, amount, connection, callback) {
    if (amount === 0.02 || amount === 0.05 || amount === 0.1 || amount === 0.5) {
        amount = 1.6 * amount;
    } else {
        amount = 2.4 * amount;
    }
    getBalance(user, connection, function(response) {
        if (response !== true) {
            amount = amount + response;
        }
        var sql = "update `account` set `status` = '" + status + "', balance = " + amount + " where `chatId` = '" + user + "'";
        connection.query(sql, function(err, results) {
            if (results.affectedRows > 0) {
                callback(true);
            } else {
                callback(false);
            }
        });
    });
}

function updateDailyBalance(user, status, amount, connection, callback, dailyMax) {
    var sql = "update `account` set `status` = '" + status + "', balance = " +
        amount + ", dailyMax = " + dailyMax + " where `chatId` = '" + user + "'";
    connection.query(sql, function(err, results) {
        if (results.affectedRows > 0) {
            callback(true);
        } else {
            callback(false);
        }
    });
}


function getBalance(user, connection, callback) {
    var sql = "SELECT * from `account` where `chatId` = '" + user + "'";
    connection.query(sql, function(error, results, fields) {
        //if (error) throw error;
        if (results.length === 0) {
            return callback(true);
        } else {
            return callback(results[0].balance);
        }
    });
}

function increaseBalance(connection) {
    var sql = "select * from `account` where status = '" + config.ACTIVE + "'";
    connection.query(sql, function(err, results) {
        if (results.length > 0) {
            results.forEach(function(element, index, array) {
                var account = element;
                var max = account.dailyMax;
                var balance = account.balance;
                var user = account.chatId;
                var status = account.status;
                if (status == config.ACTIVE) {
                    max = max + (0.06 * balance);
                    balance = balance - (0.06 * balance);
                    if (0 > balance) {
                        status = config.FROZEN;
                    } else if (0 <= balance) {
                        status = config.ACTIVE;
                    } else {
                        status = config.FROZEN;
                    }
                    if (status == config.ACTIVE) {
                        updateDailyBalance(user, status, balance, connection, function(response) {
                            if (response === false) {
                                //log error
                            }
                        }, max);
                    }
                }
            });
        }
    });
}

function getAccount(user, connection, callback) {
    var sql = "SELECT * from `account` where `chatId` = '" + user + "'";
    connection.query(sql, function(error, results, fields) {
        if (error) {
            console.log(error);
            return;
        }
        if (results.length === 0) {
            return callback(true);
        } else {
            return callback(results[0]);
        }
    });
}

function validateBitcoinAddress(address) {
    var valid = WAValidator.validate(address, 'BTC');
    return valid;
}

function payUser(user, amount, address, connection, client, callback) {
    getAccount(user, connection, function(account) {
        if (account === true) {
            callback("Account is frozen");
        } else if (account !== true) {
            if (account.status === config.FROZEN) {
                callback("Account is frozen");
            } else if (account.status === config.ACTIVE) {
                if (amount > account.dailyMax) {
                    callback("Amount available for withdraw is lesser than " + amount + "BTC");
                } else if (amount <= account.dailyMax) {
                    pay(user, amount, address, connection, client, function(response) {
                        if (response === false) {
                            callback(false);
                        } else {
                            deductDailyMax(user, amount, config.ACTIVE, connection, function(response) {
                                if (response === true) {
                                    callback(true);
                                    var transaction = {
                                        amount: amount,
                                        address: address
                                    };
                                    var transactionJson = JSON.stringify(transaction);
                                    newTransactionOccured(user, config.NEW_WITHDRAWAL, transactionJson, connection, function(response) {

                                    });
                                } else {
                                    callback(false);
                                }
                            });
                        }
                    });
                }
            }
        }
    });
}

function deductDailyMax(user, amount, status, connection, callback) {
    var sql = "update `account` set `dailyMax` = " + amount + ", `status` = '" + status + "' where `chatId` = '" + user + "'";
    connection.query(sql, function(err, results) {
        if (results.affectedRows > 0) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

function pay(user, amount, address, connection, client, callback) {
    client.getAccount('primary', function(err, account) {
        account.sendMoney({
            'to': address,
            'amount': amount,
            'currency': 'BTC'
        }, function(err, tx) {
            if (nodeUtil.isNull(err)) {
                var paymentInfo = JSON.parse(tx);
                callback(paymentInfo);
            } else {
                callback(false);

            }
        });
    });
}

function newTransactionOccured(user, verb, transactionJson, connection, callback) {
    var sql = "insert into `transactions` SET ?";
    var transaction = {
        user: user,
        date: moment().tz('Africa/Lagos').unix(),
        verb: verb,
        transaction: transactionJson
    };
    connection.query(sql, transaction, function(err, response) {
        if (response.affectedRows > 0) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

function getTransaction(user, connection, callback) {
    var sql = "select distinct `user`,`date`,`verb`,`transaction` from `transactions` where `user` = '" + user + "'";
    connection.query(sql, function(err, results) {
        if (results.length > 0) {
            callback(results);
        } else {
            callback(false);
        }
    });
}

function payReferralBonus(user, amount, generation, connection, client) {
    isNewUser(user, function(response) {
        if (response !== true) {
            var me = response[0];
            var referral = me.referred_by;
            if (nodeUtil.isNullOrUndefined(referral)) {
                return;
            } else {
                if (generation === 1) {
                    ref_amount = amount * 0.08;
                } else if (generation === 2) {
                    ref_amount = amount * 0.04;
                } else if (generation === 3) {
                    ref_amount = amount * 0.02;
                } else {
                    return;
                }
                increaseDailyBalance(connection, referral, ref_amount, function(response) {
                    if (response === true) {
                        notifyDailyBalanceHandlers(ref_amount, referral);
                        payReferralBonus(referral, amount, (generation + 1), connection, client);
                    }
                });
                /**client.getExchangeRates({ 'currency': 'BTC' }, function(err, rates) {
                    if (err) {
                        return;
                    } else {
                        var rate = rates.data.rates.USD;
                        rate = 1 / rate;
                        increaseDailyBalance(connection, referral, rate, function(response) {
                            if (response === true) {
                                notifyDailyBalanceHandlers(rate, referral);
                            }
                        })
                    }
                });**/
            }
        }
    }, connection, null);
}

function increaseDailyBalance(connection, user, amount, callback) {
    getAccount(user, connection, function(account) {
        if (account !== true) {
            var dailyMax = account.dailyMax;
            amount = amount + dailyMax;
        }
        var sql = "update `account` set `dailyMax` = " + amount + " where `chatId` = '" + user + "'";
        connection.query(sql, function(err, results) {
            if (err) {
                console.log(err);
                return;
            }
            if (results.affectedRows > 0) {
                callback(true);
            } else {
                callback(false);
            }
        });
    });

}

function getLanguage(connection, chatId, callback) {
    var sql = "select `language` from `users` where `chatId` = '" + chatId + "'";
    connection.query(sql, function(err, results) {
        if (err) {
            console.log(err);
            return;
        }
        if (results.length > 0) {
            callback(results[0].language);
        } else {
            callback(true);
        }
    });
}

function myTeam(connection, chatId, callback) {
    var sql = "select `chatId` from `users` where `referred_by` = '" + chatId + "'";
    connection.query(sql, function(err, results) {
        if (err) {
            console.log(err);
            callback(0, 0);
        }
        if (results.length > 0) {
            var active = [];
            var inactive = [];
            results.forEach(function(value, index, resultsArr) {
                var user = value.chatId;
                var sql = "select `status` from `orders` where `user` = '" + user + "'"
                connection.query(sql, function(err, response) {
                    if (!nodeUtil.isNullOrUndefined(response)) {
                        if (err) {
                            console.log(err);
                            inactive.push(1);
                        } else {
                            callback(0, 0);
                            //if (response[0].status === config.CONFIRMED) {
                            //   active.push(1);
                            //} else {
                            //  inactive.push(1);
                            // }
                        }
                        if (index === resultsArr.length - 1) {
                            callback(0, 0);
                        }
                    }
                });
            });
        } else {
            callback(0, 0);
        }
    });
}

function getOrder(connection, chatId, callback) {
    var sql = "select `amount` from `orders` where `user` = '" + chatId + "'";
    connection.query(sql, function(err, results) {
        if (err) {
            console.log(err);
            return;
        }
        if (results.length > 0) {
            callback(results[0].amount);
        } else {
            callback(true);
        }
    });
}

function getUsers(connection, callback) {
    var users = [];
    var sql = "select chatId from users";
    connection.query(sql, function(err, results) {
        if (err) {
            console.log(err);
            return;
        }
        callback(results);
    });
}

function Util() {
    EventEmitter.call(this);
    this.isNewUser = isNewUser;
    this.saveNewUser = saveNewUser;
    this.createOrder = createOrder;
    this.existingOrder = existingOrder;
    this.confirmOrder = confirmOrder;
    this.getBalance = getBalance;
    this.increaseBalance = increaseBalance;
    this.getAccount = getAccount;
    this.validateBitcoinAddress = validateBitcoinAddress;
    this.payUser = payUser;
    this.deductDailyMax = deductDailyMax;
    this.getTransaction = getTransaction;
    this.getLanguage = getLanguage;
    this.myTeam = myTeam;
    this.getOrder = getOrder;
    this.getUsers = getUsers;
}

nodeUtil.inherits(Util, EventEmitter);
var util = new Util();

function notifyBalanceHandlers(data, user) {
    util.emit(config.BALANCE_CHANGED, data, user);
}

function notifyDailyBalanceHandlers(balance, user) {
    util.emit(config.DAILY_BALANCE_CHANGED, balance, user);
}

module.exports = util;