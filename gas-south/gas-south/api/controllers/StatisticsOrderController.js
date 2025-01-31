/**
 * StatisticsOrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    revenue: async function (req, res) {
        const {
            startDate,
            endDate,
            customerId,
        } = req.query

        if (!startDate) {
            return res.badRequest(Utils.jsonErr('startDate is required'))
        }

        if (!endDate) {
            return res.badRequest(Utils.jsonErr('startDate is endDate'))
        }

        try {
            const db = await OrderGS.getDatastore().manager;
            const _aggregate = await db.collection("ordergs")
                .aggregate(
                    [
                        {
                            "$match": {
                                "createdAt": {
                                    "$gte": startDate,
                                    "$lte": endDate
                                }
                            }
                        },
                        {
                            "$lookup": {
                                "from": "orderdetail",
                                "localField": "_id",
                                "foreignField": "orderGSId",
                                "as": "orderdetail"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$orderdetail"
                            }
                        },
                        {
                            "$group": {
                                "_id": {
                                    "orderId": "$_id",
                                    "customerId": "$customers"
                                },
                                "revenue": {
                                    "$sum": {
                                        "$multiply": [
                                            "$orderdetail.quantity",
                                            "$orderdetail.price"
                                        ]
                                    }
                                },
                                "orderCode": {
                                    "$first": "$orderCode"
                                }
                            }
                        },
                        {
                            "$lookup": {
                                "from": "shippinggs",
                                "localField": "_id.orderId",
                                "foreignField": "orderID",
                                "as": "shipping"
                            }
                        },
                        {
                            "$lookup": {
                                "from": "user",
                                "localField": "_id.customerId",
                                "foreignField": "_id",
                                "as": "customer"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$customer"
                            }
                        },
                        {
                            "$group": {
                                "_id": "$customer._id",
                                "customerName": {
                                    "$first": "$customer.name"
                                },
                                "orders": {
                                    "$push": "$$ROOT"
                                }
                            }
                        },
                        {
                            "$unset": [
                                "orders.customer"
                            ]
                        }
                    ]
                ).toArray();

            return res.json({
                success: true,
                data: _aggregate,
                message: "Thống kê thành công",
            })

        } catch (error) {
            return res.serverError(Utils.jsonErr(error.message))
        }
    },

    statisticsOrderByShippingType: async function (req, res) {
        const {
            orderId
        } = req.query

        if (!orderId) {
            return res.badRequest(Utils.jsonErr('orderId is required'))
        }

        try {
            const db = await OrderGS.getDatastore().manager;
            const _aggregate = await db.collection("ordergs")
                .aggregate(
                    [
                        {
                            "$match": {
                                "_id": ObjectId(orderId)
                            }
                        },
                        {
                            "$lookup": {
                                "from": "ordergshistory",
                                "localField": "_id",
                                "foreignField": "orderID",
                                "as": "history"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$history"
                            }
                        },
                        {
                            "$lookup": {
                                "from": "historycylinder",
                                "localField": "history._id",
                                "foreignField": "isShipOf",
                                "as": "cylinder"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$cylinder"
                            }
                        },
                        {
                            "$lookup": {
                                "from": "categorycylinder",
                                "localField": "cylinder.category",
                                "foreignField": "_id",
                                "as": "category"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$category"
                            }
                        },
                        {
                            "$group": {
                                "_id": {
                                    "shippingType": "$history.shippingType",
                                    "category": "$cylinder.category"
                                },
                                "categoryName": {
                                    "$first": "$category.name"
                                },
                                "categoryMass": {
                                    "$first": "$category.mass"
                                },
                                "total": {
                                    "$sum": 1.0
                                },
                                "totalMass": {
                                    "$sum": "$category.mass"
                                }
                            }
                        },
                        {
                            "$group": {
                                "_id": "$_id.shippingType",
                                "categories": {
                                    "$push": {
                                        "categoryId": "$_id.category",
                                        "categoryName": "$categoryName",
                                        "categoryMass": "$categoryMass",
                                        "total": "$total",
                                        "totalMass": "$totalMass"
                                    }
                                }
                            }
                        }
                    ]
                ).toArray();

            return res.json({
                success: true,
                data: _aggregate,
                message: "Thống kê thành công",
            })

        } catch (error) {
            return res.serverError(Utils.jsonErr(error.message))
        }
    },

};
