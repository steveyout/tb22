var Client = require('coinbase').Client;
const TelegramBot = require('node-telegram-bot-api');
var connection = require('./db');
var config = require('./config');
var fs = require('fs');
var util = require('./util');
var express = require('express');
var bodyParser = require('body-parser');
var nodeUtil = require('util');
var CronJob = require('cron').CronJob;
var changeCase = require("change-case");
var moment = require('moment-timezone');
var i18n = require("i18n");

// replace the value below with the Telegram token you receive from @BotFather
const token = config.TOKEN;
// Create a bot that uses 'polling' to fetch new updates

var client = new Client({
    'apiKey': config.API_KEY,
    'apiSecret': config.API_SECRET
});

const bot = new TelegramBot(token, { polling: true });
var chatId = null;
var port = process.env.PORT || 80;

i18n.configure({
    locales: ['en', 'de', 'es', 'fr'],
    directory: __dirname + '/locales'
});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

util.getUsers(connection, function(results) {
    results.forEach(function(value, index, array) {
        //   bot.sendMessage(value.chatId, "It has come to our notice that some fraudlent users are using the group chat as an opportunity to lure individuals away ny offering them a better investment scheme and making them believe that Crypto Smart Trader is a scam. Please such information by those individuals are lies. Please if you have any questions, write to us at support@thecryptotrader.online");
    });
});

function fetchUserAccount(chatId, callback) {
    var sql = "select * from `account` where `chatId` = '" + chatId + "'";
    connection.query(sql, function(error, results) {
        if (error === null) {
            callback(results);
        }
    })
}

function emptyArr(element, index, array) {
    return element.trim() === '';
}

function normalKeyboard(chatId, message) {
    util.getLanguage(connection, chatId, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        fetchUserAccount(chatId, function(response) {
            if (response.length === 0) {
                var bal = "\uD83D\uDCB0" + i18n.__("Balance") + ": " + "\uD83D\uDCB0";
                var invest = i18n.__("Invest") + " \uD83D\uDCB5";
                var withdraw = i18n.__("Withdraw") + " \uD83D\uDCB3";
                var transaction = i18n.__("Transactions") + " \uD83D\uDCB1";
                var order = i18n.__("My Orders") + " \uD83D\uDCBC";
                var referral = i18n.__("Referral System") + " \uD83C\uDFC5";
                var language = i18n.__("Language") + " \uD83C\uDF0D";
                var help = i18n.__("Help");
                var support = i18n.__("Support") + " \u2709";
                var team = i18n.__("My Team") + " \u26BD";
                bot.sendMessage(chatId, message, {
                    "reply_markup": {
                        "keyboard": [
                            [bal + "0.000000BTC"],
                            [invest, withdraw],
                            [transaction, order],
                            [referral, language],
                            [support, team]
                        ]
                    }
                });
            } else {
                var bal = "\uD83D\uDCB0" + i18n.__("Balance") + ": ";
                var invest = i18n.__("Invest") + " \uD83D\uDCB5";
                var withdraw = i18n.__("Withdraw") + " \uD83D\uDCB3";
                var transaction = i18n.__("Transactions") + " \uD83D\uDCB1";
                var order = i18n.__("My Orders") + " \uD83D\uDCBC";
                var referral = i18n.__("Referral System") + " \uD83C\uDFC5";
                var language = i18n.__("Language") + " \uD83C\uDF0D";
                var help = i18n.__("Help");
                var support = i18n.__("Support") + " \u2709";
                var team = i18n.__("My Team") + " \u26BD";
                bot.sendMessage(chatId, message, {
                    "reply_markup": {
                        "keyboard": [
                            [bal + Number(response[0].balance).toFixed(6) + "BTC"],
                            [invest, withdraw],
                            [transaction, order],
                            [referral, language],
                            [support, team]
                        ]
                    }
                });
            }

        });
    });

}

util.on(config.BALANCE_CHANGED, function(balance, user) {
    util.getLanguage(connection, user, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        util.getOrder(connection, user, function(response) {
            if (response !== true) {
                if (response === 0.02 || response === 0.05 || response === 0.1 || response === 0.5) {
                    normalKeyboard(user, i18n.__("Your balance increments daily by 4% for the next 40 days"));
                } else {
                    normalKeyboard(user, i18n.__("Your balance increments daily by 6% for the next 40 days"));
                }
            }
        });

    });

});

