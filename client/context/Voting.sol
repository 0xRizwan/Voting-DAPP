// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Voting {

    address public admin;
    string public eventName;
    uint public totalVote;
    bool votingStarted;
    address public winnerAddress;
    
    // Details of candidate who is standing for election.
    struct Candidate{
        string name;
        uint age;
        bool registered;
        address candidateAddress;
        uint votes;
    }
    
    // Details of voters. Address are hidden for voters. It will be captured in whitelist
    struct Voter{
        bool registered;
        bool voted;
    }
    
    // Create mapping for candidates
    mapping(address=>uint) public candidates;

    Candidate[] public candidateList;

    mapping(address=>Voter) public voterList;

    event Success(string message);
    
    // constructor shall be initilased at the time of contract deployment.
    constructor(string memory _eventName){
        admin = msg.sender;
        eventName = _eventName;
        totalVote = 0;
        votingStarted=false;
    }

    // Create modifier function to adopt DRY.
    modifier onlyAdmin() {
        require(admin == msg.sender, "Only admin are authorized to access this function.");
        _;
    }
    
    // Registeration for candidates who are standing for election
    function registerCandidates(string memory _name, uint _age, address _candidateAddress) public onlyAdmin{
        require(_candidateAddress != admin, "Admin can not participate in voting!!");
        require(candidates[_candidateAddress] == 0, "Candidate is already registered");
        Candidate memory candidate = Candidate({
            name: _name,
            age: _age,
            registered: true,
            votes: 0,
            candidateAddress: _candidateAddress
        });

        //not pushing any candidate on location zero;
        if(candidateList.length == 0){ 
            candidateList.push();
        }

        candidates[_candidateAddress] = candidateList.length;
        candidateList.push(candidate);
        emit Success("Candidate is successfully registered!!");
    }

    function whiteListAddress(address _voterAddress) public onlyAdmin {
        require(_voterAddress != admin, "Admin can not be whiteListed!!");
        require(voterList[_voterAddress].registered == false, "Voter is already registered!!");
        require(candidates[_voterAddress] == 0, "Address is already registered as candidate");
        Voter memory voter = Voter({
            registered: true,
            voted: false
        });

        voterList[_voterAddress] = voter;
        emit Success("Voter is successfully registered!!");
    }

    function startVoting() public onlyAdmin {
        votingStarted = true;
        emit Success("Voting is started!!");
    }

    function Vote(address _candidateAddress) public {
        require(votingStarted == true, "Voting is not started yet or ended!!");
        require(msg.sender != admin, "Admin can not vote!!");
        require(voterList[msg.sender].registered == true, "Voter is not registered!!");
        require(voterList[msg.sender].voted == false, "Already voted!!");
        require(candidateList[candidates[_candidateAddress]].registered == true, "Candidate not registered");

        candidateList[candidates[_candidateAddress]].votes++;
        voterList[msg.sender].voted =true;

        uint candidateVotes = candidateList[candidates[_candidateAddress]].votes;

        if(totalVote < candidateVotes){
            totalVote = candidateVotes;
            winnerAddress = _candidateAddress;
        }
        emit Success("Congrats, You have successfully Voted !!");
        
    }

    function stopVoting() public onlyAdmin{
        votingStarted = false;
        emit Success("Voting stoped!!");
    }

    function getAllCandidate() public view returns(Candidate[] memory list){
        return candidateList;
    }

    function votingStatus() public view returns(bool){
        return votingStarted;
    }

    function getWinner() public onlyAdmin view returns(Candidate memory candidate){
        return candidateList[candidates[winnerAddress]];
    }
}