const StripeHandler = require(`./stripeHandler`);
const { PAYMENT_ERRORS } = require('../../../config/constant/payment');
const { SETUP } = require('../../../config/constant/setup');
const { PAYMENT_STATUS } = require('../../../config/authConstant');

module.exports = {
    async createCustomer(userId, email, User) {
        try {
            let stripeObj = await StripeHandler.getStripeObject();
            let customer = await stripeObj.customers.create({
                email: email,
            });

            await User.updateOne(
                {
                    _id: userId,
                },
                {
                    stripeCustomerId: customer.id,
                    cards: [],
                },
            );

            return true;
        } catch (error) {
            console.error('Error -createCustomer', error);
            throw new Error(error);
        }
    },

    async removeCustomer(userId, customerId, User) {
        try {
            let stripeObj = await StripeHandler.getStripeObject();
            let customer = await stripeObj.customers.del(customerId);

            await User.findOneAndUpdate(
                {
                    _id: userId,
                },
                {
                    stripeCustomerId: null,
                },
            );

            return true;
        } catch (error) {
            console.error('Error- removeCustomer ', error);
            throw new Error(error);
        }
    },

    async addCardToCustomer(customerId, token) {
        try {
            let stripeObj = await StripeHandler.getStripeObject();
            return await stripeObj.customers.createSource(customerId, {
                source: token,
            });
        } catch (error) {
            console.error('Error- addCardTOCustomer', error);
            throw new Error(error);
        }
    },

    async setDefaultCustomerCard(customerId, cardId) {
        try {
            let stripeObj = await StripeHandler.getStripeObject();

            return await stripeObj.customers.update(customerId, {
                default_source: cardId,
            });
        } catch (error) {
            console.error('Error -setDefaultCustomerCard', error);
            throw new Error(error);
        }
    },

    /**
     * Function used to get customer data
     * @param {*} customerId
     */
    async retrieveCustomer(customerId) {
        try {
            let stripeObj = await StripeHandler.getStripeObject();

            return await stripeObj.customers.retrieve(customerId);
        } catch (error) {
            console.error('Error -retrieveCustomer', error);
            throw new Error(error);
        }
    },

    /**
     * Function used to get customer cards data
     * @param {*} customerId
     */
    async retrieveCustomerCards(customerId) {
        try {
            let stripeObj = await StripeHandler.getStripeObject();
            return await stripeObj.customers.listSources(customerId, {
                object: 'card',
                limit: 5,
            });
        } catch (error) {
            console.error('Error -retrieveCustomerCards', error);
            throw new Error(error);
        }
    },

    /**
     * Function used to update card
     * @param {*} customerId
     * @param {*} cardId
     * @param {*} cardDetails
     */
    async updateCustomerCard(customerId, cardId, cardDetails) {
        try {
            let stripeObj = await StripeHandler.getStripeObject();

            return await stripeObj.customers.updateSource(customerId, cardId, {
                name: cardDetails.cardHolderName,
                exp_month: cardDetails.expMonth,
                exp_year: cardDetails.expYear,
            });
        } catch (error) {
            console.error('Error -updateCustomerCard', error);
            throw new Error(error);
        }
    },

    /**
     * Function used to remove card
     * @param {*} customerId
     * @param {*} cardId
     */
    async removeCardFromCustomer(customerId, cardId) {
        try {
            let stripeObj = await StripeHandler.getStripeObject();
            return await stripeObj.customers.deleteSource(customerId, cardId);
        } catch (error) {
            console.error('Error -removeCardFromCustomer', error);
            throw new Error(error);
        }
    },

    // async chargeCardVerifyAmount(customerId, cardId, amount) {
    // 	let user = await User.findOne({ stripeCustomerId: customerId });
    // 	try {
    // 		let stripeObj = await StripeHandler.getStripeObject();
    // 		let chargeObj = await stripeObj.charges.create({
    // 			amount: amount * 100, // amount should be in cents
    // 			currency: PAYMENT.CURRENCY_CODE,
    // 			customer: customerId,
    // 			card: cardId,
    // 		});

    // 		if (chargeObj) {
    // 			let transactionObj = await this.retrieveTransaction(
    // 				chargeObj.balance_transaction
    // 			);
    // 			let tax = 0;
    // 			let taxData = _.find(transactionObj.fee_details, { type: "tax" });
    // 			if (taxData && taxData.amount) {
    // 				tax = taxData.amount / 100;
    // 			}
    // 			/** Store Transaction Log **/
    // 			await TransactionLog.create({
    // 				chargeType: TRANSACTION_LOG.STATUS.CARD_VERIFY,
    // 				transactionBy: user.id,
    // 				amount: chargeObj.amount / 100, // convert cents to dollar
    // 				paymentTransactionId: chargeObj.id,
    // 				status: STRIPE.STATUS[chargeObj.status],
    // 				type: STRIPE.TRANSACTION_TYPE.DEBIT,
    // 				remark: STRIPE.MESSAGE.CARD_VERIFY_AMOUNT,
    // 				fees: {
    // 					totalFee: transactionObj.fee / 100,
    // 					stripeFee:
    // 						_.find(transactionObj.fee_details, { type: "stripe_fee" })
    // 							.amount / 100,
    // 					tax: tax,
    // 				},
    // 				card: {
    // 					expMonth: chargeObj.source.exp_month,
    // 					expYear: chargeObj.source.exp_year,
    // 					last4: chargeObj.source.last4,
    // 					brand: chargeObj.source.brand,
    // 					id: chargeObj.source.id,
    // 				},
    // 			});
    // 			/** Store transaction log for admin credit **/
    // 			let transactionLog = await TransactionLog.create({
    // 				chargeType: TRANSACTION_LOG.STATUS.CARD_VERIFY,
    // 				transactionBy: user.id,
    // 				amount: (chargeObj.amount - transactionObj.fee) / 100, // convert cents to dollar and cut charge fees
    // 				paymentTransactionId: chargeObj.id,
    // 				status: STRIPE.STATUS[chargeObj.status],
    // 				type: STRIPE.TRANSACTION_TYPE.CREDIT,
    // 				remark: STRIPE.MESSAGE.CARD_VERIFY_AMOUNT,
    // 				card: {
    // 					expMonth: chargeObj.source.exp_month,
    // 					expYear: chargeObj.source.exp_year,
    // 					last4: chargeObj.source.last4,
    // 					brand: chargeObj.source.brand,
    // 					id: chargeObj.source.id,
    // 				},
    // 			}).fetch();
    // 			// send push notification for failure of card payment
    // 		}

    // 		return chargeObj;
    // 	} catch (err) {
    // 		console.error("Error- charge Card Verify Amount",err);
    // 		let transactionLog = await TransactionLog.create({
    // 			chargeType: TRANSACTION_LOG.STATUS.CARD_VERIFY,
    // 			transactionBy: user.id,
    // 			amount: amount,
    // 			paymentTransactionId: e.raw.charge,
    // 			status: STRIPE.STATUS["failed"],
    // 			type: STRIPE.TRANSACTION_TYPE.DEBIT,
    // 			remark: STRIPE.MESSAGE.CARD_VERIFY_AMOUNT,
    // 			card: _.find(user.cards, { isPrimary: true }),
    // 		}).fetch();

    // 		// send push notification for failure of card payment
    // 		return err;
    // 	}
    // },

    // async createBankAccount(customerId,token) {
    // 	try {
    // 		let stripeObj = await StripeHandler.getStripeObject();
    // 		return await stripeObj.customers.createSource(customerId, {
    // 			source: {
    // 				object:"bank_account",
    // 				country:"CA",
    // 				currency:"cad",
    // 				routing_number:"11000-000",
    // 				account_number:"000111111116",
    // 				account_holder_type:"individual",
    // 				account_holder_name:"DD"

    // 			}
    // 		});
    // 	} catch (error) {
    // 		console.error("Error-createBankAccount",error);
    // 		throw new Error(error);
    // 	}
    // },

    async retrieveAccountDetailsAccount(accountNo) {
        try {
            let stripeObj = await StripeHandler.getStripeObject();

            return await stripeObj.accounts.retrieve(accountNo);
        } catch (error) {
            console.error('Error - retrieveAccountDetailsAccount', error);
            throw new Error(error);
        }
    },

    // async createExternalBankAccount(accountNo, token) {
    // 	try {
    // 		let stripeObj = await StripeHandler.getStripeObject();
    // 		let responseBank = await stripeObj.accounts.createExternalAccount(accountNo, {
    // 			external_account: token,
    // 		});
    // 		return responseBank
    // 	} catch (error) {
    // 		console.error("Error - createExternalBankAccount",error);
    // 		throw new Error(error);
    // 	}
    // },

    async createBankAccount(user, ip, User) {
        try {
            // let dob = moment(user.dob);
            //create a cleaner account on stripe
            // let account = await stripe.accounts.create({
            //   type: 'custom',
            //   country: sails.config.COUNTRY_ISO_CODE,
            //   email: user.primaryEmail,
            //   tos_acceptance: {
            //     date: Math.floor(Date.now() / 1000),
            //     ip: ip
            //   },
            //   legal_entity: {
            //     dob: {
            //       day: parseInt(dob.format('D')),
            //       month: parseInt(dob.format('M')),
            //       year: parseInt(dob.format('YYYY'))
            //     },
            //     first_name: user.firstName,
            //     last_name: user.lastName,
            //     type: "individual"
            //   }
            // });

            //   let userAddress = UtilService.getPrimaryObj(user.addresses);
            let stripeObj = await StripeHandler.getStripeObject();
            let account = await stripeObj.accounts.create({
                type: 'custom',
                country: SETUP.COUNTRY_ISO_CODE,
                email: user.email,
                requested_capabilities: ['card_payments', 'transfers'],
                business_type: 'individual',
                business_profile: {
                    // mcc: '',
                    product_description: 'Physician Service',
                },
                individual: {
                    first_name: 'Rakesh',
                    last_name: 'Roshan',
                    email: 'rakesh@roshan.gmail.com',
                },
                external_account: {
                    object: 'bank_account',
                    country: SETUP.COUNTRY_ISO_CODE,
                    currency: SETUP.CURRENCY_CODE,
                    account_number: '000123456789',
                    routing_number: '11000000',
                },
                tos_acceptance: {
                    date: 1629087669,
                    ip: '66.199.35.130',
                },
            });
            if (account) {
                //update user with customer id
                await User.findOneAndUpdate(
                    { _id: user._id },
                    { stripeCustomerId: account.id },
                );
                return account;
            } else {
                throw new Error('Account cannot be created');
            }
        } catch (e) {
            console.error(e.message);
            throw new Error(e);
        }
    },

    /**
     * Function used to update bank account
     * @param {*} accountNo
     * @param {*} bankAccountId
     */
    async updateBankAccount(accountNo, bankAccountId) {
        try {
            let stripeObj = await StripeHandler.getStripeObject();

            return await stripeObj.accounts.updateExternalAccount(
                accountNo,
                bankAccountId,
                {
                    default_for_currency: true,
                },
            );
        } catch (error) {
            console.error('Error -updateBankAccount', error);
            throw new Error(error);
        }
    },

    /**
     * Function used to remove bank account
     * @param {*} accountNo
     * @param {*} bankAccountId
     */
    async removeBankAccount(accountNo, bankAccountId) {
        try {
            let stripeObj = await StripeHandler.getStripeObject();

            return await stripeObj.accounts.deleteExternalAccount(
                accountNo,
                bankAccountId,
            );
        } catch (error) {
            console.error('Error -removeBankAccount', error);
            throw new Error(error);
        }
    },

    /**
     *
     * @param {*} userId
     * @param {*} amountToBePaid
     */
    async createTransfer(userId, amountToBePaid, User) {
        try {
            let user = await User.findOne({
                id: userId,
            });
            let stripeObj = await StripeHandler.getStripeObject();
            let transferObj = await stripeObj.transfers.create({
                amount: amountToBePaid * 100, // amount should be in cents
                currency: PAYMENT.CURRENCY_CODE,
                destination: user.stripeAccountNo,
            });

            return transferObj;
        } catch (error) {
            console.error('Error -createTransfer', error);
            throw new Error(error);
        }
    },

    /**
     *
     * @param {*} userId
     * @param {*} amountToBePaid
     */
    async createPayout(userId, amountToBePaid, User) {
        try {
            let user = await User.findOne({
                where: {
                    id: userId,
                },
                select: ['stripeAccountNo'],
            });

            let stripeObj = await StripeHandler.getStripeObject();

            return await stripeObj.payouts.create(
                {
                    amount: amountToBePaid * 100, // amount should be in cents
                    currency: PAYMENT.CURRENCY_CODE,
                },
                {
                    stripe_account: user.stripeAccountNo,
                },
            );
        } catch (error) {
            console.error('Error -createPayout', error);
            throw new Error(error);
        }
    },
    async chargeCustomerForAppointment(orderDetails, cardId, User) {
        const user = await User.findOne({ _id: orderDetails.parentId });
        let orderCost = orderDetails.total;
        //TODO
        let data = {
            paymentType: 'STRIPE',
            orderId: orderDetails._id,
            consultingProviderId: orderDetails.consultingProviderId,
            patientId: orderDetails.patientId,
            parentId: orderDetails.parentId,
            orderCost: orderCost,
            cardId: cardId,
            penalty: orderDetails.penalty,
            taxAmount: orderDetails.taxAmount,
            subTotal: orderDetails.subTotal,
        };

        try {
            let stripeObj = await StripeHandler.getStripeObject();
            let chargeObj = await stripeObj.charges.create({
                amount: Math.round(orderCost * 100),
                currency: SETUP.CURRENCY_CODE,
                customer: user.stripeCustomerId,
                card: cardId,
            });
            if (chargeObj) {
                const transactionObj = await this.retrieveTransaction(
                    chargeObj.balance_transaction,
                );
                let tax = 0;
                let taxData = _.find(transactionObj.fee_details, {
                    type: 'tax',
                });
                if (taxData && taxData.amount) {
                    tax = taxData.amount / 100;
                }
                let transactionFees = {
                    totalFee: transactionObj.fee / 100,
                    stripeFee:
                        _.find(transactionObj.fee_details, {
                            type: 'stripe_fee',
                        }).amount / 100,
                    tax: tax,
                };
                let transactionCard = {
                    expMonth: chargeObj.source.exp_month,
                    expYear: chargeObj.source.exp_year,
                    last4: chargeObj.source.last4,
                    brand: chargeObj.source.brand,
                    id: chargeObj.source.id,
                };

                let paymentTransactionId = chargeObj.id;
                data.transactionObj = transactionObj;
                data.tax = tax;
                data.transactionFees = transactionFees;
                data.transactionCard = transactionCard;
                data.paymentTransactionId = paymentTransactionId;
                data.status = PAYMENT_STATUS.SUCCESS;
                data.chargeObj = chargeObj;
                data.transactionSuccess = true;
            }
        } catch (e) {
            data.transactionSuccess = false;
            data.failedTransactionId = e.raw.charge;
            data.status = PAYMENT_STATUS.PAYMENT_FAILED;
            data.errorData = e;
            data.errorData.errorMessage =
                PAYMENT_ERRORS.STRIPE[e.raw.decline_code];
            if (!data.errorMessage || data.errorMessage == '') {
                data.errorMessage =
                    'Transaction was declined by payment gateway due to unknown reason';
            }
        }
        return data;
    },

    /**
     * Function used to get balance
     */
    async balance() {
        try {
            let stripeObj = await StripeHandler.getStripeObject();

            return await stripeObj.balance.retrieve();
        } catch (error) {
            console.error('Error -balance', error);
            throw new Error(error);
        }
    },
    /**
     *
     * @param {*} transactionId
     */
    async retrieveTransaction(transactionId) {
        try {
            let stripeObj = await StripeHandler.getStripeObject();

            return await stripeObj.balanceTransactions.retrieve(transactionId);
        } catch (error) {
            console.error('Error -retrieveTransaction', error);
            throw new Error(error);
        }
    },

    // async chargeCustomerForServiceRequest(serviceOrder, cardId) {
    // 	const user = await User.findOne({ _id: serviceOrder.patientId });
    // 	let serviceOrderCost = serviceOrder.total_price
    // 	let data = {
    // 		paymentType: 'STRIPE',
    // 		serviceOrderId: serviceOrder._id,
    // 		physicianId: serviceOrder.physicianId,
    // 		serviceOrderCost: serviceOrderCost,
    // 		userId: user._id,
    // 		userCards: user.cards,
    // 		orderNumber: serviceOrder.orderNumber
    // 	};
    // 	try {
    // 		let stripeObj = await StripeHandler.getStripeObject();
    // 		let chargeObj = await stripeObj.charges.create({
    // 			amount: Math.round(serviceOrderCost * 100),
    // 			currency: SETUP.CURRENCY_CODE,
    // 			customer: user.stripeCustomerId,
    // 			card: cardId
    // 		});
    // 		if (chargeObj) {
    // 			const transactionObj = await this.retrieveTransaction(chargeObj.balance_transaction);
    // 			let tax = 0;
    // 			let taxData = _.find(transactionObj.fee_details, { type: 'tax' });
    // 			if (taxData && taxData.amount) {
    // 				tax = taxData.amount / 100;
    // 			}
    // 			let transactionFees = {
    // 				totalFee: transactionObj.fee / 100,
    // 				stripeFee: _.find(transactionObj.fee_details, { type: 'stripe_fee' }).amount / 100,
    // 				tax: tax
    // 			};
    // 			let transactionCard = {
    // 				expMonth: chargeObj.source.exp_month,
    // 				expYear: chargeObj.source.exp_year,
    // 				last4: chargeObj.source.last4,
    // 				brand: chargeObj.source.brand,
    // 				id: chargeObj.source.id
    // 			};
    // 			let transactionAmount = chargeObj.amount / 100;
    // 			let paymentTransactionId = chargeObj.id;
    // 			data.transactionObj = transactionObj;
    // 			data.tax = tax;
    // 			data.transactionFees = transactionFees;
    // 			data.transactionCard = transactionCard;
    // 			data.transactionAmount = transactionAmount;
    // 			data.paymentTransactionId = paymentTransactionId;

    // 			data.chargeObj = chargeObj;
    // 			data.transactionSuccess = true;

    // 		}
    // 	} catch (e) {
    // 		data.transactionSuccess = false;
    // 		data.failedTransactionId = e.raw.charge;
    // 		data.status = 'failed';
    // 		data.errorData = e;
    // 		data.errorData.errorMessage = PAYMENT_ERRORS.STRIPE[e.raw.decline_code];
    // 		if (!data.errorMessage || data.errorMessage == '') {
    // 			data.errorMessage = 'Transaction was declined by payment gateway due to unknown reason';
    // 		}
    // 	}
    // 	return data;
    // },
    // async refundPatient(chargeId, fees, amount, remark) {
    // 	try {
    // 	  let obj = {
    // 		charge: chargeId
    // 	  };
    // 	  if (amount) {
    // 		obj.amount = Math.round(amount * 100);
    // 	  }
    // 	  let stripeObj = await StripeHandler.getStripeObject();
    // 	  let refundObj = await stripeObj.refunds.create(obj);
    // 	  if (refundObj) {
    // 		/** Store Transaction Log **/
    // 		let transactionLog = await TransactionLog.findOneAndUpdate({
    // 		  paymentTransactionId: chargeId,
    // 		  type: TRANSACTION_LOG.TRANSACTION_TYPE.DEBIT
    // 		}, {
    // 		  fees: {}// NOTE :: on refund fees are deducted
    // 		})
    // 		transactionLog = transactionLog;
    // 		let appointment = await Appointment.findOne({ _id: transactionLog.appointmentId });
    // 		let patientId = appointment.patientId;

    // 		//create a credit entry in customer account
    // 		let creditTranLog = await TransactionLog.create({
    // 		  paymentTransactionId: chargeId,
    // 		  type: TRANSACTION_LOG.TRANSACTION_TYPE.CREDIT,
    // 		  patientName: transactionLog.patientName,
    // 		  physicianName: transactionLog.physicianName,
    // 		  physicianId: transactionLog.physicianId,
    // 		  chargeType: TRANSACTION_LOG.CHARGE_TYPE.REFUND,
    // 		  amount: refundObj.amount / 100,
    // 		  transactionTo: transactionLog.transactionBy,//credit amount from whom we charged
    // 		  appointmentId: transactionLog.appointmentId,
    // 		  appointmentNumber: transactionLog.appointmentNumber || "",
    // 		  status: STRIPE.STATUS[refundObj.status],
    // 		  remark: remark || STRIPE.MESSAGE.APPOINTMENT_REFUND,
    // 		  card: transactionLog.card
    // 		})
    // 		//create a debit entry in admin account
    // 		// await TransactionLog.create({
    // 		//   isAdminTransaction: true,
    // 		//   paymentTransactionId: chargeId,
    // 		//   type: TRANSACTION_LOG.TRANSACTION_TYPE.DEBIT,
    // 		//   patientName: transactionLog.patientName,
    // 		//   physicianName: transactionLog.physicianName,
    // 		//   chargeType: TRANSACTION_LOG.CHARGE_TYPE.REFUND,
    // 		//   amount: (refundObj.amount / 100) - (fees.totalFee),
    // 		//   transactionTo: transactionLog.transactionBy, //debit entry from customer
    // 		//   appointmetId: transactionLog.appointmentId,
    // 		//   status: STRIPE.STATUS[refundObj.status],
    // 		//   remark: remark || STRIPE.MESSAGE.APPOINTMENT_REFUND,
    // 		//   card: transactionLog.card
    // 		// });
    // 	  } else {
    // 		console.log('error');
    // 	  }

    // 	  return refundObj;
    // 	} catch (e) {
    // 	  console.log(e);
    // 	  throw new Error(e);
    // 	}
    //   }
};