util.on(config.DAILY_BALANCE_CHANGED, function(balance, user) {
    util.getLanguage(connection, user, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        normalKeyboard(user, i18n.__("You have earned") + " " + balance + i18n.__("BTC referral bonus."));
    });
});

function updateLanguage(language, chatId) {
    var sql = "update `users` set `language` = '" + language + "' where `chatId` = '" + chatId + "'";
    connection.query(sql, function(err, results) {
        util.getLanguage(connection, chatId, function(language) {
            if (language !== true) {
                i18n.setLocale(language);
            } else {
                i18n.setLocale('en');
            }
            bot.sendMessage(chatId, i18n.__("Crypto Smart Trader offers investors from around the globe favourable conditions to earn in the market of extensive crypto-currency exchange and trading. Our professional team of traders are ready to work round the clock to provide a steady and stable profit while your only effort is to freely register and invest in any of our affordable plans. Our trading platform offers highly profitable investment (up to 240%) to all investors globally, also our extensive experience in the crypto-currency market ensures stable income not just for the company but also to all our global investors.")).then(function(success) {
                var message = i18n.__("Welcome! Community:") + " " + config.COMMUNITY;
                bot.sendMessage(chatId, i18n.__("Your default language has been saved")).then(function(success) {
                    normalKeyboard(chatId, message);
                }, function(err) {});
            }, function(err) {});
        });

    });
}

function start(msg, ref_) {
    const chatIdUser = msg.chat.id;
    const name = msg.chat.first_name;
    util.getLanguage(connection, chatIdUser, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        util.isNewUser(chatIdUser, function(response) {
            if (response === true) {
                util.saveNewUser(msg, connection, bot, ref_);
            } else {
                var response = i18n.__("Welcome back") + " " + name;
                normalKeyboard(chatIdUser, response);
                util.existingOrder(chatIdUser, connection, function(response) {
                    if (response !== false) {
                        bot.sendMessage(chatIdUser, i18n.__("You have an existing order to make payment of") + " " +
                            response[0].amount + i18n.__("BTC to bitcoin address") + " \n" + response[0].address);
                    }
                });
            }
        }, connection, bot);
    });

}


bot.on('message', (msg) => {
    chatId = msg.chat.id;
    if (changeCase.lowerCase(msg.text.trim()) === '/start') {
        start(msg);
    }
});

bot.on('message', (msg) => {
    chatId = msg.chat.id;
    util.getLanguage(connection, chatId, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(msg.text.trim()).includes("/start ref_")) {
            var text = changeCase.lowerCase(msg.text.trim());
            var array = text.trim().split('/start ref_');
            var response = array.every(emptyArr);
            if (response) {
                start(msg);
                return;
            }
            if (array.length == 2) {
                var invitedBy = array[1];
                invitedBy = Number(invitedBy);
                if (Number.isNaN(invitedBy)) {
                    start(msg);
                    return;
                } else {
                    util.isNewUser(invitedBy, function(response) {
                        if (response === true) {
                            start(msg);
                            return;
                        } else {
                            util.isNewUser(chatId, function(results) {
                                if (results === true) {
                                    bot.sendMessage(chatId, i18n.__('Invited By') + " " + response[0].nameUser).then(function(value) {
                                        start(msg, response[0].chatId);
                                        return;
                                    }, function(err) {

                                    });
                                } else {
                                    start(msg);
                                    return;
                                }
                            }, connection, bot);
                        }
                    }, connection, bot);
                }
            } else {
                start(msg);
                return;
            }
        }
    });

});

bot.on('message', (msg) => {
    chatId = msg.chat.id;
    if (msg.text.indexOf("English") === 0) {
        updateLanguage("en", chatId);
    }
});

bot.on('message', (msg) => {
    chatId = msg.chat.id;
    if (msg.text.indexOf("French") === 0) {
        updateLanguage("fr", chatId);
    }
});

bot.on('message', (msg) => {
    chatId = msg.chat.id;
    if (msg.text.indexOf("Spanish") === 0) {
        updateLanguage("es", chatId);
    }
});

bot.on('message', (msg) => {
    chatId = msg.chat.id;
    if (msg.text.indexOf("German") === 0) {
        updateLanguage("de", chatId);
    }
});

bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (i18n.__(msg.text).trim().indexOf(i18n.__("Invest")) === 0 || i18n.__(msg.text).trim().indexOf(i18n.__("invest")) === 0) {
            bot.sendMessage(msg.chat.id, i18n.__("Official launch is 09/10/2017. Share your referral link to increase your earnings"));
            return;
            util.existingOrder(msg.chat.id, connection, function(response) {
                if (response === false) {
                    init();
                } else {
                    bot.sendMessage(msg.chat.id, i18n.__("You have an existing order to make payment of") + " " +
                        response[0].amount + i18n.__("BTC to bitcoin address:")).then(
                        function(success) {
                            bot.sendMessage(msg.chat.id, response[0].address);
                        },
                        function(error) {

                        }
                    );
                }
            });

            function init() {
                var message = i18n.__("How much do you want to invest?");
                var menu = i18n.__("Main menu");
                bot.sendMessage(msg.chat.id, message, {
                    "reply_markup": {
                        "keyboard": [
                            ["0.02BTC", "0.05BTC"],
                            ["0.1BTC", "0.5BTC"],
                            ["1BTC", "2BTC"],
                            [menu]
                        ]
                    }
                });
            }
        }
    });
});

bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(msg.text.trim()).indexOf("0.02btc") === 0) {
            var message = i18n.__("Pay") + " " + msg.text + " " + i18n.__("to Bitcoin address") + " ";
            util.createOrder(0.02, config.CALLBACK, msg.chat.id, connection, function(order) {
                if (order === false) {

                } else {
                    bot.sendMessage(msg.chat.id, message).then(function(success) {
                        bot.sendMessage(msg.chat.id, order.address).then(
                            function(success) {
                                normalKeyboard(msg.chat.id, i18n.__("Money will be on your deposit after three confirmations."));
                            },
                            function(err) {

                            }
                        );
                    }, function(error) {

                    });
                }
            }, client);

        }
    });
});

bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(msg.text.trim()).indexOf("0.05btc") === 0) {
            var message = i18n.__("Pay") + " " + msg.text + " " + i18n.__("to Bitcoin address") + " ";
            util.createOrder(0.05, config.CALLBACK, msg.chat.id, connection, function(order) {
                if (order === false) {

                } else {
                    bot.sendMessage(msg.chat.id, message).then(function(success) {
                        bot.sendMessage(msg.chat.id, order.address).then(
                            function(success) {
                                normalKeyboard(msg.chat.id, i18n.__("Money will be on your deposit after three confirmations."));
                            },
                            function(err) {

                            }
                        );
                    }, function(error) {

                    });
                }
            }, client);

        }
    });
});

bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(msg.text.trim()).indexOf("0.1btc") === 0) {
            var message = i18n.__("Pay") + " " + msg.text + " " + i18n.__("to Bitcoin address") + " ";
            util.createOrder(0.1, config.CALLBACK, msg.chat.id, connection, function(order) {
                if (order === false) {

                } else {
                    bot.sendMessage(msg.chat.id, message).then(function(success) {
                        bot.sendMessage(msg.chat.id, order.address).then(
                            function(success) {
                                normalKeyboard(msg.chat.id, i18n.__("Money will be on your deposit after three confirmations."));
                            },
                            function(err) {

                            }
                        );
                    }, function(error) {

                    });
                }
            }, client);

        }
    });
});

bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(msg.text.trim()).indexOf("0.5btc") === 0) {
            var message = i18n.__("Pay") + " " + msg.text + " " + i18n.__("to Bitcoin address") + " ";
            util.createOrder(0.5, config.CALLBACK, msg.chat.id, connection, function(order) {
                if (order === false) {

                } else {
                    bot.sendMessage(msg.chat.id, message).then(function(success) {
                        bot.sendMessage(msg.chat.id, order.address).then(
                            function(success) {
                                normalKeyboard(msg.chat.id, i18n.__("Money will be on your deposit after three confirmations."));
                            },
                            function(err) {

                            }
                        );
                    }, function(error) {

                    });
                }
            }, client);

        }
    });
});

bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(msg.text.trim()).indexOf("1btc") === 0) {
            var message = i18n.__("Pay") + " " + msg.text + " " + i18n.__("to Bitcoin address") + " ";
            util.createOrder(1, config.CALLBACK, msg.chat.id, connection, function(order) {
                if (order === false) {

                } else {
                    bot.sendMessage(msg.chat.id, message).then(function(success) {
                        bot.sendMessage(msg.chat.id, order.address).then(
                            function(success) {
                                normalKeyboard(msg.chat.id, i18n.__("Money will be on your deposit after three confirmations."));
                            },
                            function(err) {

                            }
                        );
                    }, function(error) {

                    });
                }
            }, client);

        }
    });
});



bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(msg.text.trim()).indexOf("2btc") === 0) {
            var message = i18n.__("Pay") + " " + msg.text + " " + i18n.__("to Bitcoin address") + " ";
            util.createOrder(2, config.CALLBACK, msg.chat.id, connection, function(order) {
                if (order === false) {

                } else {
                    bot.sendMessage(msg.chat.id, message).then(function(success) {
                        bot.sendMessage(msg.chat.id, order.address).then(
                            function(success) {
                                normalKeyboard(msg.chat.id, i18n.__("Money will be on your deposit after three confirmations."));
                            },
                            function(err) {

                            }
                        );
                    }, function(error) {

                    });
                }
            }, client);

        }
    });
});


bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(i18n.__(msg.text).trim()).indexOf(i18n.__("withdraw")) === 0) {
            var user = msg.chat.id;
            bot.sendMessage(user, i18n.__("Official launch is 09/10/2017. Share your referral link to increase your earnings"));
            return;
            util.getAccount(user, connection, function(account) {
                if (account === true) {
                    var message = i18n.__("Your main balance is low. Please invest.");
                    bot.sendMessage(user, message);
                } else if (account !== true) {
                    if (account.status === config.FROZEN) {
                        var message = i18n.__("Your main balance is low. Please invest.");
                        bot.sendMessage(user, message);
                    } else if (account.status === config.ACTIVE) {
                        var message = i18n.__("Total balance is") + " \n" + account.balance + "BTC";
                        bot.sendMessage(user, message).then(
                            function() {
                                parseBTCResponse(user, account);
                            },
                            function() {

                            }
                        );
                    }
                }
            });
        }
    });

});

bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(i18n.__(msg.text).trim()).includes(i18n.__("balance"))) {
            var user = msg.chat.id;
            bot.sendMessage(user, i18n.__("Official launch is 09/10/2017. Share your referral link to increase your earnings"));
            return;
            util.getAccount(user, connection, function(account) {
                if (account === true) {
                    normalKeyboard(user, i18n.__("Your account no longer exist!"));
                } else {
                    bot.sendMessage(user, i18n.__("Your total balance is") + " " + account.balance + "BTC").then(function(msg) {
                        bot.sendMessage(user, i18n.__("Balance available for withdraw is") + " " + account.dailyMax + "BTC");
                    }, function(err) {});
                }
            });
        }
    });
});

bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(i18n.__(msg.text).trim()).includes(i18n.__("my orders"))) {
            var user = msg.chat.id;
            bot.sendMessage(msg.chat.id, i18n.__("Official launch is 09/10/2017. Share your referral link to increase your earnings"));
            return;
            util.existingOrder(user, connection, function(response) {
                if (response === false) {
                    normalKeyboard(user, i18n.__("You have no pending orders"));
                } else {
                    bot.sendMessage(user, i18n.__("You have an existing order to make payment of") + " " + response[0].amount + i18n.__("BTC to bitcoin address:")).then(function(msg) {
                        normalKeyboard(user, response[0].address);
                    }, function(err) {});
                }
            });
        }
    });
});

bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(i18n.__(msg.text).trim()).includes(i18n.__("transactions"))) {
            var user = msg.chat.id;
            bot.sendMessage(msg.chat.id, i18n.__("Official launch is 09/10/2017. Share your referral link to increase your earnings"));
            return;
            util.getTransaction(user, connection, function(results) {
                if (results === false) {
                    bot.sendMessage(user, i18n.__("You have performed no transaction yet!"));
                } else {
                    results.forEach(function(element, index, array) {
                        var transaction = element;
                        var verb = transaction.verb;
                        var date = transaction.date;
                        date = moment.unix(date).format("MM/DD/YYYY");
                        var transactionJson = transaction.transaction;
                        transaction = JSON.parse(transactionJson);
                        if (verb === config.NEW_PAYMENT) {
                            bot.sendMessage(user, i18n.__("You made a payment of") + " <b>" + transaction.amount + "BTC</b> " + i18n.__("to bitcoin address:") + " \n <b>" +
                                transaction.address + "\n </b> on " + date, { parse_mode: "HTML" });
                        } else if (verb === config.NEW_WITHDRAWAL) {
                            bot.sendMessage(user, i18n.__("You made a withdrawal of") + " <b>" + transaction.amount + "BTC</b> " + i18n.__("to bitcoin address:") + " \n <b>" +
                                transaction.address + "\n </b> " + i18n.__("on") + " " + date, { parse_mode: "HTML" });
                        }
                    });
                }
            });
        }
    });
});


bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(i18n.__(msg.text).trim()).includes(i18n.__("referral system"))) {
            var user = msg.chat.id;
            util.isNewUser(user, function(response) {
                if (response === true) {

                } else {
                    var me = response[0];
                    bot.sendMessage(user, i18n.__("You will earn affiliate commissions up to three levels(8%, 4% and 2%) of any invest and reinvest of members referred.")).then(function(msg) {
                        bot.sendMessage(user, i18n.__("Your referral link is") + " \n https://t.me/cryptosmart_bot?start=ref_" + me.chatId);
                    }, function(err) {

                    });
                }
            }, connection, bot);
        }
    });
});

bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(i18n.__(msg.text).trim()).includes(i18n.__("language"))) {
            var user = msg.chat.id;
            var menu = i18n.__("Main menu");
            var message = i18n.__("Choose your default language");
            bot.sendMessage(msg.chat.id, message, {
                "reply_markup": {
                    "keyboard": [
                        ["English"],
                        ["German"],
                        ["French"],
                        ["Spanish"],
                        [menu]
                    ]
                }
            });
        }
    });
});

bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(i18n.__(msg.text).trim()).includes(i18n.__("support"))) {
            var user = msg.chat.id;
            var message = i18n.__("Write to our 24/7 support mail") + " " + config.EMAIL + "\n Live Chat: https://cryptosmartbot.com";
            normalKeyboard(user, message);
        }
    });
});

bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(i18n.__(msg.text).trim()).includes(i18n.__("my team"))) {
            var user = msg.chat.id;
            bot.sendMessage(msg.chat.id, i18n.__("Official launch is 09/10/2017. Share your referral link to increase your earnings"));
            return;
            util.myTeam(connection, user, function(active, inactive) {
                var message = "You have " + active + " active referral and " + inactive + " inactive referral";
                normalKeyboard(user, message);
            });

        }
    });
});

bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(i18n.__(msg.text).trim()) === i18n.__("help")) {
            var user = msg.chat.id;
            var message = i18n.__("Select from the menu");
            var howW = i18n.__("How to withdraw");
            var howR = i18n.__("How does referral work");
            var howS = i18n.__("How does Smart Trader work");
            var menu = i18n.__("Main menu");
            bot.sendMessage(chatId, message, {
                "reply_markup": {
                    "keyboard": [
                        [howW],
                        [howR],
                        [howS],
                        [menu]
                    ]
                }
            });
        }
    });

});


bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(i18n.__(msg.text).trim()) === i18n.__("how does smart trader work")) {
            var user = msg.chat.id;
            var message = i18n.__("We use your money on digital asset exchange and trading and help grow it within a short period of time and invest in stock market. \n\t We ensure good security by using technical analysis in our trading Platforms.\n\t We are in full control of your investments. We take actions and ensures that we make profits from your trading.\n\t Due to the profits and technical trading of our investors funds and high return nature of our investments, we are able to offer our clients a high-returning safe investment");
            bot.sendMessage(user, message);
        }
    });

});

bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(i18n.__(msg.text).trim()) === i18n.__("how does referral work")) {
            var user = msg.chat.id;
            var message = i18n.__("Use your referral link to invite people. Your balance is credited with the five dollar equivalent of bitcoin when the person you invite successfully completes an order. Referral money is added to your daily withdrawal.") + "  \n" +
                "https://t.me/mata908_bot?start=ref_" + user;
            bot.sendMessage(user, message);
        }
    });

});

bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(i18n.__(msg.text).trim()) === i18n.__("how to withdraw")) {
            var user = msg.chat.id;
            bot.sendMessage(user, i18n.__("Please watch the video to show you how it works")).then(function(suc) {
                bot.sendVideo(user, __dirname + '/assets/tutorial-1.mp4');
                bot.sendChatAction(user, 'upload_video');
            }, function(err) {});
        }
    });

});


bot.on('message', (msg) => {
    util.getLanguage(connection, msg.chat.id, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        if (changeCase.lowerCase(i18n.__(msg.text).trim()) === i18n.__("main menu")) {
            var user = msg.chat.id;
            var message = i18n.__("Welcome back") + " " + msg.chat.first_name;
            normalKeyboard(user, message);
        }
    });

});

