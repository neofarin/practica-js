export class League {
    constructor(name = "unnamed league") {
      this.name = name;
      this.randomizedTeams = [];
      this.groups = [];
      this.pointsPerWin = 3;
      this.pointsPerDraw = 1;
      this.cualifiedTeams = {};
      this.semifinalWinners = [];
      this.semifinalLosers = [];
    }
  
    startLeague(teams = []) {
      // Ejecuta la fase de grupos
      this.setupGroupStage(teams);
      // Para jugar fase de grupos
      this.playGroupStage(this.groups);
      // Configurar eliminatorias
      this.setupPlayoffs(this.groups);
      // Jugar eliminatorias/cuartos
      this.playPlayoffs(this.cualifiedTeams);
      // Para jugar la semifinal
      this.playSemifinals(this.cualifiedTeams);
      // Se juega final
      this.playFinal(this.semifinalWinners);
    }
  
    // Para connfigurar fase de equipos
    setupGroupStage(teams) {
      // Array de equipos  aleatoriamente 
      this.raffleTeams(teams);
  
      // Se crean grupos de 4 equipos random
      this.makeGroups(this.randomizedTeams);
  
      // Todos contra todos(3 jornadas)
      this.allVsAll(this.groups);
  
      // Mostrar por consola los grupos resultantes
      this.displayGroups(this.groups);
    }
  
    raffleTeams(teams = []) {
      if (teams.length > 0) {
        const randomIndex = Math.floor(Math.random() * teams.length);
  
        this.randomizedTeams.push(teams.splice(randomIndex, 1));
        this.raffleTeams(teams);
      } else {
        this.randomizedTeams = this.randomizedTeams.flat();
      }
    }
  
    makeGroups(teams = [], group = 0) {
      // Condición de salida de la recursividad
      if (teams.length == 0) {
        return;
      }
  
      // El parámetro group recibido será el nombre del grupo
      const names = {
        0: "Grupo A",
        1: "Grupo B",
        2: "Grupo C",
        3: "Grupo D",
      };
      const newGroup = {
        groupName: `${names[group]}`,
        matchDays: { day1: [], day2: [], day3: [] },
        members: [],
      };
  
      // Añadir 4 equipos al array miembros del grupo
      let counter = 0;
      while (counter < 4) {
        newGroup.members.push(teams.shift());
        counter++;
      }
  
      // Añadir cada grupo de equipos al array grupos y repetir
      this.groups.push(newGroup);
      this.makeGroups(teams, ++group);
    }
  
    allVsAll(groups = []) {
      const randomizeMatches = (teams, matchDays) => {
        const matches = [];
  
        for (let i = 0; i < teams.length - 1; i++) {
          matches.push(teams[i], teams[teams.length - 1]);
          if (teams[i] !== teams[teams.length - 2]) {
            matches.push(teams[i], teams[teams.length - 2]);
          } else {
            matches.push(teams[0], teams[1]);
          }
        }
  
        let teamCounter = 0;
        let matchCounter = 0;
        while (matches.length > 0) {
          if (teamCounter < 4) {
            if (matchCounter !== 1) {
              matchDays[`day${matchCounter + 1}`].push(matches.pop());
            }
            if (matchCounter == 1 && teamCounter < 2) {
              matchDays[`day${matchCounter + 1}`].push(matches.pop());
            }
            if (matchCounter == 1 && teamCounter > 1) {
              matchDays[`day${matchCounter + 1}`].push(matches.shift());
            }
            teamCounter++;
          }
          if (teamCounter == 4) {
            teamCounter = 0;
            matchCounter++;
          }
        }
      };
      // Recorrer los grupos y crear las jornadas aleatorias
      groups.forEach((group) => {
        randomizeMatches(group.members, group.matchDays);
      });
    }
  
    displayGroups(groups = []) {
      console.log("======================================");
      console.log("||***|| Grupos y equipos ||***||");
      console.log("======================================");
  
      groups.forEach((group) => {
        console.log(`\n[!] ${group.groupName}`);
        console.log("========================");
  
        group.members.forEach((team) => {
          console.log(`[-] ${team.name}`);
        });
        let counter = 0;
        for (const day in group.matchDays) {
          counter++;
          console.log(`\n[!] Jornada ${counter}:`);
  
          for (let i = 0; i < group.matchDays[day].length; i += 2) {
            console.log(
              "[-]",
              group.matchDays[day][i].name,
              "VS",
              group.matchDays[day][i + 1].name
            );
          }
        }
      });
    }
  
    // Jugar la fase de grupos y mostrar los resultados
    playGroupStage(groups = []) {
      console.log("\n\n======================================");
      console.log(`||***|| ${this.name}!! ||***||`);
      console.log("======================================");
  
      groups.forEach((group) => {
        const { matchDays } = group;
        let counter = 0;
        for (const day in matchDays) {
          const [team1, team2, team3, team4] = matchDays[day];
          counter++;
          console.log("\n________________________\n");
          console.log(`[!] ${group.groupName} - Jornada ${counter}:`);
          console.log("========================");
          const [goals1, goals2] = this.playMatch(team1, team2);
          console.log(`[-] ${team1.name} ${goals1} - ${team2.name} ${goals2}`);
          const [goals3, goals4] = this.playMatch(team3, team4);
          console.log(`[-] ${team3.name} ${goals3} - ${team4.name} ${goals4}`);
          this.sortGroups(group.members);
          console.table(group.members);
        }
      });
    }
  
    playMatch(teamA, teamB) {
      const goalsA = teamA.play();
      const goalsB = teamB.play();
  
      teamA.setGoals(goalsA, goalsB);
      teamB.setGoals(goalsB, goalsA);
  
      if (goalsA > goalsB) {
        teamA.points += this.pointsPerWin;
      } else if (goalsA === goalsB) {
        teamA.points += this.pointsPerDraw;
        teamB.points += this.pointsPerDraw;
      } else {
        teamB.points += this.pointsPerWin;
      }
      return [goalsA, goalsB];
    }
  
    // Ordenar los equipos dentro del grupo en función de puntos
    sortGroups(teams = []) {
      for (let i = 0; i < teams.length; i++) {
        for (let j = 0; j < teams.length - i - 1; j++) {
          // Ordenar por mayor número de puntos
          if (teams[j].points < teams[j + 1].points) {
            let tmp = teams[j + 1];
            teams[j + 1] = teams[j];
            teams[j] = tmp;
          }
          // Ordenar por diferencia de goles si tienen mismos puntos
          if (teams[j].points == teams[j + 1].points) {
            if (teams[j].goalsDiff < teams[j + 1].goalsDiff) {
              let tmp = teams[j + 1];
              teams[j + 1] = teams[j];
              teams[j] = tmp;
            }
            // Ordenar alfabéticamente si tienen misma diferencia de goles
            if (teams[j].goalsDiff == teams[j + 1].goalsDiff) {
              if (teams[j].name > teams[j + 1].name) {
                let tmp = teams[j];
                teams[j] = teams[j + 1];
                teams[j + 1] = tmp;
              }
            }
          }
        }
      }
    }
  
    // Crear la configuración de equipos clasificados para los playoff
    setupPlayoffs(groups = []) {
      const firsts = [];
      const seconds = [];
      groups.forEach((group) => {
        firsts.push(group.members.shift());
        seconds.push(group.members.shift());
      });
      console.log(
        "\n==========================================================="
      );
      console.log("||***|| Comienza las fases eliminatorias del torneo  ||***||");
      console.log(
        "===========================================================\n"
      );
      console.log("Equipos que participan en el playoff:\n");
      const grou = ["Grupo A", "Grupo B", "Grupo C", "Grupo D"];
      for (let i = 0; i < 4; i++) {
        console.log(`[!] ${grou[i]}`);
        console.log(`[-] ${firsts[i].name}, ${seconds[i].name}`);
        console.log("===================\n");
      }
      // total: 8/2  = 4
      let index = 0;
      while (index < 4) {
        index++;
        this.cualifiedTeams[`${index}`] = [];
        if (firsts.length > 0) {
          this.cualifiedTeams[`${index}`].push(firsts.shift(), seconds.pop());
        }
      }
    }
  
    playPlayoffs(cualifiedTeams = {}) {
      console.log("\n======================================");
      console.log("||***|| Cuartos de Final ||***||");
      console.log("======================================\n");
      Object.values(cualifiedTeams).forEach((team, index) => {
        const winner = this.knockoutMatch(team[0], team[1]);
        console.log(
          `[-] ${team[0].name} ${team[0].goals} - ${team[1].goals} ${team[1].name} => ${team[winner].name}`
        );
        this.cualifiedTeams[`${index + 1}`] = team[winner];
      });
    }
  
    playSemifinals(cualifiedTeams = {}) {
      console.log("\n======================================");
      console.log("||***||       Semifinal         |***||");
      console.log("======================================\n");
      const semifinalTeams = Object.values(cualifiedTeams);
      let sem1 = [];
      let sem2 = [];
      for (let i = 0; i < semifinalTeams.length; i++) {
        if (i % 2 === 0) {
          sem2.push(semifinalTeams[i]);
        } else {
          sem1.push(semifinalTeams[i]);
        }
      }
      const sem1index = this.knockoutMatch(sem1[0], sem1[1]);
      const sem2index = this.knockoutMatch(sem2[0], sem2[1]);
  
      let aux = [...sem1];
      let sem1Winner = aux.splice(sem1index, 1).pop();
  
      this.semifinalLosers = [...aux];
  
      aux = [...sem2];
      let sem2Winner = aux.splice(sem2index, 1).pop();
  
      console.log(
        `[-] ${sem1[0].name} ${sem1[0].goals} - ${sem1[1].goals} ${sem1[1].name} => ${sem1Winner.name} `
      );
      console.log(
        `[-] ${sem2[0].name} ${sem2[0].goals} - ${sem2[1].goals} ${sem2[1].name} => ${sem2Winner.name} `
      );
      this.semifinalLosers.push([...aux].pop());
      this.semifinalWinners.push(sem1Winner, sem2Winner);
  
      console.log("\n======================================");
      console.log("||***|| Tercer y Cuarto Puesto ||***||");
      console.log("======================================\n");
  
      const third = this.knockoutMatch(
        this.semifinalLosers[0],
        this.semifinalLosers[1]
      );
  
      console.log(
        `[-] ${this.semifinalLosers[0].name} ${this.semifinalLosers[0].goals} - ${this.semifinalLosers[1].goals} ${this.semifinalLosers[1].name} => ${this.semifinalLosers[third].name}`
      );
    }
  
    playFinal(teams = []) {
      console.log("\n======================================");
      console.log("||***||          Final         ||***||");
      console.log("======================================\n");
  
      const winner = this.knockoutMatch(teams[0], teams[1]);
      console.log(
        `[-] ${teams[0].name} ${teams[0].goals} - ${teams[1].goals} ${teams[1].name} => ${teams[winner].name}`
      );
  
      console.log("\n===============================================");
      console.log(`||***|| ${teams[winner].name} Campeona EuroWomenCup22!!||***||`);
      console.log("===============================================\n");
    }
  
    // Retornar 0 si gana A o 1 si gana B. Si tienen los mismos
    // goles se vuelve a jugar.
    knockoutMatch(teamA, teamB) {
      teamA.resetGoals();
      teamB.resetGoals();
  
      const goalsA = teamA.play();
      const goalsB = teamB.play();
  
      if (goalsA == goalsB) {
        return this.knockoutMatch(teamA, teamB);
      }
  
      teamA.setGoals(goalsA);
      teamB.setGoals(goalsB);
  
      if (goalsA > goalsB) {
        return 0;
      } else {
        return 1;
      }
    }
  }
  