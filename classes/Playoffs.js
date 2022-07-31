import Euro, { GROUPS } from "./euro.js";
import {groupPhaseRanking} from "./Euro.js"

const GROUPSPHASE = 0;
const ROUNDOF16 = 1;
const QUARTER = 2;
const SEMIFINAL = 3;
const SEMIFINALRESULTS = 4
const FINAL = 5;

const TEXTROUNDOF16 =   "=========== OCTAVOS DE FINAL ===============\n";
const TEXTQUARTER =   "\n=========== CUARTOS DE FINAL ===============\n";
const TEXTSEMIFINAL = "\n============== SEMIFINALES =================\n";
const TEXT3RD4TH =    "\n========= TERCER Y CUARTO PUESTO============\n";
const TEXTFINAL =     "\n================= FINAL ====================\n";

let sideFocused = 0;

export default class Playoffs extends Euro {
    constructor (){
        super ();
        this.goalsTeam1 = 0;
        this.goalsTeam2 = 0;
        this.nameTeam1 = "";
        this.nameTeam2 = "";

        this.team1 = {};
        this.team2 = {};
        this.winner = {};

        this.sideLeft = [];
        this.sideRight = [];

        this.sideLeftPlayoff = [];
        this.sideRightPlayoff = [];
        this.playoffIndex = -1;
        this.finalIndex = 1;

        this.playOffs();
    }

    initializedSideLeftAndSideRight () {
        for (let a = 0; a <= 5; ++a) {
            const tournamentsLeft = [];
            const tournamentsRight = [];
            for (let b = 0; b < 8; ++b) {
                const teamLeft = {}
                const teamRight = {}
                tournamentsLeft.push(teamLeft);
                tournamentsRight.push(teamRight);
            }
            this.sideLeft.push(tournamentsLeft)
            this.sideRight.push(tournamentsRight)
        }
    }

    theBestTwoOfEachGroup () {
        const FIRSTPLACE = 0;
        const SECONDPLACE = 1;
        const teamsSideLeft = [];
        const teamsSideRight = [];

        groupPhaseRanking.map((group, groupIndex) => {
            group.map((team, teamIndex) => {
                if ((groupIndex+1) %2 !== 0) { //if index is odd
                    if(teamIndex === FIRSTPLACE) {
                        teamsSideLeft.push(team);
                    } else if (teamIndex === SECONDPLACE) {
                        teamsSideRight.push(team);
                    }
                } else {
                    if(teamIndex === SECONDPLACE) {
                        teamsSideLeft.push(team);
                    } else if (teamIndex === FIRSTPLACE) {
                        teamsSideRight.push(team);
                    }
                }
            });
        });
        this.sideLeft[GROUPSPHASE] = Object.assign({}, teamsSideLeft);
        this.sideRight[GROUPSPHASE]  = Object.assign({}, teamsSideRight);
    }

    playMatch() {
        this.goalsTeam1 = 0;
        this.goalsTeam2 = 0;
        do {
            this.goalsTeam1 =this.play();
            this.goalsTeam2 = this.play();
        } while (this.goalsTeam1 === this.goalsTeam2)
    }

    nextSchedule(winner, loser, sideFocused, playoff) {
        let sideFocusedNextPlayoff = [];
        let finalists = [];
        switch(sideFocused) {
            case 1:
                sideFocusedNextPlayoff = this.sideLeft[playoff];
            break;
            case 2:
                sideFocusedNextPlayoff = this.sideRight[playoff];
            break;
        };
        sideFocusedNextPlayoff[this.playoffIndex].name = winner.name; 

        if (playoff === SEMIFINALRESULTS) {
            if(winner.name !== undefined) {
                finalists = this.sideLeft[FINAL];
                ++this.finalIndex;
                finalists[this.finalIndex].name = winner.name;
                finalists[this.finalIndex - 2].name = loser.name;
            }
        }
    };

    assignResults(winner, loser, index, sideFocused, positionOfIndex, playoff) {
        let sideFocusedPlayoff = [];
        let index1 = -1;
        let index2 = -1;
        switch(sideFocused) {
            case 1:
                sideFocusedPlayoff = this.sideLeft[playoff];

            break;
            case 2:
                sideFocusedPlayoff = this.sideRight[playoff];
            break;
        }
        switch(positionOfIndex) {
            case 1:
                index1 = index -1;
                index2 = index;
            break;
            case 2:
                index1 = index;
                index2 = index - 1;
            break;
        }

        sideFocusedPlayoff[index1] = Object.assign({}, winner);
        sideFocusedPlayoff[index2] = Object.assign({}, loser);

        if (playoff !== FINAL) {
            this.nextSchedule(winner, loser, sideFocused, playoff + 1); 
        }


    }