function parseBTCResponse(user, account) {
    util.getLanguage(connection, user, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        var message = i18n.__("Money available for withdraw is") + "\n" + account.dailyMax + "BTC";
        bot.sendMessage(user, message).then(function() {
            var message = i18n.__("How much BTC do you want to withdraw?") + "\n <i>" + i18n.__("Tip: Send your response by sending a direct reply to this message.") + "</i>";
            bot.sendMessage(user, message, {
                reply_markup: JSON.stringify({
                    hide_keyboard: true,
                }),
                parse_mode: "HTML"
            }).then(function(msg) {
                bot.onReplyToMessage(msg.chat.id, msg.message_id, function(msg) {
                    var amount = Number(msg.text);
                    if (Number.isNaN(amount)) {
                        bot.sendMessage(user, i18n.__("Invalid response")).then(function(msg) {
                            parseBTCResponse(user, account);
                        }, function(err) {

                        });
                    } else {
                        if (account.dailyMax >= amount) {
                            processPayment(user, amount);
                        } else if (account.dailyMax < amount) {
                            parseBTCResponse(user, account);
                        }
                    }
                });
            }, function(err) {

            });

        }, function() {

        });
    });
}

function processPayment(user, amount) {
    util.getLanguage(connection, user, function(language) {
        if (language !== true) {
            i18n.setLocale(language);
        } else {
            i18n.setLocale('en');
        }
        var opts = {
            reply_markup: JSON.stringify({
                hide_keyboard: true,
            }),
            parse_mode: "HTML"
        };
        bot.sendMessage(user, i18n.__("Enter your bitcoin wallet address") + " \n <i>" + i18n.__("Tip: Send your response by sending a direct reply to this message.") + "</i>", opts).then(
            function(msg) {
                bot.onReplyToMessage(user, msg.message_id, function(msg) {
                    if (util.validateBitcoinAddress(msg.text.trim())) {
                        var address = msg.text.trim();
                        bot.sendMessage(user, i18n.__("You are about to transfer") + " <b>" + amount + "BTC</b>" + " " + i18n.__("to bitcoin wallet address") + " \n<b>" +
                            msg.text.trim() +
                            "</b>\n" + i18n.__("Enter") + " (<b>Yes/No</b>) \n <i>" + i18n.__("Tip: Send your response by sending a direct reply to this message.") + "</i>", opts).then(
                            function(msg) {
                                bot.onReplyToMessage(user, msg.message_id, function(msg) {
                                    if (changeCase.lowerCase(msg.text.trim()).indexOf("yes") === 0) {
                                        normalKeyboard(user, i18n.__("Funds was successfully transferred to your wallet"));
                                        return;
                                        util.payUser(user, amount, address, connection, client, function(response) {
                                            if (response === true) {
                                                normalKeyboard(user, i18n.__("Funds was successfully transferred to your wallet"));
                                            } else {
                                                normalKeyboard(user, i18n.__("Server overload. Please try again later."));
                                            }
                                        });
                                    } else if (changeCase.lowerCase(msg.text.trim()).indexOf("no") === 0) {
                                        normalKeyboard(user, i18n.__("Operation Cancelled"));
                                    } else {
                                        normalKeyboard(user, i18n.__("Invalid response"));
                                    }
                                });
                            },
                            function(err) {

                            }
                        );
                    } else {
                        bot.sendMessage(user, i18n.__("Invalid bitcoin wallet address")).then(function(msg) {
                            processPayment(msg.chat.id, amount);
                        }, function(err) {

                        });
                    }
                });
            },
            function(err) {

            });
    });

}


var app = express();
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('ok');
});

app.post('/v1/confirmOrder', function(req, res) {
    var data = req.body;
    if (nodeUtil.isNullOrUndefined(client)) {
        var client = new Client({
            'apiKey': config.API_KEY,
            'apiSecret': config.API_SECRET
        });
    }
    util.confirmOrder(data, connection, function(response) {
        if (nodeUtil.isBoolean(response)) {

        } else if (nodeUtil.isObject(response)) {
            bot.sendMessage(response.user, response.message);
        }
    }, client);
    res.send('ok');
});

app.listen(port);

/*Cron Job that
 * Runs every weekday (Monday through Sunday)
 * at 00:00:00 AM. 
 */
var job = new CronJob('00 00 00 * * 1-7', function() {
        /* This function is executed when the job start */
        util.increaseBalance(connection);
    }, function() {
        /* This function is executed when the job stops */

    },
    true, /* Start the job right now */
    "GMT" /* Time zone of this job. */
);