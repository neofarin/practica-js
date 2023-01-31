export class Team {
    constructor(name = "unnamed") {
      this.name = name;
      this.points = 0;
      this.goals = 0;
      this.goalsAgainst = 0;
      this.goalsDiff = 0;
    }
  
    getName() {
      return this.name;
    }
  
    //goles aleatorios
    play() {
      const goals = Math.floor(Math.random() * 10);
      return goals;
    }
  
    //goloes de cada equipoc. A favor y en contra
    setGoals(goals = 0, goalsAgainst = 0) {
      this.goals += goals;
      this.goalsAgainst += goalsAgainst;
      this.goalsDiff = this.goals - this.goalsAgainst;
    }
  
    // Para reset  goles
    resetGoals() {
      this.goals = 0;
      this.goalsAgainst = 0;
      this.goalsDiff = 0;
    }
  }
  