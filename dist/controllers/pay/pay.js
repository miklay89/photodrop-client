"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const boom_1 = __importDefault(require("@hapi/boom"));
const expressions_1 = require("drizzle-orm/expressions");
const dotenv_1 = __importDefault(require("dotenv"));
const get_client_id_from_token_1 = __importDefault(require("../../libs/get_client_id_from_token"));
const db_1 = __importDefault(require("../../data/db"));
dotenv_1.default.config();
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const REDIRECT_URL = process.env.REDIRECT_URL;
const stripe = new stripe_1.default(STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });
const db = db_1.default.Connector;
const { clientTable, clientAlbumsTable, albumsTable, photosTable } = db_1.default.Tables;
class PayController {
    constructor() {
        this.createPaymentForAlbum = async (req, res, next) => {
            const clientId = (0, get_client_id_from_token_1.default)(req.header("Authorization")?.replace("Bearer ", ""));
            const { albumId } = req.params;
            try {
                const user = await db
                    .select(clientTable)
                    .where((0, expressions_1.eq)(clientTable.clientId, clientId));
                let { phone } = user[0];
                if (phone[0] === "+")
                    phone = phone.slice(1);
                const paymentObject = [];
                await db
                    .select(clientAlbumsTable)
                    .innerJoin(photosTable, (0, expressions_1.eq)(photosTable.albumId, clientAlbumsTable.albumId))
                    .innerJoin(albumsTable, (0, expressions_1.eq)(albumsTable.albumId, clientAlbumsTable.albumId))
                    .where((0, expressions_1.and)((0, expressions_1.eq)(clientAlbumsTable.clientId, clientId), (0, expressions_1.like)(photosTable.clients, `%${phone}%`), (0, expressions_1.eq)(albumsTable.albumId, albumId)))
                    .then((query) => {
                    if (!query.length)
                        throw boom_1.default.notFound();
                    const sorted = {
                        albumInfo: query[0].pd_albums,
                        count: query.map((q) => q.pd_photos).length,
                    };
                    paymentObject.push(sorted);
                });
                const product = await stripe.products.create({
                    name: paymentObject[0].albumInfo.name,
                });
                const price = await stripe.prices.create({
                    currency: "usd",
                    unit_amount: 100,
                    product: product.id,
                });
                const paymentLink = await stripe.paymentLinks.create({
                    line_items: [{ price: price.id, quantity: paymentObject[0].count }],
                    after_completion: {
                        type: "redirect",
                        redirect: {
                            url: `${REDIRECT_URL}/pay/album/confirm-payment/${albumId}`,
                        },
                    },
                });
                res.status(200).json(paymentLink.url);
            }
            catch (e) {
                next(e);
            }
        };
        this.confirmPaymentForAlbum = async (req, res, next) => {
            const clientId = (0, get_client_id_from_token_1.default)(req.header("Authorization")?.replace("Bearer ", ""));
            const { albumId } = req.params;
            try {
                await db
                    .update(clientAlbumsTable)
                    .set({ isUnlocked: true })
                    .where((0, expressions_1.and)((0, expressions_1.eq)(clientAlbumsTable.clientId, clientId), (0, expressions_1.eq)(clientAlbumsTable.albumId, albumId)))
                    .returning()
                    .then((query) => res.json(query[0]));
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.default = new PayController();
