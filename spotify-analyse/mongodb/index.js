const mongoose = require('mongoose');

mongoose.connect(env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const apiUserSchema = new mongoose.Schema({
    fk_id_user_api: Number,
    access_token: String,
    refreshtoken: String,
    expries_at: Number,
    scope: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const artistSchema = new mongoose.Schema({
    spotify_id: String,
    name: String,
    image: String,
    artist_data: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ArtistData' }],
    invest_artist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InvestArtist' }]
});

const artistDataSchema = new mongoose.Schema({
    fk_id_artist: Number,
    date: { type: Date, default: Date.now },
    monthly_listeners: Number,
    data_count: { type: Number, default: 0 },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }
});

const investArtistSchema = new mongoose.Schema({
    fk_id_user: Number,
    fk_id_artist: Number,
    coins: Number,
    date: { type: Date, default: Date.now },
    operation_id: Number,
    operation: String,
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const tradeUserSchema = new mongoose.Schema({
    fk_id_user: { type: Number, unique: true },
    coins: { type: Number, default: 10000 },
    coins_invested: { type: Number, default: 0 },
    coins_earned: { type: Number, default: 0 },
    coins_lost: { type: Number, default: 0 },
    coins_invested_total: { type: Number, default: 0 },
    coins_earned_total: { type: Number, default: 0 },
    coins_lost_total: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const userSchema = new mongoose.Schema({
    spotify_id: String,
    name: String,
    email: String,
    image: String,
    api_user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ApiUser' }],
    invest_artist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InvestArtist' }],
    trade_user: { type: mongoose.Schema.Types.ObjectId, ref: 'TradeUser' }
});

const ApiUser = mongoose.model('ApiUser', apiUserSchema);
const Artist = mongoose.model('Artist', artistSchema);
const ArtistData = mongoose.model('ArtistData', artistDataSchema);
const InvestArtist = mongoose.model('InvestArtist', investArtistSchema);
const TradeUser = mongoose.model('TradeUser', tradeUserSchema);
const User = mongoose.model('User', userSchema);

module.exports = { ApiUser, Artist, ArtistData, InvestArtist, TradeUser, User };
