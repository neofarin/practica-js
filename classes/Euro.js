Array.prototype.shuffle = function () {
    let i, j, k;
    for (i = this.length -1; i > 0; i--) {
      j = Math.floor(Math.random() * i)
      k = this[i]
      this[i] = this[j]
      this[j] = k
    }
    return this;
}

export const GROUPS = ["A","B","C","D"];
export const HOME = 0;
export const AWAY = 1;
export const groupPhaseRanking = [];

export default class Euro {
    constructor (allTeams) {
        this.allTeams = allTeams;
    }
    play() {
        const goals = [0,1,2,3,4,5,6,7,8,9,10];
        const goalsFor = goals.shuffle();
        return goalsFor[0];
    }
}