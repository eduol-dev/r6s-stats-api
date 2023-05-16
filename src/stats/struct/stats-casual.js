module.exports = class Stats {
    constructor(url, name, header, kd, kills, deaths, win_, wins, losses, matches, kills_match, abandons) {

        this.url = url;
        this.name = name;
        this.header = header;
        this.kd = kd;
        this.kills = kills;
        this.deaths = deaths;
        this.win_ = win_;
        this.wins = wins;
        this.abandons = abandons;
        this.losses = losses;
        this.matches = matches;
        this.kills_match = kills_match;
    }
}