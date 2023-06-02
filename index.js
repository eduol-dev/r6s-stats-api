const Stats = require('./src/stats/stats');
const Fetch = require('./src/fetch');
const rankImg = require('./src/fetch/modules/rankimg');
const checkPlatform = require('./src/fetch/modules/checkplatform');
const checkNumber = require('./src/fetch/modules/checknumber');


let stats_general = new Stats.dataGeneral();
let stats_casual = new Stats.dataCasual();
let stats_rank = new Stats.dataRank();
// let stats_unrank = new Stats.dataUnrank(); // Deprecated unrank.
let stats_deathmatch = new Stats.dataDeathmatch();
let stats_operator = new Stats.dataOperator();


const API_ERROR = `If you see this error, it means it's an API error, please report this error on Github.`;

module.exports = {
  general: async function (platform, name) {
    if (typeof platform !== 'string' || typeof name !== 'string') return 'FORMAT_ERROR';
    if (!checkPlatform(platform.toLowerCase())) return 'PLATFORM_ERROR';

    let url = `https://r6.tracker.network/profile/${platform.toLowerCase()}/${name}/`;
    let track = await Fetch.general(url);

    if (track[0] === 'error') return 'NOT_FOUND';
    if (track[0] === 'timeout') return 'TIME_OUT';

    let header = track[0];
    let level = track[1];
    let profile = track[2];

    if (typeof (profile) === 'undefined') throw new Error(API_ERROR);

    stats_general.url = url;
    stats_general.name = name;
    stats_general.header = header;

    stats_general.level = level[level.indexOf('Level') + 1];

    stats_general.kd = checkNumber(profile[profile.indexOf('KD') + 1]);
    stats_general.kills = checkNumber(level[level.indexOf('Kills') + 1]);
    stats_general.deaths = checkNumber(profile[profile.indexOf('Deaths') + 1]);
    stats_general.win_ = profile[profile.indexOf('Win %') + 1];
    stats_general.wins = checkNumber(profile[profile.indexOf('Wins') + 1]);
    stats_general.losses = checkNumber(profile[profile.indexOf('Losses') + 1]);

    stats_general.headshot_ = profile[profile.indexOf('Headshot %') + 1];
    stats_general.headshots = checkNumber(profile[profile.indexOf('Headshots') + 1]);

    stats_general.time_played = profile[profile.indexOf('Time Played') + 1];
    stats_general.matches_played = checkNumber(profile[profile.indexOf('Matches Played') + 1]);
    stats_general.total_xp = profile[profile.indexOf('Total XP') + 1];
    stats_general.melee_kills = checkNumber(profile[profile.indexOf('Melee Kills') + 1]);
    stats_general.blind_kills = checkNumber(profile[profile.indexOf('Blind Kills') + 1]);

    return stats_general;
  },

  casual: async function (platform, name) {
    if (typeof platform !== 'string' || typeof name !== 'string') return 'FORMAT_ERROR';
    if (!checkPlatform(platform.toLowerCase())) return 'PLATFORM_ERROR';
    let url = `https://r6s-proxy.vercel.app/api/handler?user=${name}&plat=${platform}`;
    let track = await Fetch.casual(url);

    if (track[0] === 'error') return 'NOT_FOUND';
    if (track[0] === 'timeout') return 'TIME_OUT';

    let header = track[0];
    let casual = track[1];

    stats_casual.url = url;
    stats_casual.name = name;
    stats_casual.header = header;

    if (casual) {

      stats_casual.kd = checkNumber(casual[casual.indexOf('K/D') + 1]);
      stats_casual.kills = checkNumber(casual[casual.indexOf('Kills') + 1]);
      stats_casual.deaths = checkNumber(casual[casual.indexOf('Deaths') + 1]);
      stats_casual.win_ = checkNumber(casual[casual.indexOf('Win %') + 1]);
      stats_casual.wins = checkNumber(casual[casual.indexOf('Wins') + 1]);
      stats_casual.abandons = checkNumber(casual[casual.indexOf('Abandons') + 1])
      stats_casual.losses = checkNumber(casual[casual.indexOf('Losses') + 1]);
      stats_casual.matches = checkNumber(stats_casual.wins + stats_casual.losses + stats_casual.abandons);
      stats_casual.kills_match = checkNumber(casual[casual.indexOf('Kills/Match') + 1])
    } else {
      const new_stats = {
        "kd": 0,
        "kills": 0,
        "deaths": 0,
        "win_": 0,
        "wins": 0,
        "abandons": 0,
        "losses": 0,
        "matches": 0,
        "kills_match": 0
      };
      stats_rank = { ...new_stats }
    }
    return stats_casual;
  },

  rank: async function (platform, name) {
    if (typeof platform !== 'string' || typeof name !== 'string') return 'FORMAT_ERROR';
    if (!checkPlatform(platform.toLowerCase())) return 'PLATFORM_ERROR';

    let url = `https://r6s-proxy.vercel.app/api/handler?user=${name}&plat=${platform}`;
    let track = await Fetch.rank(url);

    if (track[0] === 'error') return 'NOT_FOUND';
    if (track[0] === 'timeout') return 'TIME_OUT';

    let header = track[0];
    let rank = track[1];

    stats_rank.url = url;
    stats_rank.name = name;
    stats_rank.header = header;

    if (rank) {
      stats_rank.kd = checkNumber(rank[rank.indexOf('K/D') + 1]);
      stats_rank.kills = checkNumber(rank[rank.indexOf('Kills') + 1]);
      stats_rank.deaths = checkNumber(rank[rank.indexOf('Deaths') + 1]);
      stats_rank.win_ = checkNumber(rank[rank.indexOf('Win %') + 1]);
      stats_rank.wins = checkNumber(rank[rank.indexOf('Wins') + 1]);
      stats_rank.losses = checkNumber(rank[rank.indexOf('Losses') + 1]);
      stats_rank.abandons = checkNumber(rank[rank.indexOf('Abandons') + 1])

      stats_rank.matches = checkNumber(stats_rank.wins + stats_rank.losses + stats_rank.abandons);
      stats_rank.kills_match = checkNumber(rank[rank.indexOf('Kills/match') + 1]);

      stats_rank.mmr = checkNumber(rank[rank.indexOf('Rank Points') + 1].replace(',', ''))

      stats_rank.rank = typeof (rank?.indexOf('Rank')) === 'undefined' ? 'UNRANKED' : rank[rank.indexOf('Rank') + 1];
      stats_rank.rank_img = rankImg(stats_rank.rank);
    } else {
      const new_stats = {
        "kd": 0,
        "kills": 0,
        "deaths": 0,
        "win_": 0,
        "wins": 0,
        "losses": 0,
        "abandons": 0,
        "matches": 0,
        "kills_match": 0,
        "mmr": 0,
        "rank": "-"
      };
      stats_rank = { ...new_stats }
    }
    return stats_rank;
  },

  deathmatch: async function (platform, name) {
    if (typeof platform !== 'string' || typeof name !== 'string') return 'FORMAT_ERROR';
    if (!checkPlatform(platform.toLowerCase())) return 'PLATFORM_ERROR';

    let url = `https://r6.tracker.network/profile/${platform.toLowerCase()}/${name}/`;
    let track = await Fetch.deathmatch(url);

    if (track[0] === 'error') return 'NOT_FOUND';
    if (track[0] === 'timeout') return 'TIME_OUT';

    let header = track[0];
    let rank = track[1];
    let profile = track[1];

    if (typeof (profile) === 'undefined') return 'NEVER_PLAY';


    stats_deathmatch.url = url;
    stats_deathmatch.name = name;
    stats_deathmatch.header = header;

    stats_deathmatch.kd = checkNumber(profile[profile.indexOf('K/D') + 1]);
    stats_deathmatch.kills = checkNumber(profile[profile.indexOf('Kills') + 1]);
    stats_deathmatch.deaths = checkNumber(profile[profile.indexOf('Deaths') + 1]);
    stats_deathmatch.win_ = profile[profile.indexOf('Win %') + 1];
    stats_deathmatch.wins = checkNumber(profile[profile.indexOf('Wins') + 1]);
    stats_deathmatch.losses = checkNumber(profile[profile.indexOf('Losses') + 1]);

    stats_deathmatch.abandons = checkNumber(profile[profile.indexOf('Abandons') + 1]);
    stats_deathmatch.matches = String(parseInt(stats_deathmatch.wins) + parseInt(stats_deathmatch.losses) + parseInt(stats_deathmatch.abandons));
    stats_deathmatch.kills_match = checkNumber(profile[profile.indexOf('Kills/Match') + 1]);

    stats_deathmatch.mmr = typeof (rank?.indexOf('Rank Points')) === 'undefined' ? '0' : checkNumber(rank[rank.indexOf('Rank Points') + 1]);
    stats_deathmatch.rank = typeof (rank?.indexOf('Rank')) === 'undefined' ? 'UNRANKED' : rank[rank.indexOf('Rank') + 1];
    stats_deathmatch.rank_img = rankImg(stats_deathmatch.rank);

    return stats_deathmatch;
  },

  operator: async function (platform, name, operator) {
    if (typeof platform !== 'string' || typeof name !== 'string') return 'FORMAT_ERROR';
    if (!checkPlatform(platform.toLowerCase())) return 'PLATFORM_ERROR';

    let url = `https://r6.tracker.network/profile/${platform.toLowerCase()}/${name}/operators`;
    let track = await Fetch.operator(url, operator.toUpperCase());

    if (track[0] === 'error') return 'NOT_FOUND';
    if (track[0] === 'timeout') return 'TIME_OUT';
    if (track[0] === 'operator_error') return 'OPERATOR_ERROR';

    let header = track[0];
    let operator_img = track[1];
    let board = track[2];
    let profile = track[3];

    if (typeof (profile) === 'undefined') throw new Error(API_ERROR);


    stats_operator.url = url;
    stats_operator.name = name;
    stats_operator.header = header;

    stats_operator.operator = profile[board.indexOf('Operator ')];

    stats_operator.kd = checkNumber(profile[board.indexOf('K/D')]);
    stats_operator.kills = checkNumber(profile[board.indexOf('Kills')]);
    stats_operator.deaths = checkNumber(profile[board.indexOf('Deaths')]);
    stats_operator.win_ = profile[board.indexOf('Win %')];
    stats_operator.wins = checkNumber(profile[board.indexOf('Wins')]);
    stats_operator.losses = checkNumber(profile[board.indexOf('Losses')]);

    stats_operator.headshots_ = profile[board.indexOf('Headshot %')];

    stats_operator.time_played = profile[board.indexOf('Time Played')];
    stats_operator.dbnos = profile[board.indexOf('DBNOs')];
    stats_operator.xp = profile[board.indexOf('XP')];
    stats_operator.melee_kills = checkNumber(profile[board.indexOf('Melee Kills')]);
    stats_operator.operator_stat = profile[board.indexOf('Operator Stat')];
    stats_operator.operator_img = operator_img;

    return stats_operator;
  },

  matches: async function (platform, name) {
    if (typeof platform !== 'string' || typeof name !== 'string') return 'FORMAT_ERROR';
    if (!checkPlatform(platform.toLowerCase())) return 'PLATFORM_ERROR';
    let url = `https://r6s-proxy.vercel.app/api/handler?user=${name}&plat=${platform}&operation=matches`;
    return await Fetch.matches(url);
  },
};
