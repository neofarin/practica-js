import GroupStage from "./classes/GroupStage.js"
import allTeams from "./all-teams.js";
import Playoffs from "./classes/Playoffs.js";

const groupStage = new GroupStage(allTeams);

const playoffs = new Playoffs(allTeams);


