"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
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
                const allPhotosAndAlbumsByPhone = await db
                    .select(photosTable)
                    .innerJoin(albumsTable, (0, expressions_1.eq)(photosTable.albumId, albumsTable.albumId))
                    .where((0, expressions_1.like)(photosTable.clients, phone));
                const insertData = [];
                [
                    ...new Set(allPhotosAndAlbumsByPhone.map((d) => d.pd_albums.albumId)),
                ].forEach((e) => {
                    insertData.push({ albumId: e, clientId });
                });
                await db
                    .insert(clientAlbumsTable)
                    .values(...insertData)
                    .onConflictDoNothing();
                const mapped = new Map();
                await db
                    .select(clientAlbumsTable)
                    .fields({
                    albumId: clientAlbumsTable.albumId,
                    name: albumsTable.name,
                    location: albumsTable.location,
                    createdAt: albumsTable.createdAt,
                    isUnlocked: clientAlbumsTable.isUnlocked,
                    photos: photosTable,
                })
                    .innerJoin(photosTable, (0, expressions_1.eq)(photosTable.albumId, clientAlbumsTable.albumId))
                    .innerJoin(albumsTable, (0, expressions_1.eq)(albumsTable.albumId, clientAlbumsTable.albumId))
                    .where((0, expressions_1.and)((0, expressions_1.eq)(clientAlbumsTable.clientId, clientId), (0, expressions_1.like)(photosTable.clients, phone)))
                    .then((query) => {
                    if (!query.length)
                        throw boom_1.default.notFound();
                    const uniqAlbumsIds = [...new Set(query.map((q) => q.albumId))];
                    const photos = query.map((q) => q.photos);
                    uniqAlbumsIds.map((uaid) => {
                        const album = query.find((q) => q.albumId === uaid);
                        const reAlb = {
                            albumId: album?.albumId,
                            name: album?.name,
                            location: album?.location,
                            createdAt: album?.createdAt,
                            isUnlocked: album?.isUnlocked,
                            cover: photos.find((p) => p.albumId === uaid)
                                ?.unlockedThumbnailUrl,
                            photos: photos.filter((p) => p.albumId === uaid),
                        };
                        mapped.set(uaid, reAlb);
                    });
                });
                const verifiedResponse = [];
                const arrFromMap = Array.from(mapped.values());
                arrFromMap.forEach((a) => {
                    if (a.isUnlocked) {
                        a.photos.forEach((p) => {
                            p.url = p.unlockedPhotoUrl;
                            p.thumbnail = p.unlockedThumbnailUrl;
                            delete p.lockedPhotoUrl;
                            delete p.lockedThumbnailUrl;
                            delete p.unlockedPhotoUrl;
                            delete p.unlockedThumbnailUrl;
                        });
                    }
                    else {
                        a.photos.forEach((p) => {
                            p.url = p.lockedPhotoUrl;
                            p.thumbnail = p.lockedThumbnailUrl;
                            delete p.lockedPhotoUrl;
                            delete p.lockedThumbnailUrl;
                            delete p.unlockedPhotoUrl;
                            delete p.unlockedThumbnailUrl;
                        });
                    }
                    verifiedResponse.push(a);
                });
                res.status(200).json(verifiedResponse);
            }
            catch (e) {
                next(e);
            }
        };
        this.getAlbumById = async (req, res, next) => {
            const clientId = (0, get_client_id_from_token_1.default)(req.header("Authorization")?.replace("Bearer ", ""));
            const { albumId } = req.params;
            try {
                const user = await db
                    .select(clientTable)
                    .where((0, expressions_1.eq)(clientTable.clientId, clientId));
                const { phone } = user[0];
                const mapped = new Map();
                await db
                    .select(clientAlbumsTable)
                    .fields({
                    albumId: clientAlbumsTable.albumId,
                    name: albumsTable.name,
                    location: albumsTable.location,
                    createdAt: albumsTable.createdAt,
                    isUnlocked: clientAlbumsTable.isUnlocked,
                    photos: photosTable,
                })
                    .innerJoin(photosTable, (0, expressions_1.eq)(photosTable.albumId, clientAlbumsTable.albumId))
                    .innerJoin(albumsTable, (0, expressions_1.eq)(albumsTable.albumId, clientAlbumsTable.albumId))
                    .where((0, expressions_1.and)((0, expressions_1.eq)(clientAlbumsTable.clientId, clientId), (0, expressions_1.like)(photosTable.clients, phone), (0, expressions_1.eq)(albumsTable.albumId, albumId)))
                    .then((query) => {
                    if (!query.length)
                        throw boom_1.default.notFound();
                    const uniqAlbumsIds = [...new Set(query.map((q) => q.albumId))];
                    const photos = query.map((q) => q.photos);
                    uniqAlbumsIds.map((uaid) => {
                        const album = query.find((q) => q.albumId === uaid);
                        const reAlb = {
                            albumId: album?.albumId,
                            name: album?.name,
                            location: album?.location,
                            createdAt: album?.createdAt,
                            isUnlocked: album?.isUnlocked,
                            cover: photos.find((p) => p.albumId === uaid)
                                ?.unlockedThumbnailUrl,
                            photos: photos.filter((p) => p.albumId === uaid),
                        };
                        mapped.set(uaid, reAlb);
                    });
                });
                const verifiedResponse = [];
                const arrFromMap = Array.from(mapped.values());
                arrFromMap.forEach((a) => {
                    if (a.isUnlocked) {
                        a.photos.forEach((p) => {
                            p.url = p.unlockedPhotoUrl;
                            p.thumbnail = p.unlockedThumbnailUrl;
                            delete p.lockedPhotoUrl;
                            delete p.lockedThumbnailUrl;
                            delete p.unlockedPhotoUrl;
                            delete p.unlockedThumbnailUrl;
                        });
                    }
                    else {
                        a.photos.forEach((p) => {
                            p.url = p.lockedPhotoUrl;
                            p.thumbnail = p.lockedThumbnailUrl;
                            delete p.lockedPhotoUrl;
                            delete p.lockedThumbnailUrl;
                            delete p.unlockedPhotoUrl;
                            delete p.unlockedThumbnailUrl;
                        });
                    }
                    verifiedResponse.push(a);
                });
                res.status(200).json(verifiedResponse);
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.default = new DashboardController();
