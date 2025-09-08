// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Lottery {
    enum LotteryState { OPEN, CALCULATING_WINNER, CLOSED }
    error Lottery__NotOpen();
    error Lottery__IncorrectValue();
    error Lottery__TransferFailed();
    error Lottery__NotEnoughPlayers();
    error Lottery__NotReadyToPickWinner();

    uint256 public immutable i_ticketPrice;
    uint256 public immutable i_maxPlayers;
    address payable public immutable i_admin;
    uint256 public immutable i_commitBlock;

    LotteryState private s_lotteryState;
    address payable[] public s_players;
    address public s_winner;
    uint256 public s_commitBlock;
    uint256 public s_revealBlock;

    event LotteryEntered(address indexed player);
    event WinnerCalculationStarted(uint256 indexed commitBlock, uint256 indexed revealBlock);
    event WinnerPicked(address indexed winner, uint256 amount);
    event AdminFeePaid(address indexed admin, uint256 amount);

    constructor(
        uint256 ticketPrice,
        uint256 maxPlayers,
        address payable admin
    ) {
        if (maxPlayers == 0) revert Lottery__NotEnoughPlayers();
        
        i_ticketPrice = ticketPrice;
        i_maxPlayers = maxPlayers;
        i_admin = admin;
        i_commitBlock = block.number;
        
        s_lotteryState = LotteryState.OPEN;
    }

    function enter() public payable {
        if (s_lotteryState != LotteryState.OPEN) revert Lottery__NotOpen();
        if (msg.value != i_ticketPrice) revert Lottery__IncorrectValue();

        s_players.push(payable(msg.sender));
        emit LotteryEntered(msg.sender);

        if (s_players.length == i_maxPlayers) {
            s_lotteryState = LotteryState.CALCULATING_WINNER;
            s_commitBlock = block.number;
            s_revealBlock = block.number + 2; // Wait 2 blocks for better randomness
            emit WinnerCalculationStarted(s_commitBlock, s_revealBlock);
        }
    }

    function pickWinner() public {
        if (s_lotteryState != LotteryState.CALCULATING_WINNER) revert Lottery__NotOpen();
        if (block.number < s_revealBlock) revert Lottery__NotReadyToPickWinner();

        // Use block hash for randomness (free and secure enough for most use cases)
        uint256 randomSeed = uint256(keccak256(abi.encodePacked(
            blockhash(s_revealBlock),
            block.timestamp,
            block.prevrandao,
            s_players.length
        )));
        
        uint256 winnerIndex = randomSeed % s_players.length;
        s_winner = s_players[winnerIndex];
        s_lotteryState = LotteryState.CLOSED;

        uint256 totalPool = address(this).balance;
        uint256 winnerShare = (totalPool * 80) / 100;
        uint256 adminShare = totalPool - winnerShare;

        (bool successWinner, ) = s_winner.call{value: winnerShare}("");
        if (!successWinner) revert Lottery__TransferFailed();
        emit WinnerPicked(s_winner, winnerShare);

        (bool successAdmin, ) = i_admin.call{value: adminShare}("");
        if (!successAdmin) revert Lottery__TransferFailed();
        emit AdminFeePaid(i_admin, adminShare);
    }
    
    function getLotteryState() public view returns (LotteryState) { return s_lotteryState; }
    function getPlayers() public view returns (address payable[] memory) { return s_players; }
    function getCommitBlock() public view returns (uint256) { return s_commitBlock; }
    function getRevealBlock() public view returns (uint256) { return s_revealBlock; }
    function canPickWinner() public view returns (bool) { 
        return s_lotteryState == LotteryState.CALCULATING_WINNER && block.number >= s_revealBlock; 
    }
}

contract LotteryFactory {
    address payable public immutable i_admin;
    address[] public s_deployedLotteries;

    event LotteryCreated(address indexed lotteryAddress, address indexed creator, uint256 ticketPrice, uint256 maxPlayers);

    constructor() {
        i_admin = payable(msg.sender);
    }

    function createLottery(uint256 _ticketPrice, uint256 _maxPlayers) public {
        Lottery newLottery = new Lottery(_ticketPrice, _maxPlayers, i_admin);
        s_deployedLotteries.push(address(newLottery));
        emit LotteryCreated(address(newLottery), msg.sender, _ticketPrice, _maxPlayers);
    }

    function getDeployedLotteries() public view returns (address[] memory) {
        return s_deployedLotteries;
    }
}
