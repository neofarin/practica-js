import {GROUPS, HOME, AWAY, groupPhaseRanking} from "./Euro.js";

const matchdayAndMatchesScheduleComplete = [];
const teamsWithInformation = [];

import Euro from "./Euro.js";

export default class GroupStage extends Euro{
    constructor(allTeams) {
        super(allTeams); 
        this.groupsReady = [];
        this.teamsRandomized = [];
        this.ranking = [];
        this.randomizedTeamsAndAssignTeamsToGroups();
        this.initializedTeamsWithInformation();
        this.matchdayAndMatchesSchedule();
        this.printRoundsPerEachGroup();  /** REQUISITO 1**/
        this.playGamesOfGroupStage();
    }


    randomizedTeamsAndAssignTeamsToGroups () {
        this.teamsRandomized = this.allTeams.shuffle();
        let start = 0;
        let end = 3;
    
        GROUPS.map(name => {
            const teams = [];
            for (let a = start; a <= end; ++a) {
                teams.push(this.teamsRandomized[a]);
            }
            start += 4;
            end += 4;
            this.groupsReady.push(teams);
        });
    }
    
    initializedTeamsWithInformation () {
        let a = 0;
        this.teamsRandomized.map( (name, index) => {
            const team = {
                group: GROUPS[a],
                name: name,
                teamsAgainst: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,], //array of objects , who won? drawn, lost, how many goals against and goalsfor
                points: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalsDifference: 0,
            }
            teamsWithInformation.push(team);
           
            if ((index+1) %4 === 0) { ++a }
        });
    }
    
    matchdaysAndMatchesTemplatePerGroup () {
        const gamesTemplate = [];
        const teamsPerGroup = 4;
        const numberOfMatchDays = teamsPerGroup - 2;
        const numberOfMatches = (teamsPerGroup / 2) -1;
        for (let a = 0; a <= numberOfMatchDays; ++a) {
            const matches = [];
            for (let b = 0; b <= numberOfMatches; ++b) {
                matches.push([HOME,AWAY]);
            }
            gamesTemplate.push(matches);
        }
        return gamesTemplate;
    }

    matchdaysAndMatchesBoardPerGroup(group) {
        const gamesTemplate= this.matchdaysAndMatchesTemplatePerGroup();
        let normalCount = 0;
        let reverseCount = group.length - 2;
        const lastTeam = group.length - 1
        const NextToLastTeam = group.length - 2;
        gamesTemplate.map((round, roundIndex) => {
            round.map((match,matchIndex) => {
                if (matchIndex === 0) {
                    if (roundIndex === 0 || roundIndex%2 === 0) {
                        match[HOME] = normalCount;
                        match[AWAY] = lastTeam;
                    } else {
                        match[HOME] = lastTeam;
                        match[AWAY] = normalCount;
                    }
                } else {
                    match[HOME] = normalCount;
                    match[AWAY] = reverseCount;
                    --reverseCount;
                    if (reverseCount === -1) { reverseCount = NextToLastTeam; }
                }
                ++normalCount;
                if (normalCount === lastTeam){ normalCount = 0; }
            });
        });
        return gamesTemplate;
    }
    
    matchdayAndMatchesSchedule () {
        this.groupsReady.map((group) => {
            const boardOfGamesPerGroup= this.matchdaysAndMatchesBoardPerGroup(group);
            matchdayAndMatchesScheduleComplete.push(boardOfGamesPerGroup);
        }); 
    }
    
    printGroups (groupIndex) {
        console.log(`\n\nGrupo ${GROUPS[groupIndex]}`);
        console.log("---------------------------------------");
        const groupToPrint= this.groupsReady[groupIndex];
        groupToPrint.map(team => {
            console.log(team);
        });
    }    
    
    getTeamName (teamNumber, groupIndex){
        const group = this.groupsReady[groupIndex];
        return group[teamNumber];
    }
    
    printRoundsPerEachGroup () {
        console.log("\nGrupos y Equipos");
        console.log("=======================================");
        matchdayAndMatchesScheduleComplete.map((boardPerGroup,boardPerGroupIndex) => {
            this.printGroups(boardPerGroupIndex);
            boardPerGroup.map((round, roundIndex) => {
                console.log(`\nJornada ${roundIndex+1}:`)
                round.map(match => {
                    console.log(`-${this.getTeamName(match[HOME],boardPerGroupIndex)} vs ${this.getTeamName(match[AWAY],boardPerGroupIndex)}`)
                })
            });
        });
    }
    

    
    assignGamesPlayed (teamIndex, teamAgainstIndex, goalsFor) {
        teamsWithInformation[teamIndex].teamsAgainst[teamAgainstIndex] = goalsFor;
    }
    
    assignPoints (teamIndex, goalsFor, goalsAgainst) {
        if (goalsFor > goalsAgainst) {
            teamsWithInformation[teamIndex].points = teamsWithInformation[teamIndex].points + 3;
        } else if (goalsFor === goalsAgainst) {
            teamsWithInformation[teamIndex].points = teamsWithInformation[teamIndex].points + 1;
         }
    }
    
    assignGoals(teamIndex, goalsFor, goalsAgainst) {
        teamsWithInformation[teamIndex].goalsFor = teamsWithInformation[teamIndex].goalsFor + goalsFor;
        teamsWithInformation[teamIndex].goalsAgainst = teamsWithInformation[teamIndex].goalsAgainst + goalsAgainst;
        teamsWithInformation[teamIndex].goalsDifference = teamsWithInformation[teamIndex].goalsFor - teamsWithInformation[teamIndex].goalsAgainst;
    }

    locateTeamIndex (groupIndex, teamIndex) {
        return groupIndex * 4 + teamIndex;
    }
    
    assignResultsToTeam(groupIndex, teamIndex, goalsFor, teamAgainstIndex, goalsAgainst) {
        const teamLocation = this.locateTeamIndex(groupIndex, teamIndex);
        const teamAgainstLocation = this.locateTeamIndex(groupIndex, teamAgainstIndex);
        this.assignGamesPlayed (teamLocation, teamAgainstLocation, goalsFor);
        this.assignPoints (teamLocation, goalsFor, goalsAgainst);
        this.assignGoals (teamLocation, goalsFor, goalsAgainst);
    }
    
    orderRoundByPoints (roundWithInformation) {
        roundWithInformation.sort((teamInfo1,teamInfo2) => {
            return teamInfo2.points - teamInfo1.points;
        });
        return roundWithInformation;
    }
    
    createRanking(groupIndex){ //it doesn't assign to teamsWithInformation, just to ranking array and pass to next test
        const start = groupIndex * 4;
        const end =  groupIndex * 4 + 4;
        this.ranking = teamsWithInformation.slice(start,end)
    }
    
    updateTeamsWithInformation(groupIndex) {
        const index = locateTeamIndex(groupIndex, 0);
        this.teamsWithInformation.splice(index, 4, ranking)
    }
    
    sortRankingByPoints() {
        this.ranking.sort((teamB, teamA) => {
            return teamA.points - teamB.points;
        });
    }
    
    sortRankingByWhoWinAndAlphabetic() {
        this.ranking.sort((teamB, teamA) => {
            if (teamA.points === teamB.points) {
                const indexGoalsFromAToB = teamsWithInformation.findIndex( team => {return team.name === teamB.name} );
                const indexGoalsFromBToA = teamsWithInformation.findIndex( team => {return team.name === teamA.name} );
    
                const goalsFromAToB = teamA.teamsAgainst[indexGoalsFromAToB];
                const goalsFromBToA = teamB.teamsAgainst[indexGoalsFromBToA];
    
                const matchPlayed = (goalsFromAToB !== -1 && goalsFromBToA !== -1) ? true : false;
    
                if (matchPlayed) { //then teams have already played
    
                    //console.log(teamA.name," jugo contra ", this.allTeams[indexGoalsFromAToB]," le metio ",goalsFromAToB, "goles")
                    //console.log(teamB.name," jugo contra ", this.allTeams[indexGoalsFromBToA]," le metio ",goalsFromBToA, "goles")
                    
                    if (goalsFromAToB < goalsFromBToA) {
                        return -1;
                    }
                    if (goalsFromBToA > goalsFromAToB) {
                        return 1;
                    }
                    if (goalsFromAToB === goalsFromBToA) {
                        if (teamA.name > teamB.name) {
                            //console.log(teamB.name, " va primero que ", teamA.name, " en orden alfabetico")
                            return -1
                        }
                        if (teamA.name < teamB.name) {
                            //console.log(teamA," y ",teamB," ya estan en orden alfabetico");
                            return 1
                        }
                    }
                }
            } else {
                return 1;
            }
        });
    }
    
    rankingPerGroup() {
        groupPhaseRanking.push(this.ranking);
    }
    
    rankingPerRound(groupIndex) {
        this.createRanking(groupIndex);
        this.sortRankingByPoints();
        this.sortRankingByWhoWinAndAlphabetic();
      console.table(this.ranking, ["name","points","goalsFor","goalsAgainst","goalsDifference"]);
    }
    
    playGamesOfGroupStage() {
        console.log ("\n===============================================================================");
        console.log ("========================== COMIENZA EL MUNDIAL ================================");
        console.log ("===============================================================================\n");
        matchdayAndMatchesScheduleComplete.map((group,groupIndex) => {
            group.map((round, roundIndex) => {
                console.log(`Grupo ${GROUPS[groupIndex]} - Jornada ${roundIndex+1}:`);
                console.log("----------------------------------------");
                round.map(match => { //match[0] and match [1] just contain a pointer to "teamsWithInformation array"
                    const goalsForTeam1 = this.play();
                    const goalsForTeam2 = this.play();
                    console.log(`-${this.getTeamName(match[HOME], groupIndex)} ${goalsForTeam1} - ${goalsForTeam2} ${this.getTeamName(match[AWAY], groupIndex)} \n`)
                    this.assignResultsToTeam(groupIndex, match[HOME], goalsForTeam1, match[AWAY], goalsForTeam2);
                    this.assignResultsToTeam(groupIndex, match[AWAY], goalsForTeam2, match[HOME], goalsForTeam1);
                })
                this.rankingPerRound(groupIndex);
            });
            this.rankingPerGroup();
        });
    }
}