    playSidesPlayoffs(team,teamIndex,sideFocused,playoff) {
        if ((teamIndex+1) %2 !== 0) { //if index is odd
            this.nameTeam1 = team.name; //team contains name and goalsfor
            ++this.playoffIndex;
        } else {
            this.nameTeam2 = team.name; //team contains name and goalsfor
            this.playMatch();
            let winner = {};
            let loser = {};
            let positionOfIndex = 0;
            if (this.goalsTeam1 > this.goalsTeam2) {
                winner = { name: this.nameTeam1, goalsFor: this.goalsTeam1 };
                loser = { name: this.nameTeam2, goalsFor: this.goalsTeam2 }
                positionOfIndex = 1;
            } else {
                winner = { name: this.nameTeam2, goalsFor: this.goalsTeam2 };
                loser = { name: this.nameTeam1, goalsFor: this.goalsTeam1 }
                positionOfIndex = 2;
            }
                this.assignResults(winner, loser, teamIndex, sideFocused, positionOfIndex, playoff);

                this.nameTeam1 = "";
                this.nameTeam2 = "";
        }
    }

    playGamesOfPlayoffs(playoff, textToShow) {
        let playoffToCheck = playoff;
        if (playoff === ROUNDOF16) {playoffToCheck = playoff - 1}

        this.sideLeftPlayoff = this.sideLeft[playoffToCheck];
        this.sideRightPlayoff = this.sideRight[playoffToCheck];

        this.sideLeftPlayoff = Object.values(this.sideLeftPlayoff);
        this.sideRightPlayoff = Object.values(this.sideRightPlayoff);

        this.playoffIndex = -1;
        this.sideLeftPlayoff.map((team, teamIndex) => {
            sideFocused = 1;
            this.playSidesPlayoffs(team,teamIndex,sideFocused,playoff)
        })

        this.playoffIndex = -1;
        this.sideRightPlayoff.map((team, teamIndex) => {
            sideFocused = 2;
            this.playSidesPlayoffs(team,teamIndex,sideFocused,playoff)
        })

        this.printStandingsOfEachSide(textToShow, playoff);
    }

    printSides(team, teamIndex, playoff) {
        if ((teamIndex+1) %2 !== 0) { //if index is odd
            this.team1 = team;
        } else {
            this.team2 = team;
            if (this.team1.goalsFor > this.team2.goalsFor) {
                this.winner = this.team1;
            } else {
                this.winner = this.team2;
            }
            
            if (this.team1.name !== undefined) {
                if (playoff === FINAL && teamIndex === 1) { console.log(TEXT3RD4TH); } 
                if (playoff === FINAL && teamIndex === 3) { console.log(TEXTFINAL); } 

                console.log(`${this.team1.name} ${this.team1.goalsFor} - ${this.team2.goalsFor} ${this.team2.name} => ${this.winner.name}`);
                
                if (playoff === FINAL && teamIndex === 3) { 
                    console.log("\n============================================");
                    console.log(`¡${this.team1.name} campeón del mundo!`); 
                    console.log("============================================");
                }
            }
        }
    }

    printStandingsOfEachSide(textToShow, playoff) {
        if (playoff !== FINAL) { console.log(textToShow); }

        this.sideLeftPlayoff = this.sideLeft[playoff];
        this.sideRightPlayoff= this.sideRight[playoff];

        this.sideLeftPlayoff.map((team, teamIndex) => {
            this.printSides(team, teamIndex, playoff);
        });
        this.sideRightPlayoff.map((team, teamIndex) => {
            this.printSides(team, teamIndex, playoff);
        });
    }

    playOffs() {
        console.log("============================================");
        console.log("=== COMIENZO DE LA FASE DE ELIMINATORIAS ===");
        console.log("============================================\n");
        this.initializedSideLeftAndSideRight();
        this.theBestTwoOfEachGroup();
        this.playGamesOfPlayoffs(ROUNDOF16, TEXTROUNDOF16);
        this.playGamesOfPlayoffs(QUARTER, TEXTQUARTER);
        this.playGamesOfPlayoffs(SEMIFINAL, TEXTSEMIFINAL);
        this.playGamesOfPlayoffs(FINAL, TEXTFINAL);

    }
}