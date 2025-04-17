// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Chat {
    struct Message {
        address sender;
        string text;
        uint256 timestamp;
    }

    Message[] private messages;

    mapping(address => uint[]) private userMessageIndexes;

    address public owner;
    uint256 public maxMessageLength = 200;

    event MessageSent(address indexed sender, string text, uint256 timestamp);
    event ChatCleared(address indexed by);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function sendMessage(string calldata _text) external {
        require(bytes(_text).length > 0, "Message cannot be empty");
        require(bytes(_text).length <= maxMessageLength, "Message too long");

        messages.push(Message(msg.sender, _text, block.timestamp));
        userMessageIndexes[msg.sender].push(messages.length - 1);

        emit MessageSent(msg.sender, _text, block.timestamp);
    }

    function getAllMessages() external view returns (Message[] memory) {
        return messages;
    }

    function getMessagesByUser(address _user) external view returns (Message[] memory) {
        uint[] storage indexes = userMessageIndexes[_user];
        Message[] memory result = new Message[](indexes.length);

        for (uint i = 0; i < indexes.length; i++) {
            result[i] = messages[indexes[i]];
        }

        return result;
    }

    function getMessageCount() external view returns (uint) {
        return messages.length;
    }

    function setMaxMessageLength(uint _length) external onlyOwner {
        require(_length > 0, "Length must be positive");
        maxMessageLength = _length;
    }

    function clearChat() external onlyOwner {
        delete messages;
        // Reset user indexes
        for (uint i = 0; i < messages.length; i++) {
            delete userMessageIndexes[messages[i].sender];
        }
        emit ChatCleared(msg.sender);
    }
}
