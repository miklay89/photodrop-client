"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const expressions_1 = require("drizzle-orm/expressions");
const get_client_id_from_token_1 = __importDefault(require("../../libs/get_client_id_from_token"));
const db_1 = __importDefault(require("../../data/db"));
dotenv_1.default.config();
const db = db_1.default.Connector;
const { clientTable, photosTable, albumsTable, clientAlbumsTable } = db_1.default.Tables;
class DashboardController {
    constructor() {
        this.getAllAlbums = async (req, res, next) => {
            const clientId = (0, get_client_id_from_token_1.default)(req.header("Authorization")?.replace("Bearer ", ""));
            try {
                const user = await db
                    .select(clientTable)
                    .where((0, expressions_1.eq)(clientTable.clientId, clientId));
                const { phone } = user[0];
                const data = await db
                    .select(photosTable)
                    .innerJoin(albumsTable, (0, expressions_1.eq)(photosTable.albumId, albumsTable.albumId))
                    .where((0, expressions_1.like)(photosTable.clients, phone));
                const insertData = [];
                [...new Set(data.map((d) => d.pd_albums.albumId))].forEach((e) => {
                    insertData.push({ albumId: e, clientId });
                });
                await db
                    .insert(clientAlbumsTable)
                    .values(...insertData)
                    .onConflictDoNothing();
                const albumsAndPhotos = await db
                    .select(clientAlbumsTable)
                    .innerJoin(photosTable, (0, expressions_1.eq)(photosTable.albumId, clientAlbumsTable.albumId))
                    .where((0, expressions_1.and)((0, expressions_1.eq)(clientAlbumsTable.clientId, clientId), (0, expressions_1.like)(photosTable.clients, phone)));
                console.log(albumsAndPhotos);
                res.status(200).json("ok");
            }
            catch (e) {
                next(e);
            }
        };
        this.getAlbumById = async (req, res, next) => {
            try {
                res.status(200).json({ message: "get albums by album id" });
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.default = new DashboardController();
