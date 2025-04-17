// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Chat {
    struct Message {
        address sender;
        string text;
    }

    Message[] private messages;

    event MessageSent(address indexed sender, string text);

    function sendMessage(string calldata _text) public {
        messages.push(Message(msg.sender, _text));
        emit MessageSent(msg.sender, _text);
    }

    function getMessages() public view returns (Message[] memory) {
        return messages;
    }

    function getMessageCount() public view returns (uint) {
        return messages.length;
    }
}